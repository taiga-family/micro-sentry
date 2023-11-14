import { InjectionToken } from '@angular/core';
import { MonoTypeOperatorFunction } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

export const MICRO_SENTRY_ERRORS_THROTTLE_TIME = 1_000;

export const MICRO_SENTRY_ERRORS_THROTTLE = new InjectionToken<
  MonoTypeOperatorFunction<unknown>
>('Micro sentry error throttle', {
  providedIn: 'root',
  factory(): MonoTypeOperatorFunction<unknown> {
    return (source) =>
      source.pipe(throttleTime(MICRO_SENTRY_ERRORS_THROTTLE_TIME));
  },
});
