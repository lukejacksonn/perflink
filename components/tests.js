import Test from './test.js'
import Editor from './editor.js'
const { highlight, languages } = Prism

export default ({
  before,
  setBefore,
  tests,
  setTests,
  started,
  setStarted,
}) => html`
  <article>
    <h1
      className=${css`
        padding: 0 0.62rem;
      `}
    >
      Global Environment
    </h1>
    <${Editor}
      value=${before}
      onValueChange=${setBefore}
      highlight=${code => highlight(code, languages.js)}
      padding=${20}
      style=${{
        width: '100%',
        fontFamily: 'monospace',
        color: '#fff',
        fontSize: 16,
        backgroundColor: '#212121',
        color: 'rgb(255, 255, 255)',
        borderRadius: '1rem',
      }}
    />
    <div
      className=${css`
        display: flex;
        align-items: center;
        padding: 0 0.62rem;
      `}
    >
      <h1>Test Cases</h1>
      <div
        className=${css`
          margin-left: auto;
        `}
      >
        <button onClick=${e => setTests(['', ...tests])}>
          Create
        </button>
        <button onClick=${e => setStarted(!started)}>
          Run All
        </button>
      </div>
    </div>
    <ul>
      ${tests.map(
        (value, i) => html`
          <${Test}
            tests=${tests}
            setTests=${setTests}
            started=${started}
            id=${i}
            value=${value}
          />
        `
      )}
    </ul>
  </article>
`
