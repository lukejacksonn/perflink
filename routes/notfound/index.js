import Logo from '../../components/logo.js'
const style = css`/routes/home/index.css`

export default () => html`
  <div className=${style}>
    <header className="App-header">
      <${Logo} className="App-logo" />
      <p>There is not a route for the path <code>${location.pathname}</code></p>
      <a href='/' className='App-link'>Go Back Home</a>
    </header>
  </div>
`
