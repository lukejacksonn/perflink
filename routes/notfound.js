import Page from '../components/page.js'
import Link from '../components/link.js'

export default () => html`
  <${Page}>
    <h1>You are lost!</h1>
    <${Link} href='/'>Go Back Home<//>
  <//>
`
