import { h, render } from 'https://cdn.pika.dev/preact@10.3.3'
import { useReducer, useEffect } from 'https://cdn.pika.dev/preact@10.3.3/hooks'

import htm from 'https://cdn.pika.dev/htm@3.0.3'
import uid from 'https://cdn.pika.dev/uid'
import css from 'https://cdn.pika.dev/csz'

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

import { ArchiveIcon } from './components/icons.js'

const defaults = {
  started: false,
  dialog: true,
  aside: 'results',
  suites: Object.entries(localStorage).map(([k, v]) => [k, JSON.parse(v)]),
  runs: 100,
  duration: 1,
  progress: 0,
  id: uid(),
  searchTerm: '',
  title: 'Finding numbers in an array of 1000',
  before: `const data = [...Array(1000).keys()]`,
  tests: [
    { name: 'Find item 1000', code: 'data.find(x => x == 100)', ops: 0 },
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

const app = () => {
  const [state, dispatch] = useReducer(reducer, init)
  const {
    before,
    started,
    tests,
    dialog,
    runs,
    title,
    id,
    suites,
    aside,
  } = state

  useEffect(() => {
    if (started) {
      setTimeout(() => {
        ;(async () => {
          const checkScript = await fetchWorkerScript(before, 'check')
          const runScript = await fetchWorkerScript(before, 'run')
          const duration = await Promise.all(
            tests.map(
              test =>
                new Promise(resolve => {
                  const worker = new Worker(checkScript, { type: 'module' })
                  worker.onmessage = e => {
                    resolve(e.data)
                    worker.terminate()
                  }
                  worker.postMessage([test])
                })
            )
          )
          const bench = test =>
            new Promise(resolve => {
              const worker = new Worker(runScript, { type: 'module' })
              worker.onmessage = e => {
                resolve({ ...test, ops: e.data })
                worker.terminate()
              }
              worker.postMessage([test, Math.max(...duration)])
            })
          const tasks = () => () => {
            dispatch(updateProgress)
            return Promise.all(tests.map(bench))
          }
          pSeries(Array.from({ length: runs }, tasks)).then(results =>
            dispatch({ tests: average(results.flat()), started: false })
          )
        })()
      }, 300)
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
    const hotKeys = e => {
      if (e.keyCode == 27) e.preventDefault() || dispatch({ aside: 'results' })
      if (alt(e) && e.keyCode == 13)
        e.preventDefault() || dispatch(startTesting)
      if (alt(e) && e.keyCode == 80)
        e.preventDefault() ||
          dispatch({ aside: aside === 'archive' ? 'results' : 'archive' })
    }
    addEventListener('keydown', hotKeys)
    return () => removeEventListener('keydown', hotKeys)
  }, [aside])

  return html`
    <main className="app">
      <${Tests} state=${state} dispatch=${dispatch} />
      <${Results} state=${state} dispatch=${dispatch} />
      ${state.aside === 'archive' &&
        html`
          <${Archive} state=${state} dispatch=${dispatch} />
        `}
      ${state.aside === 'results' &&
        html`
          <button
            className=${css`
              position: absolute;
              top: 0;
              right: 0;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              border-radius: 0;
              background: rgba(0, 0, 0, 0.2);
              height: 6rem;
              width: 6rem;
              flex: none;
              border: 0;
              svg {
                width: 2rem;
                height: 2rem;
              }
              > * + * {
                margin-top: 0.38rem;
              }
            `}
            onClick=${() =>
              dispatch({
                aside: state.aside === 'archive' ? 'results' : 'archive',
              })}
          >
            <${ArchiveIcon} />
            <span>Archive</span>
          </button>
        `}
      ${dialog &&
        html`
          <dialog
            className=${css`
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              color: #fff;
              background: rgba(44, 45, 51, 1);
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              border: 0;

              h1 {
                font-size: 16vmin;
              }

              h3 {
                text-transform: uppercase;
                font-weight: bold;
                letter-spacing: 1px;
                text-align: center;
                font-size: 3vmin !important;
                padding: 0 2rem 1rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
              }

              p {
                max-width: 50ex;
                text-align: center;
                line-height: 150%;
                font-size: 3vmin;
              }

              > * + * {
                margin-top: 1rem;
              }

              button {
                color: hotpink;
                border: 1px solid hotpink;
                margin-top: 2rem;
                font-size: 1.2rem;
                height: 4rem;
                padding: 1rem;
              }
            `}
            open
          >
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
