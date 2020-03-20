import { h } from 'https://cdn.pika.dev/preact@10.3.3'
import htm from 'https://cdn.pika.dev/htm@3.0.3'
import css from 'https://cdn.pika.dev/csz@1.2.0'
import { CopyIcon, CloseIcon } from './icons.js'
import Editor from './editor.js'

const html = htm.bind(h)
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

export const TestControls = ({ id, test, tests, dispatch }) => {
  return html`
    <div className="test__controls">
      <p>
        ${test.error ? 'Failed' : `${round(test.median * 1000 || 0)} μs`}
      </p>
      <button
        className=${style.button}
        onClick=${e => dispatch({ tests: insert(tests, id, tests[id]) })}
      >
        <${CopyIcon} />
      </button>
      <button
        className=${style.button}
        onClick=${e => dispatch({ tests: tests.filter((_, y) => y !== id) })}
      >
        <${CloseIcon} />
      </button>
    </div>
  `
}

let debouncedSetStart
export default ({ state, dispatch }) => {
  const { before, tests } = state
  return html`
    <article className="tests">
      <div className="tests__header">
        <h3>Setup Code</h3>
        <div>
          <button
            className=${style.start}
            onClick=${_ => {
              dispatch({
                tests: tests.map(test => ({ ...test, median: 0 })),
                started: true,
              })
            }}
          >
            Run Benchmark
          </button>
        </div>
      </div>
      <${Editor}
        value=${before}
        onValueChange=${before => dispatch({ before })}
        highlight=${code => highlight(code, languages.js)}
        padding=${20}
        style=${style.editor}
      />
      <div className="tests__header">
        <h3>Test Cases</h3>
        <div>
          <button
            className=${style.add}
            onClick=${e =>
              dispatch({ tests: [{ code: '', median: 0 }, ...tests] })}
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
                    dispatch({
                      tests: tests.map((t, i) =>
                        i == id ? { ...t, code } : t
                      ),
                    })
                  }}
                  highlight=${code => highlight(code, languages.js)}
                  padding=${20}
                />
              </div>
              <${TestControls}
                id=${id}
                tests=${tests}
                test=${test}
                dispatch=${dispatch}
              />
            </li>
          `
        )}
      </ul>
    </article>
  `
}
