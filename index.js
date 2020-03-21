import { h, render } from 'https://cdn.pika.dev/preact@10.3.3'
import {
  useReducer,
  useState,
  useEffect,
} from 'https://cdn.pika.dev/preact@10.3.3/hooks'

import htm from 'https://cdn.pika.dev/htm@3.0.3'
import css from 'https://cdn.pika.dev/csz@1.2.0'

const html = htm.bind(h)

import Tests from '../../components/tests.js'
import Results from '../../components/results.js'

const median = xs => xs.sort()[Math.ceil(xs.length / 2)]
const mean = arr => arr.reduce((p, c) => p + c, 0) / arr.length

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

const pReduce = (iterable, reducer, initialValue) =>
  new Promise((resolve, reject) => {
    const iterator = iterable[Symbol.iterator]()
    let index = 0

    const next = async total => {
      const element = iterator.next()

      if (element.done) {
        resolve(total)
        return
      }

      try {
        const value = await Promise.all([total, element.value])
        next(reducer(value[0], value[1], index++))
      } catch (error) {
        reject(error)
      }
    }

    next(initialValue)
  })

const pSeries = async tasks => {
  const results = []

  await pReduce(tasks, async (_, task) => {
    const value = await task()
    results.push(value)
  })

  return results
}

function average(arr) {
  var sums = {},
    counts = {},
    results = [],
    name
  for (var i = 0; i < arr.length; i++) {
    name = arr[i].code
    if (!(name in sums)) {
      sums[name] = 0
      counts[name] = 0
    }
    sums[name] += arr[i].ops
    counts[name]++
  }

  for (name in sums) {
    results.push({ code: name, ops: (sums[name] / counts[name]) << 0 })
  }
  return results
}

const app = () => {
  const [state, dispatch] = useReducer(reducer, init)
  const { before, started, tests, dialog } = state

  useEffect(() => {
    if (started) {
      const tasks = () => () =>
        pSeries(
          tests.map(test => () =>
            new Promise((resolve, reject) => {
              var worker = new Worker('/run.js')
              worker.postMessage([before, test])
              worker.onmessage = e => resolve(e.data)
            })
          )
        )
      pSeries(Array.from({ length: 10 }, tasks)).then(results => {
        dispatch({ tests: average(results.flat()), started: false })
      })
    }
  }, [started, tests])

  useEffect(() => {
    history.replaceState(
      null,
      null,
      `#${btoa(before)}/${btoa(JSON.stringify(tests))}`
    )
  }, [tests])

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

render(
  html`
    <${app} />
  `,
  document.body
)

// import htm from 'https://unpkg.com/htm@2.1.1/dist/htm.mjs'
// import csz from 'https://unpkg.com/csz@0.1.2/index.js'

// import(location.hostname === 'localhost'
//   ? 'https://unpkg.com/es-react@16.8.30/index.js'
//   : 'https://unpkg.com/es-react-production@16.8.30/index.js').then(app)

// function app({ React, ReactDOM }) {
//   window.React = React
//   window.css = csz
//   window.html = htm.bind(React.createElement)

//   const Fallback = html`
//     <div></div>
//   `
//   const Route = {
//     '/': React.lazy(() => import('./routes/home/index.js')),
//     '*': React.lazy(() => import('./routes/notfound/index.js')),
//   }

//   ReactDOM.render(
//     html`
//       <${React.Suspense} fallback=${Fallback}>
//         <${Route[location.pathname] || Route['*']} />
//       <//>
//     `,
//     document.body
//   )
// }
