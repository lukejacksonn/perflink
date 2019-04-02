import { CopyIcon, CloseIcon } from './icons.js'
import Editor from './editor.js'
const { highlight, languages } = Prism

const round = num => parseFloat(num).toFixed(0)

const insert = (arr, index, newItem) => [
  ...arr.slice(0, index),
  newItem,
  ...arr.slice(index),
]

const style = {
  editor: {
    width: '100%',
    fontSize: 16,
    backgroundColor: '#2a2b2f',
    color: 'rgb(255, 255, 255)',
    borderRadius: '1rem',
    fontFamily: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New'",
    lineHeight: '170%',
  },
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
    display: flex;
    align-items: center;
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

export const TestControls = ({ id, test, tests, setTests }) => {
  return html`
    <div className="test__controls">
      <p>
        ${test.error ? 'Failed' : `${round(test.median * 1000 || 0)} μs`}
      </p>
      <button
        className=${style.button}
        onClick=${e => setTests(insert(tests, id, tests[id]))}
      >
        <${CopyIcon} />
      </button>
      <button
        className=${style.button}
        onClick=${e => setTests(tests.filter((_, y) => y !== id))}
      >
        <${CloseIcon} />
      </button>
    </div>
  `
}

let debouncedSetStart
export default ({ before, setBefore, tests, setTests, setStarted }) => {
  !debouncedSetStart && (debouncedSetStart = debounce(setStarted, 500))
  return html`
    <article className="tests">
      <div className="tests__header">
        <h3>Setup Code</h3>
        <div>
          <button
            className=${style.start}
            onClick=${_ => {
              setTests(tests.map(test => ({ ...test, median: 0 })))
              debouncedSetStart(true)
            }}
          >
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
      <div className="tests__header">
        <h3>Test Cases</h3>
        <div>
          <button
            className=${style.add}
            onClick=${e => setTests([{ code: '', median: 0 }, ...tests])}
          >
            Add Case
          </button>
        </div>
      </div>
      <ul>
        ${tests.map(
          (test, id) => html`
            <li key=${id} className="test">
              <div className="test__editor">
                <${Editor}
                  key=${id}
                  value=${test.code}
                  onValueChange=${code => {
                    setTests(
                      tests.map((t, i) => (i == id ? { ...t, code } : t))
                    )
                    debouncedSetStart(true)
                  }}
                  highlight=${code => highlight(code, languages.js)}
                  padding=${20}
                />
              </div>
              <${TestControls}
                id=${id}
                tests=${tests}
                test=${test}
                setTests=${setTests}
              />
            </li>
          `
        )}
      </ul>
    </article>
  `
}
