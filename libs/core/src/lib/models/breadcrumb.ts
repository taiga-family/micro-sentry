import { Severity } from './severity';

export interface Breadcrumb {
  type?: string;
  level?: Severity;
  event_id?: string;
  category?: string;
  message?: string;
  data?: { [key: string]: unknown };
  timestamp?: number;
}
