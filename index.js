import htm from 'https://unpkg.com/htm@2.1.1/dist/htm.mjs'
import csz from 'https://unpkg.com/csz@0.1.2/index.js'

// Call the native `import` if it exists.
// This method isn't parsed initially & throws
// "safely" in Firefox w/o killing the whole app.
function shim(url) {
  try {
    return new Function(`return import('${url}')`).call();
  } catch (tmp) {
    // Relative ~> fully qualified URLs
    (tmp = document.createElement('a')).href = url;
    return __shimport__.load(tmp.href);
  }
}

shim(location.hostname === 'localhost'
  ? 'https://unpkg.com/es-react@16.8.30/index.js'
  : 'https://unpkg.com/es-react-production@16.8.30/index.js').then(app)

function app({ React, ReactDOM }) {
  window.React = React
  window.css = csz
  window.html = htm.bind(React.createElement)

  const Fallback = html`
    <div></div>
  `
  const Route = {
    '/': React.lazy(() => shim('./routes/home/index.js')),
    '*': React.lazy(() => shim('./routes/notfound/index.js')),
  }

  ReactDOM.render(
    html`
      <${React.Suspense} fallback=${Fallback}>
        <${Route[location.pathname] || Route['*']} />
      <//>
    `,
    document.body
  )
}
