import { SentryRequestBody } from '@micro-sentry/core';

export interface State
  extends Partial<
    Pick<
      SentryRequestBody,
      'tags' | 'extra' | 'user' | 'breadcrumbs' | 'release'
    >
  > {}
