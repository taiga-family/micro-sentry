import { MicroSentryClient } from './micro-sentry-client';

describe('MiniSentryClient', () => {
  let dsn: string;
  let client: MicroSentryClient;

  beforeAll(() => {
    dsn =
      'https://e94e4f105efd426fad3edb6736b008fc@subdomen.domen.ru/common/sentry/52';
    client = new MicroSentryClient({ dsn });
  });

  it('If there is no dsn, it is created, but with empty apiUrl and authHeader', () => {
    const disabledClient = new MicroSentryClient({});

    expect(disabledClient.apiUrl).toBeUndefined();
    expect(disabledClient.authHeader).toBeUndefined();
  });

  it('apiUrl is correct', () => {
    expect(client.apiUrl).toEqual(
      'https://subdomen.domen.ru/common/sentry/api/52/store/'
    );
  });

  it('authHeader is correct', () => {
    expect(client.authHeader).toEqual(
      'Sentry sentry_version=7,sentry_key=e94e4f105efd426fad3edb6736b008fc'
    );
  });

  it('should extract sentry_key for key with hypen', () => {
    dsn = 'https://public-with_hypen@subdomain.domain.io/123';
    client = new MicroSentryClient({ dsn });

    expect(client.authHeader).toEqual(
      'Sentry sentry_version=7,sentry_key=public-with_hypen'
    );
  });

  it('should create api url for key with hypen', () => {
    dsn = 'https://public-with_hypen@subdomain.domain.io/123';
    client = new MicroSentryClient({ dsn });

    expect(client.apiUrl).toEqual('https://subdomain.domain.io/api/123/store/');
  });

  it('payload to send to Sentry is correct', () => {
    expect(
      client.prepare({ name: 'Error', message: 'error message', stack: '' })
    ).toEqual({
      exception: {
        values: [
          {
            stacktrace: {
              frames: [],
            },
            type: 'Error',
            value: 'error message',
          },
        ],
      },
      platform: 'javascript',
      sdk: {
        name: 'micro-sentry.javascript.core',
        version: expect.any(String),
      },
      timestamp: expect.any(Number),
    });
  });
});
