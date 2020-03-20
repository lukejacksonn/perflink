import Tests from '../../components/tests.js'
import Results from '../../components/results.js'

const median = xs => xs.sort()[Math.ceil(xs.length / 2)]
const init = location.hash
  ? {
      started: true,
      dialog: false,
      before: atob(location.hash.slice(1).split('/')[0]),
      tests: JSON.parse(atob(location.hash.slice(1).split('/')[1])),
    }
  : {
      started: false,
      dialog: true,
      before: `const data = [...Array(10000).keys()]`,
      tests: [
        { code: '' },
        { code: 'data.find(x => x == 5000)' },
        { code: 'data.find(x => x == 10000)' },
      ],
    }

const reducer = (state, update) => ({
  ...state,
  ...(typeof update === 'function' ? update(state) : update),
})

export default () => {
  const [state, dispatch] = React.useReducer(reducer, init)
  const { before, started, tests, dialog } = state

  React.useEffect(() => {
    if (started) {
      !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) &&
        alert(
          'Safari does not provide high enough resolution timers to support benchmarking. Please try another browser.'
        )

      const iterations = 100
      const results = tests.map(test => {
        const times = []
        try {
          let done = iterations
          while (done > 0) {
            let time
            time = eval(`() => {
              ${before};
              let start, end;
              start = performance.now();
              ${test.code};
              end = performance.now();
              return end - start;
            }`)()
            times.push(time)
            done--
          }
          return {
            ...test,
            error: false,
            median: median(times),
          }
        } catch (e) {
          return {
            ...test,
            error: true,
            median: 0,
          }
        }
      })

      history.replaceState(
        null,
        null,
        `#${btoa(before)}/${btoa(JSON.stringify(results))}`
      )

      dispatch({ tests: results, started: false })
    }
  }, [started])

  return html`
    <main className="app">
      <${Tests} state=${state} dispatch=${dispatch} />
      <${Results} state=${state} />
      ${dialog &&
        html`
          <dialog open>
            <h1><i>Perflink</i></h1>
            <h3>Live Javascript Benchmarking</h3>
            <p>
              Write scripts and race them. See results graphed out as you type.
              Share your findings via URL.
            </p>
            <button
              onClick=${_ => {
                dispatch({ dialog: false, started: true })
              }}
            >
              Start Experimenting
            </button>
          </dialog>
        `}
    </main>
  `
}
