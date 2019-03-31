import htm from 'https://unpkg.com/htm@2.1.1/dist/htm.mjs'
import csz from 'https://unpkg.com/csz@0.1.2/index.js'

import(location.hostname === 'localhost'
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
    '/': React.lazy(() => import('./routes/home/index.js')),
    '*': React.lazy(() => import('./routes/notfound/index.js')),
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
