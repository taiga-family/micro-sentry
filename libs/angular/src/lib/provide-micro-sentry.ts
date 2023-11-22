import { ErrorHandler, Provider } from '@angular/core';
import { BrowserSentryClientOptions } from '@micro-sentry/browser';
import { MicroSentryErrorHandler } from './services/error-handler.service';
import { MICRO_SENTRY_CONFIG } from './tokens/config';

export function provideMicroSentry(
  config: BrowserSentryClientOptions
): Provider[] {
  return [
    {
      provide: ErrorHandler,
      useExisting: MicroSentryErrorHandler,
    },
    {
      provide: MICRO_SENTRY_CONFIG,
      useValue: config,
    },
  ];
}
