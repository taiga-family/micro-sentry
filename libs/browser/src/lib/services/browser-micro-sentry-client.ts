import {
  Breadcrumb,
  Extras,
  User,
  MicroSentryClient,
  SentryRequestBody,
  Severity,
  Tags,
  QueryString,
} from '@micro-sentry/core';
import { State } from '../models/state';
import { MicroSentryPlugin } from '../models/plugin';
import { BrowserSentryClientOptions } from '../models/browser-sentry-client-options';
import { isMatchingPattern } from '../utils/is-matching-pattern';

function getWindow(): Window {
  return window;
}

export class BrowserMicroSentryClient extends MicroSentryClient {
  private destroyed = false;
  private readonly plugins: MicroSentryPlugin[];
  private readonly beforeSend: NonNullable<
    BrowserSentryClientOptions['beforeSend']
  >;
  private readonly beforeBreadcrumb: NonNullable<
    BrowserSentryClientOptions['beforeBreadcrumb']
  >;
  private readonly blacklistUrls: NonNullable<
    BrowserSentryClientOptions['blacklistUrls']
  >;
  private readonly ignoreErrors: NonNullable<
    BrowserSentryClientOptions['ignoreErrors']
  >;
  private readonly release?: string;

  constructor(
    private options: BrowserSentryClientOptions,
    readonly window: Window = getWindow()
  ) {
    super(options);

    const {
      plugins = [],
      beforeSend = (req: SentryRequestBody) => req,
      beforeBreadcrumb = (breadcrumb: Breadcrumb) => breadcrumb,
      blacklistUrls = [],
      ignoreErrors = [],
      release = undefined,
    } = this.options || {};

    this.plugins = plugins.map((Plugin) => new Plugin(this));
    this.beforeSend = beforeSend;
    this.beforeBreadcrumb = beforeBreadcrumb;
    this.blacklistUrls = blacklistUrls;
    this.ignoreErrors = ignoreErrors;
    this.release = release;
  }

  protected _state: State = {};

  get state(): State {
    return this._state;
  }

  clearState() {
    this._state = {};
  }

  setTags(tags: Tags): this {
    this.setKeyState('tags', { ...tags });

    return this;
  }

  setTag(key: string, value: string): this {
    this.extendState({ tags: { [key]: value } });

    return this;
  }

  setExtra(key: string, value: string): this {
    this.extendState({ extra: { [key]: value } });

    return this;
  }

  setExtras(extras: Extras): this {
    this.setKeyState('extra', { ...extras });

    return this;
  }

  setUser(user: User | null): this {
    this.setKeyState('user', user ? { ...user } : undefined);

    return this;
  }

  clone(): BrowserMicroSentryClient {
    const client = new BrowserMicroSentryClient({
      ...this.options,
      plugins: [],
    });

    client.extendState(this.state);

    return client;
  }

  withScope(fn: (client: BrowserMicroSentryClient) => void) {
    const clone = this.clone();

    fn(clone);

    clone.destroy();

    this.setBreadcrumbs(undefined);
  }

  addBreadcrumb(breadcrumb: Breadcrumb): void {
    const result = this.beforeBreadcrumb(breadcrumb);

    if (!result) {
      return;
    }

    this.extendState({
      breadcrumbs: [
        {
          timestamp: Date.now() / 1_000,
          ...result,
        },
      ],
    });
  }

  setBreadcrumbs(breadcrumbs: Breadcrumb[] | undefined) {
    this.setKeyState('breadcrumbs', breadcrumbs);
  }

  captureMessage(message: string, level?: Severity) {
    this.send({
      ...this.getRequestBlank(),
      message,
      level,
    });
  }

  destroy() {
    this.destroyed = true;

    this.plugins.forEach((plugin) => {
      if (plugin.destroy) {
        plugin.destroy();
      }
    });
  }

  isIgnoredError(event: SentryRequestBody): boolean {
    if (!this.ignoreErrors.length) {
      return false;
    }

    return this.getPossibleEventMessages(event).some((message) =>
      this.ignoreErrors.some((pattern) => isMatchingPattern(message, pattern))
    );
  }

  extractQueryString(originalUrl: string): QueryString | undefined {
    let url = originalUrl;

    if (!url) {
      return undefined;
    }

    if (url.startsWith('/')) {
      url = `http://prefix${url}`;
    }

    try {
      const queryString = new URL(url).search.slice(1);

      return queryString.length ? queryString : undefined;
    } catch (e) {
      return undefined;
    }
  }

  protected override getRequestBlank(): SentryRequestBody {
    const url = this.window.location.toString();

    return {
      request: {
        url,
        query_string: this.extractQueryString(url),
        headers: {
          'User-Agent': this.window.navigator.userAgent,
        },
      },
      ...super.getRequestBlank(),
      sdk: {
        name: 'micro-sentry.javascript.browser',
        version: '0.0.0',
      },
      ...this.state,
    };
  }

  protected override send(request: SentryRequestBody) {
    if (
      this.destroyed ||
      this.isDeniedUrl(request) ||
      this.isIgnoredError(request)
    ) {
      return;
    }

    const beforeSendResult = this.beforeSend({
      release: this.release,
      ...request,
    });

    if (!beforeSendResult) {
      return;
    }

    super.send(beforeSendResult);

    this.setBreadcrumbs(undefined);
  }

  private getPossibleEventMessages(event: SentryRequestBody): string[] {
    if (event.message) {
      return [event.message];
    }

    if (event.exception) {
      try {
        const { type = '', value = '' } =
          (event.exception.values && event.exception.values[0]) || {};

        return [`${value}`, `${type}: ${value}`];
      } catch (e) {
        return [];
      }
    }

    return [];
  }

  private isDeniedUrl(event: SentryRequestBody): boolean {
    if (!this.blacklistUrls.length) {
      return false;
    }

    const url = this.getEventFilterUrl(event);

    return !url
      ? false
      : this.blacklistUrls.some((pattern) => isMatchingPattern(url, pattern));
  }

  private getEventFilterUrl(event: SentryRequestBody): string | null {
    try {
      if (event.exception) {
        const frames =
          event.exception.values &&
          event.exception.values[0].stacktrace &&
          event.exception.values[0].stacktrace.frames;

        return (frames && frames[frames.length - 1].filename) || null;
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  private extendState(newState: Partial<State>) {
    this._state = (Object.keys(newState) as (keyof State)[]).reduce(
      (acc, key) => {
        const stateValue = this._state[key];
        const stateArray = Array.isArray(stateValue) ? stateValue : null;

        const newStateValue = newState[key];
        const newStateArray = Array.isArray(newStateValue)
          ? newStateValue
          : null;

        return {
          ...acc,
          [key]:
            stateArray || newStateArray
              ? [...(stateArray || []), ...(newStateArray || [])]
              : {
                  ...(typeof stateValue !== 'string' ? stateValue : {}),
                  ...(typeof newStateValue !== 'string' ? newStateValue : {}),
                },
        };
      },
      this._state
    );
  }

  private setKeyState<T extends keyof State>(key: T, value: State[T]) {
    this._state[key] = value;
  }
}
