# Perflink

> JavaScript performance benchmarks that you can share via URL

The motivation here was to create a single page app alternative to (jsperf)[https://jsperf.com] which is commonly used to compare performance characteristics of different Javascript implementations against each other.

## Getting Started

To get started, first clone this repo then run the following command in your terminal (from the project root directory) which will open the app in your preferred browser.

```
$ npx servor
```

> Live reload is enabled by default with [servor](https://github.com/lukejacksonn/servor) so when you make changes to your code the browser will reload the tab and your changes will be reflected there.

## Implementation

This project uses a proprietary version of react called [`es-react`](https://github.com/lukejacksonn/es-react) which allows you to import `React` and `ReactDOM` (version 16.8.3) as an es module from within your app and component files.

```js
import { React, ReactDOM } from 'https://unpkg.com/es-react'
```

To use JSX like syntax without a transpilation step you are going to need to use something like [`htm`](https://github.com/developit/htm) by [Jason Miller](https://github.com/developit). The package is available to import directly from [unpkg.com](https://unpkg.com) and can be configured for react like this:

```js
import htm from 'https://unpkg.com/htm?module'
const html = htm.bind(React.createElement)
```

[Code splitting](https://reactjs.org/docs/code-splitting.html) on route is achieved at runtime thanks to `React.lazy` and `React.Suspense` which provides a solid basis for a scalable architecture where only the code that required is actually requested from the server.

```js
const Route = {
  '/': React.lazy(() => import('./routes/home.js')),
  '*': React.lazy(() => import('./routes/notfound.js')),
}

ReactDOM.render(
  html`
    <${React.Suspense}
      fallback=${html`
        <div></div>
      `}
    >
      <${Route[location.pathname] || Route['*']} />
    <//>
  `,
  document.body
)
```

## Todo

This project is a proof of concept more than anything and still lacks certain features:

- A solution for applying scoped styles to components (something like `emotion` or `styled-components` tagged template literals) that can be imported as an es module.
- A more feature complete router that handles internal links and history navigation (something like `reach-router` or `navi`) and that can be imported as an es module.

The most common limitation I come across is that the popular solutions to these kind of problems rarely export an es module compatible build. If you know of any packages that might accomplish such tasks and that have an es module build then I would love to hear about them so that we can try them out and promote them here!
