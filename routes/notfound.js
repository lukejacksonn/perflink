import { React } from 'https://unpkg.com/es-react'

import htm from 'https://unpkg.com/htm?module'
const html = htm.bind(React.createElement)

export default () => html`
  <div>
    <h1>You are lost!</h1>
    <a href='/'>Go Back Home</a>
  </div>
`
