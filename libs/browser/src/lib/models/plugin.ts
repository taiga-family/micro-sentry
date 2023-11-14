import { BrowserMicroSentryClient } from '../services/browser-micro-sentry-client';

export interface MicroSentryPlugin {
  client: BrowserMicroSentryClient;
  destroy?(): void;
}

export interface MicroSentryPluginConstructor {
  new (client: BrowserMicroSentryClient): MicroSentryPlugin;
}
