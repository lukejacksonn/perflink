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
    &:disabled {
      opacity: 0.5;
      cursor: wait;
    }
  `,
  start: css`
    color: lightblue;
    border: 1px solid lightblue;
    &:disabled {
      opacity: 0.5;
      cursor: wait;
    }
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
  spinner: css`
    width: 1.38rem;
    opacity: 0.5;
  `,
}

function commaFormatted(amount) {
  var delimiter = ',' // replace comma if desired
  var a = amount.split('.', 2)
  var d = a[1]
  var i = parseInt(a[0])
  if (isNaN(i)) {
    return ''
  }
  var minus = ''
  if (i < 0) {
    minus = '-'
  }
  i = Math.abs(i)
  var n = new String(i)
  var a = []
  while (n.length > 3) {
    var nn = n.substr(n.length - 3)
    a.unshift(nn)
    n = n.substr(0, n.length - 3)
  }
  if (n.length > 0) {
    a.unshift(n)
  }
  n = a.join(delimiter)
  if (d.length < 1) {
    amount = n
  } else {
    amount = n + '.' + d
  }
  amount = minus + amount
  return amount
}

export const TestControls = ({
  id,
  test,
  tests,
  runs,
  duration,
  progress,
  dispatch,
}) => {
  return html`
    <div className="test__controls">
      <p>
        ${test.ops === -2
          ? 'Untested'
          : test.ops === -1
          ? 'Failed'
          : test.ops === 0
          ? `Testing ${((progress / (tests.length * runs)) * 100) << 0}%`
          : `${Number(test.ops * (1000 / duration)).toLocaleString(
              'en'
            )} ops/s`}
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
  const { before, tests, runs, duration, progress } = state
  return html`
    <article className="tests">
      <div className="tests__header">
        <h3>Setup Code</h3>
        <div>
          <button
            disabled=${state.started}
            className=${style.start}
            onClick=${_ => {
              dispatch({
                tests: tests.map(test => ({ ...test, ops: 0 })),
                started: true,
                progress: 0,
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
            disabled=${state.started}
            onClick=${e =>
              dispatch({ tests: [{ code: '', ops: -2 }, ...tests] })}
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
                runs=${runs}
                duration=${duration}
                progress=${progress}
                dispatch=${dispatch}
              />
            </li>
          `
        )}
      </ul>
    </article>
  `
}
