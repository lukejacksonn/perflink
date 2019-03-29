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
    fontSize: 16,
    backgroundColor: '#212121',
    color: 'rgb(255, 255, 255)',
    borderRadius: '1rem',
    fontFamily: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New'",
    lineHeight: '170%',
  },
  header: css`
    display: flex;
    align-items: center;
    padding: 0 1rem 1.62rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    justify-content: space-between;
  `,
  clear: css`
    border: 1px solid red;
  `,
  add: css`
    color: orange;
    border: 1px solid orange;
  `,
  start: css`
    color: lightblue;
    border: 1px solid lightblue;
  `,
  controls: css`
    position: absolute;
    right: 1rem;
    top: 1.4rem;
  `,
  button: css`
    padding: 0;
    border: 0;
  `,
}

function debounce(func, wait, immediate) {
  var timeout
  return function() {
    var context = this,
      args = arguments
    var later = function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

let debouncedSetStart
export default ({ before, setBefore, tests, setTests, setStarted }) => {
  !debouncedSetStart && (debouncedSetStart = debounce(setStarted, 200))
  return html`
    <article>
      <div className=${style.header}>
        <h3>Environment Setup</h3>
        <div>
          <button className=${style.start} onClick=${e => setStarted(true)}>
            Run Benchmark
          </button>
        </div>
      </div>
      <${Editor}
        value=${before}
        onValueChange=${code => {
          setBefore(code)
          debouncedSetStart(true)
        }}
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
                  debouncedSetStart(true)
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
}
