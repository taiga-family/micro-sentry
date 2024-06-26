import { Severity } from './severity';
import { Breadcrumb } from './breadcrumb';

export interface SentryFrame {
  colno: number | null;
  lineno: number | null;
  filename: string;
  function: string;
  in_app?: unknown;
}

export interface SentryException {
  type: string;
  value: string;
  stacktrace?: { frames: SentryFrame[] };
}

export type DSN = [string, string, string, string, string, string];

export type Tags = Partial<{ [key: string]: string }>;

export type Extras = Partial<{ [key: string]: unknown }>;

export type QueryString =
  | string
  | { [key: string]: string }
  | Array<[string, string]>;

export interface User {
  id?: string;
  ip_address?: string;
  email?: string;
  username?: string;
  [key: string]: unknown;
}

export interface SentryRequestBody {
  exception?: { values: SentryException[] };
  platform: 'javascript';
  sdk: {
    name: string;
    version: string;
  };
  timestamp: number;
  event_id: string;
  request?: {
    query_string?: QueryString;
    url?: string;
    headers?: {
      'User-Agent': string;
    };
  };
  tags?: Tags;
  extra?: Extras;
  message?: string;
  level?: Severity;
  user?: User;
  breadcrumbs?: Breadcrumb[];
  fingerprint?: string[];
  release?: string;
  environment?: string;
}
