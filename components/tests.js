import { CopyIcon, CloseIcon } from './icons.js'
import Editor from './editor.js'
const { highlight, languages } = Prism

const insert = (arr, index, newItem) => [
  ...arr.slice(0, index),
  newItem,
  ...arr.slice(index),
]

const style = {
  editor: {
    width: '100%',
    fontFamily: 'monospace',
    color: '#fff',
    fontSize: 16,
    backgroundColor: '#212121',
    color: 'rgb(255, 255, 255)',
    borderRadius: '1rem',
    fontFamily: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New'",
    lineHeight: '150%',
  },
  header: css`
    display: flex;
    align-items: center;
    padding: 0 1rem 1.38rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    justify-content: space-between;
  `,
  clear: css`
    border: 1px solid red;
  `,
  add: css`
    border: 1px solid green;
  `,
  start: css`
    border: 1px solid blue;
  `,
  controls: css`
    position: absolute;
    right: 1rem;
    top: 1.3rem;
  `,
  button: css`
    padding: 0;
    border: 0;
  `,
}

export default ({
  before,
  setBefore,
  tests,
  setTests,
  started,
  setStarted,
}) => html`
  <article>
    <div className=${style.header}>
      <h3>Environment Setup</h3>
      <div>
        <button
          className=${style.clear}
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
      style=${style.editor}
    />
    <div className=${style.header}>
      <h3>Test Cases</h3>
      <div>
        <button
          className=${style.add}
          onClick=${e => setTests([{ code: '' }, ...tests])}
        >
          Add Case
        </button>
      </div>
    </div>
    <ul>
      ${tests.map(
        (test, id) => html`
          <li key=${id}>
            <${Editor}
              key=${id}
              value=${test.code}
              onValueChange=${code => {
                setTests(tests.map((t, i) => (i == id ? { ...t, code } : t)))
                setStarted(true)
              }}
              highlight=${code => highlight(code, languages.js)}
              padding=${20}
              style=${style.editor}
            />
            <div className=${style.controls}>
              <button
                className=${style.button}
                onClick=${e => setTests(insert(tests, id, tests[id]))}
              >
                <${CopyIcon} //>
              </button>
              <button
                className=${style.button}
                onClick=${e => setTests(tests.filter((_, y) => y !== id))}
              >
                <${CloseIcon} //>
              </button>
            </div>
          </li>
        `
      )}
    </ul>
  </article>
`
