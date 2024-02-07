import { SentryRequestBody } from '../models/models';
import { AUTH_HEADER, DSN_REGEXP } from '../consts/consts';
import { computeStackTrace } from '../helpers/compute-stack-trace';
import { SentryClientOptions } from '../models/sentry-client-options';
import { uuid4 } from '../helpers/uuid4';

export class MicroSentryClient {
  readonly authHeader?: string;
  readonly apiUrl?: string;
  readonly environment?: string;

  constructor(options: SentryClientOptions) {
    if (options && options.dsn) {
      const searched = DSN_REGEXP.exec(options.dsn);
      const dsn = searched ? searched.slice(1) : [];
      const pathWithProjectId = dsn[5].split('/');
      const path = pathWithProjectId.slice(0, -1).join('/');

      this.apiUrl =
        dsn[0] +
        '://' +
        dsn[3] +
        (dsn[4] ? ':' + dsn[4] : '') +
        (path ? '/' + path : '') +
        '/api/' +
        pathWithProjectId.pop() +
        '/store/';

      this.authHeader =
        'Sentry sentry_version=7,sentry_key=' +
        dsn[1] +
        (dsn[2] ? ',sentry_secret=' + dsn[2] : '');
    }

    this.environment = options && options.environment;
  }

  prepare(error: Error): SentryRequestBody {
    const prepared: SentryRequestBody = {
      ...this.getRequestBlank(),
      exception: { values: [computeStackTrace(error)] },
    };
    prepared.extra ||= {};
    prepared.extra.cause ||= error.cause;
    Object.assign(prepared.extra, error);
    return prepared;
  }

  report(error: Error): void {
    this.send(this.prepare(error));
  }

  protected send(body: SentryRequestBody) {
    if (!this.apiUrl || !body) {
      return;
    }

    this.createRequest(body);
  }

  protected createRequest(body: SentryRequestBody): void {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', this.apiUrl!, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader(AUTH_HEADER, this.authHeader || '');
    xhr.send(JSON.stringify(body));
  }

  protected getRequestBlank(): SentryRequestBody {
    return {
      platform: 'javascript',
      event_id: uuid4(),
      sdk: {
        name: 'micro-sentry.javascript.core',
        version: '0.0.0',
      },
      timestamp: Date.now() / 1000,
      environment: this.environment,
    };
  }
}
