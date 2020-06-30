import * as preacts from './library/preact.js'
import * as hooks from './library/hooks.js'
import { css } from './library/goober.js'
import htm from './library/htm.js'

var IDX = 36,
  HEX = ''
while (IDX--) HEX += IDX.toString(36)

function uid(len) {
  var str = '',
    num = len || 11
  while (num--) str += HEX[(Math.random() * 36) | 0]
  return str
}

const html = htm.bind(preacts.h)

const preact = {
  ...preacts,
  ...hooks,
}

export { preact, html, css, uid }

const pReduce = (iterable, reducer, initialValue) =>
  new Promise((resolve, reject) => {
    const iterator = iterable[Symbol.iterator]()
    let index = 0
    const next = async (total) => {
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

export const pSeries = async (tasks) => {
  const results = []
  await pReduce(tasks, async (_, task) => {
    const value = await task()
    results.push(value)
  })
  return results
}

export const average = (arr) => {
  var sums = {},
    counts = {},
    values = {},
    results = [],
    ids = {},
    name
  for (var i = 0; i < arr.length; i++) {
    name = arr[i].code
    if (!(name in sums)) {
      sums[name] = 0
      counts[name] = 0
      ids[name] = arr[i].name
    }
    values[name] = (values[name] || []).concat(arr[i].ops)
    sums[name] += arr[i].ops
    counts[name]++
  }
  for (name in sums) {
    results.push({
      name: ids[name],
      code: name,
      runs: values[name],
      ops: sums[name] < 0 ? -1 : (sums[name] / counts[name]) << 0,
    })
  }
  return results
}

export const toURL = (code, type = 'application/javascript') =>
  URL.createObjectURL(new Blob([code], { type }))

export const timeSince = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000)
  let interval = Math.floor(seconds / 31536000)
  if (interval > 1) return interval + ' years'
  interval = Math.floor(seconds / 2592000)
  if (interval > 1) return interval + ' months'
  interval = Math.floor(seconds / 86400)
  if (interval > 1) return interval + ' days'
  interval = Math.floor(seconds / 3600)
  if (interval > 1) return interval + ' hours'
  interval = Math.floor(seconds / 60)
  if (interval > 1) return interval + ' minutes'
  return Math.floor(seconds) < 5 ? 'just now' : Math.floor(seconds) + ' seconds'
}

export const extractValidSuites = (o) =>
  Object.entries(o).reduce((a, [k, v]) => {
    let suite = {}
    try {
      suite = JSON.parse(v)
    } catch (e) {}
    return suite.before && suite.tests ? [...a, [k, suite]] : a
  }, [])

export const fetchWorkerScript = (before, url) =>
  fetch(`./${url}.js`)
    .then((res) => res.text())
    .then((x) => before + ';' + x)
    .then(toURL)

export const startTesting = (state) => ({
  tests: state.tests.map((test) => ({ ...test, ops: 0 })),
  started: true,
  dialog: false,
  progress: 0,
})

export const latestLocalStorage = () => ({
  suites: extractValidSuites(localStorage),
})

export const updateProgress = (state) => ({
  progress: state.progress + state.tests.length,
})

const insertItemAtIndex = (arr, index, item) => [
  ...arr.slice(0, index),
  item,
  ...arr.slice(index),
]

export const updateTestCaseName = (id, name) => (state) => ({
  tests: state.tests.map((t, i) => (i === id ? { ...t, name } : t)),
})

export const updateTestCaseCode = (id, code) => (state) => ({
  tests: state.tests.map((t, i) => (i === id ? { ...t, code } : t)),
})

export const removeTestCase = (id) => (state) => ({
  tests: state.tests.filter((_, i) => i !== id),
})

export const copyTestCase = (id) => (state) => ({
  tests: insertItemAtIndex(state.tests, id, state.tests[id]),
})

export const addTestCase = (state) => ({
  tests: [{ code: '', name: 'Test Case', ops: -2 }, ...state.tests],
})

export const setSearchTerm = (searchTerm) => (state) => ({
  searchTerm,
})

const { highlight, languages } = Prism
export const highlightCode = (code) => highlight(code, languages.js)

export const getColorForPercent = (value) =>
  `hsl(${(value * 120).toString(10)},62%,50%)`

export const copyHashURL = (state) => {
  const x = JSON.stringify(state)
  const link = `${location.origin}#${encodeURIComponent(btoa(x))}`
  var input = document.createElement('input')
  input.setAttribute('value', link)
  document.body.appendChild(input)
  input.select()
  var result = document.execCommand('copy')
  document.body.removeChild(input)
}

export const decodeState = (encodedState) => {
  try {
    // V2
    return JSON.parse(atob(decodeURIComponent(encodedState)))
  } catch (e) {
    console.log(e)
  }

  try {
    // V1
    return {
      title: '',
      before: atob(location.hash.slice(1).split('/')[0]),
      tests: JSON.parse(atob(location.hash.slice(1).split('/')[1])).map(
        ({ code }, testIndex) => {
          return {
            name: `Test ${testIndex + 1}`,
            code,
            ops: 0,
          }
        }
      ),
    }
  } catch (e) {
    console.log(e)
  }

  return {}
}
