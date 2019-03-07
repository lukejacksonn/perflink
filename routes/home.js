import { React } from 'https://unpkg.com/es-react'

import htm from 'https://unpkg.com/htm?module'
const html = htm.bind(React.createElement)

import Logo from '../components/logo/index.js'

const style = `
  .App {
    text-align: center;
  }

  .App-logo {
    animation: App-logo-spin infinite 20s linear;
    height: 40vmin;
    pointer-events: none;
  }

  .App-header {
    background-color: #282c34;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: white;
  }

  .App-link {
    color: #61dafb;
  }

  @keyframes App-logo-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

export default () => html`
  <div className="App">
    <style>${style}</style>
    <header className="App-header">
      <${Logo} className="App-logo" />
      <p>
        Edit <code>routes/home.js</code> and save to reload.
      </p>
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
