import Logo from '../../components/logo.js'
const styles = css`/routes/home/index.css`

export default () => html`
  <div className=${styles}>
    <header className="App-header">
      <${Logo} className="App-logo" />
      <p>Edit <code>routes/home.js</code> and save to reload.</p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
  </div>
`
