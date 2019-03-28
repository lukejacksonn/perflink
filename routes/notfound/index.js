const style = css`/routes/notfound/index.css`

export default () => html`
  <main className=${style}>
    <p>There is not a route for the path <code>${location.pathname}</code></p>
    <a href="/" className="App-link">Go Back Home</a>
  </main>
`
