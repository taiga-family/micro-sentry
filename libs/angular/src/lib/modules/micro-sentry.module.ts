import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserSentryClientOptions } from '@micro-sentry/browser';
import { provideMicroSentry } from '../provide-micro-sentry';

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class MicroSentryModule {
  public static forRoot(
    config: BrowserSentryClientOptions
  ): ModuleWithProviders<MicroSentryModule> {
    return {
      ngModule: MicroSentryModule,
      providers: provideMicroSentry(config),
    };
  }
}
