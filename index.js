import { h, render } from 'https://cdn.pika.dev/preact@10.3.3'
import { useReducer, useEffect } from 'https://cdn.pika.dev/preact@10.3.3/hooks'

import htm from 'https://cdn.pika.dev/htm@3.0.3'
import uid from 'https://cdn.pika.dev/uid'

const html = htm.bind(h)

import Tests from './components/tests.js'
import Archive from './components/archive.js'
import Results from './components/results.js'

import {
  pSeries,
  average,
  fetchWorkerScript,
  startTesting,
  latestLocalStorage,
  updateProgress,
} from './utils.js'

const defaults = {
  started: false,
  dialog: true,
  aside: 'results',
  suites: Object.entries(localStorage).map(([k, v]) => [k, JSON.parse(v)]),
  runs: 100,
  duration: 3,
  progress: 0,
  id: uid(),
  title: 'Finding numbers in an array of 1000',
  before: `const data = [...Array(1000).keys()]`,
  tests: [
    { name: 'Find item 2000', code: 'data.find(x => x == 200)', ops: 0 },
    { name: 'Find item 4000', code: 'data.find(x => x == 400)', ops: 0 },
    { name: 'Find item 8000', code: 'data.find(x => x == 800)', ops: 0 },
  ],
}

const init = location.hash
  ? {
      ...defaults,
      dialog: false,
      ...JSON.parse(atob(decodeURIComponent(location.hash.slice(1)))),
    }
  : defaults

const reducer = (state, update) => ({
  ...state,
  ...(typeof update === 'function' ? update(state) : update),
})

const app = ({ WORKER }) => {
  const [state, dispatch] = useReducer(reducer, init)
  const {
    before,
    started,
    tests,
    dialog,
    runs,
    duration,
    title,
    id,
    suites,
  } = state

  useEffect(() => {
    if (started) {
      fetchWorkerScript().then(url => {
        const bench = test => () =>
          new Promise(resolve => {
            const worker = new Worker(url)
            worker.onmessage = e => {
              const ops = (e.data * (1000 / duration)) << 0
              resolve({ ...test, ops })
              worker.terminate()
            }
            worker.postMessage([before, test, duration])
          })
        const tasks = () => () => {
          dispatch(updateProgress)
          return pSeries(tests.map(bench))
        }
        pSeries(Array.from({ length: runs }, tasks)).then(results => {
          dispatch({ tests: average(results.flat()), started: false })
        })
      })
    }
  }, [started, before, tests])

  useEffect(() => {
    const x = JSON.stringify({ id, title, before, tests, updated: new Date() })
    history.replaceState(null, null, `#${encodeURIComponent(btoa(x))}`)
    if (Object.fromEntries(suites)[id]) {
      localStorage.setItem(id, x)
      dispatch(latestLocalStorage)
    }
  }, [id, title, before, tests])

  useEffect(() => {
    const alt = e => (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)
    addEventListener('keydown', e => {
      if (alt(e) && e.keyCode == 13)
        e.preventDefault() || dispatch(startTesting)
    })
  }, [])

  return html`
    <main className="app">
      <${Tests} state=${state} dispatch=${dispatch} />
      ${state.aside === 'results'
        ? html`
            <${Results} state=${state} dispatch=${dispatch} />
          `
        : html`
            <${Archive} state=${state} dispatch=${dispatch} />
          `}
      ${dialog &&
        html`
          <dialog open>
            <h1><i>Perflink</i></h1>
            <p>
              Quick and easy JavaScript benchmarks.
              <br />
              Reliably compare code exectution times in browser.
            </p>
            <button onClick=${() => dispatch({ dialog: false, started: true })}>
              Start Experimenting
            </button>
          </dialog>
        `}
    </main>
  `
}

render(
  html`
    <${app} />
  `,
  document.body
)
