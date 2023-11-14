import { ErrorHandler, Injectable } from '@angular/core';
import { MicroSentryErrorBusService } from './micro-sentry-error-bus.service';
import { MicroSentryService } from './micro-sentry.service';

@Injectable({ providedIn: 'root' })
export class MicroSentryErrorHandler implements ErrorHandler {
  constructor(
    private errorBus: MicroSentryErrorBusService,
    microSentry: MicroSentryService
  ) {
    errorBus.errors$.subscribe((error) => {
      microSentry.report(error as Error);
    });
  }

  handleError(error: unknown): void {
    this.errorBus.next(error);

    console.error(error);
  }
}
