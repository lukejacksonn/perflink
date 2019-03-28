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
    <div
      className=${css`
        display: flex;
        align-items: center;
        padding: 0 1rem 1.38rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      `}
    >
      <h3>Environment Setup</h3>
      <div
        className=${css`
          margin-left: auto;
        `}
      >
        <button
          className=${css`
            border: 2px solid red;
          `}
          onClick=${e => {
            setStarted(false)
            setBefore('')
            setTests([])
          }}
        >
          Clear All
        </button>
      </div>
    </div>
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
        fontFamily: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New'",
        lineHeight: '150%',
      }}
    />
    <div
      className=${css`
        display: flex;
        align-items: center;
        padding: 0 1rem 1.38rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      `}
    >
      <h3>Test Cases</h3>
      <div
        className=${css`
          margin-left: auto;
        `}
      >
        <button
          className=${css`
            border: 2px solid green;
          `}
          onClick=${e => setTests(['', ...tests])}
        >
          Add Case
        </button>
        <button
          disabled=${started}
          className=${css`
            border: 2px solid blue;
          `}
          onClick=${e => setStarted(!started)}
        >
          Benchmark
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
