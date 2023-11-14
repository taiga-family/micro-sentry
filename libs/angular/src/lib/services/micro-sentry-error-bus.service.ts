import {
  MonoTypeOperatorFunction,
  NextObserver,
  Observable,
  Subject,
} from 'rxjs';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { groupBy, mergeMap } from 'rxjs/operators';
import { MICRO_SENTRY_ERRORS_THROTTLE } from '../tokens/errors-throttle';

@Injectable({ providedIn: 'root' })
export class MicroSentryErrorBusService
  implements NextObserver<unknown>, OnDestroy
{
  private _errors$ = new Subject<unknown>();
  errors$: Observable<unknown>;

  constructor(
    @Inject(MICRO_SENTRY_ERRORS_THROTTLE)
    private throttle: MonoTypeOperatorFunction<unknown>
  ) {
    this.errors$ = this._errors$.pipe(
      groupBy((error) => error?.toString()),
      mergeMap((group) => group.pipe(this.throttle))
    );
  }

  ngOnDestroy(): void {
    this._errors$.complete();
  }

  next(error: unknown): void {
    this._errors$.next(error);
  }
}
