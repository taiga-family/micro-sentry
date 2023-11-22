import { ErrorHandler, Inject, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideMicroSentry } from '@micro-sentry/angular';

import { HttpClientModule } from '@angular/common/http';
import { IS_BROWSER_PLATFORM, IS_SERVER_PLATFORM } from '@ngx-ssr/platform';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
  ],
  providers: [
    provideMicroSentry({
      dsn: 'https://099f64b67a9d4f61985dc20cfc57ca99@o275325.ingest.sentry.io/6484556',
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    errorHandler: ErrorHandler,
    @Inject(IS_SERVER_PLATFORM) isServer: boolean,
    @Inject(IS_BROWSER_PLATFORM) isBrowser: boolean
  ) {
    if (isServer) {
      errorHandler.handleError(new Error('server'));
    }

    if (isBrowser) {
      errorHandler.handleError(new Error('browser'));
    }
  }
}
