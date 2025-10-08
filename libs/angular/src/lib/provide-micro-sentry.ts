import {
  ErrorHandler,
  inject,
  Injector,
  Provider,
  runInInjectionContext,
} from '@angular/core';
import { BrowserSentryClientOptions as BrowserSentryClientOptionsBase } from '@micro-sentry/browser';
import { MicroSentryErrorHandler } from './services/error-handler.service';
import { MICRO_SENTRY_CONFIG } from './tokens/config';

interface BrowserSentryClientOptions extends BrowserSentryClientOptionsBase {
  /**
   * Function executes in injection context
   */
  beforeSend?: BrowserSentryClientOptionsBase['beforeSend'];
  /**
   * Function executes in injection context
   */
  beforeBreadcrumb?: BrowserSentryClientOptionsBase['beforeBreadcrumb'];
}

export function provideMicroSentry({
  beforeSend,
  beforeBreadcrumb,
  ...config
}: BrowserSentryClientOptions): Provider[] {
  return [
    {
      provide: ErrorHandler,
      useExisting: MicroSentryErrorHandler,
    },
    {
      provide: MICRO_SENTRY_CONFIG,
      useFactory: (): BrowserSentryClientOptions => {
        const injector = inject(Injector);

        return {
          ...config,
          beforeSend:
            beforeSend &&
            ((...args) =>
              runInInjectionContext(injector, () => beforeSend(...args))),
          beforeBreadcrumb:
            beforeBreadcrumb &&
            ((...args) =>
              runInInjectionContext(injector, () => beforeBreadcrumb(...args))),
        };
      },
    },
  ];
}
