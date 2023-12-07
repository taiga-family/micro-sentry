# micro-sentry

[![npm version](https://img.shields.io/npm/v/@micro-sentry/angular.svg)](https://npmjs.com/package/@micro-sentry/angular)

[![@micro-sentry/core size](https://deno.bundlejs.com/?q=@micro-sentry/core&badge=detailed)](https://bundlejs.com/?q=@micro-sentry%2Fcore)

[![@micro-sentry/browser size](https://deno.bundlejs.com/?q=@micro-sentry/browser&badge=detailed)](https://bundlejs.com/?q=@micro-sentry/browser)

[![@micro-sentry/angular size](https://deno.bundlejs.com/?q=@micro-sentry/angular&config={%22esbuild%22:{%22external%22:[%22@angular/core%22,%22@angular/common%22,%22tslib%22,%22rxjs%22]}}&badge=detailed)](https://bundlejs.com/?q=@micro-sentry/angular&config={%22esbuild%22:{%22external%22:[%22@angular/core%22,%22@angular/common%22,%22tslib%22,%22rxjs%22]}})

**@micro-sentry** is a tiny sentry client to monitor your applications without raising your bundle size.

## Why is it better than default sentry client?

👜 **It is small**. So, it is at most [2.27 kB (gzip)](https://bundlejs.com/?q=%40micro-sentry%2Fbrowser) in size instead of default [85.1 kB (gzip)](https://bundlejs.com/?q=%40sentry%2Fbrowser), yet it retains all the the essential functionality.

🛠 **It is easy to set up**. There is a lightweight wrapper for Angular and a browser tool for other frameworks or vanilla.

Check out all the [core functionality here](#core-functionality).

## Installation

Angular:

| Micro-sentry version | Angular version |
| -------------------- | --------------- |
| `>= 6`               | `>= 14`         |
| `>= 5`               | `>= 13`         |
| `>= 4`               | `>= 12`         |
| `>= 3`               | `>= 11`         |
| `>= 2`               | `>= 10`         |

```
npm i @micro-sentry/angular
```

Other:

```
npm i @micro-sentry/browser
```

> [!NOTE]
> since version @micro-sentry/browser@7 breadcrumbs-plugin is a separate package

```
npm i @micro-sentry/breadcrumbs-plugin
```

## How to set up

### Angular

You can use provide api in standalone applications:

```typescript
import { provideMicroSentry } from '@micro-sentry/angular';

bootstrapApplication(AppComponent, {
  providers: [
    provideMicroSentry({
      dsn: 'https://kj12kj1n23@sentry.domain.com/123',
    }),
  ],
});
```

Or add it into `app.module.ts` of your application:

```typescript
import { MicroSentryModule } from '@micro-sentry/angular';

@NgModule({
  imports: [
    // options 1: via module
    MicroSentryModule.forRoot({
      dsn: 'https://kj12kj1n23@sentry.domain.com/123',
    }),
  ],
  providers: [
    // option 2: via provide
    provideMicroSentry({
      dsn: 'https://kj12kj1n23@sentry.domain.com/123',
    }),
  ],
})
export class AppModule {}
```

### Javascript / Typescript

If you do not use Angular framework, you can install `@micro-sentry/browser` module to create client manually.

```ts
const client = new BrowserMicroSentryClient({
  dsn: 'https://kj12kj1n23@sentry.domain.com/123',
});

try {
  // your app code
} catch (e) {
  client.report(e);
}
```

## Core Functionality

- 📤 **Send Errors with Stack Trace**
- 📩 **Send Messages**
- 🚫 **Ignore URLs | Errors**: With strings or RegExps
- 🍞 **Breadcrumbs plugin**: Track and manage the sequence of events leading up to an error for comprehensive debugging
- 🌟 **Enrich Errors with Tags, User, Context**: Augment error reports with additional context, user information, and tags for deeper insights

This list encapsulates the key functionalities supported by micro-sentry, emphasizing its focus on essential error tracking and management.

## Core team

<table>
    <tr>
       <td align="center">
            <a href="https://twitter.com/katsuba_igor"
                ><img
                    src="https://github.com/IKatsuba.png?size=100"
                    width="100"
                    style="margin-bottom: -4px; border-radius: 8px;"
                    alt="Igor Katsuba"
                /><br /><sub><b>Igor Katsuba</b></sub></a
            >
            <div style="margin-top: 4px">
                <a
                    href="https://twitter.com/katsuba_igor"
                    title="Twitter"
                    ><img
                        style="width: 16px;"
                        width="16"
                        src="https://raw.githubusercontent.com/MarsiBarsi/readme-icons/main/twitter.svg"
                /></a>
                <a href="https://github.com/IKatsuba" title="Github"
                    ><img
                        width="16"
                        src="https://raw.githubusercontent.com/MarsiBarsi/readme-icons/main/github.svg"
                /></a>
                <a
                    href="https://t.me/Katsuba"
                    title="Telegram"
                    ><img
                        width="16"
                        src="https://raw.githubusercontent.com/MarsiBarsi/readme-icons/main/send.svg"
                /></a>
            </div>
        </td>
        <td align="center">
            <a href="https://twitter.com/marsibarsi"
                ><img
                    src="https://github.com/marsibarsi.png?size=100"
                    width="100"
                    style="margin-bottom: -4px; border-radius: 8px;"
                    alt="Roman Sedov"
                /><br /><b>Roman Sedov</b></a
            >
            <div style="margin-top: 4px">
                <a
                    href="https://twitter.com/marsibarsi"
                    title="Twitter"
                    ><img
                        width="16"
                        src="https://raw.githubusercontent.com/MarsiBarsi/readme-icons/main/twitter.svg"
                /></a>
                <a
                    href="https://github.com/marsibarsi"
                    title="GitHub"
                    ><img
                        width="16"
                        src="https://raw.githubusercontent.com/MarsiBarsi/readme-icons/main/github.svg"
                /></a>
                <a
                    href="https://t.me/marsibarsi"
                    title="Telegram"
                    ><img
                        width="16"
                        src="https://raw.githubusercontent.com/MarsiBarsi/readme-icons/main/send.svg"
                /></a>
            </div>
        </td>
    </tr>

</table>

## License

🆓 Feel free to use our library in your commercial and private applications

All micro-sentry packages are covered by [Apache 2.0](/LICENSE)

Read more about this license [here](https://choosealicense.com/licenses/apache-2.0/)
