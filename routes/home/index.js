const styles = css`/routes/home/index.css`

import Tests from '../../components/tests.js'
import Results from '../../components/results.js'

const median = xs => xs.sort()[Math.ceil(xs.length / 2)]

export default () => {
  const [before, setBefore] = React.useState(
    `const data = [...Array(12800).keys()]\nconst item = Math.random() * 12800 << 0`
  )
  const [started, setStarted] = React.useState(true)
  const [tests, setTests] = React.useState([
    { code: '' },
    { code: 'data.find(x => x == item)' },
    { code: 'data.find(x => x == 3200)' },
    { code: 'data.find(x => x == 6400)' },
    { code: 'data.find(x => x == 12800)' },
  ])

  React.useEffect(() => {
    if (started) {
      const results = []
      const iterations = 100
      tests.forEach(test => {
        const times = []
        let done = iterations
        while (done > 0) {
          let time
          try {
            time = eval(`() => {
              ${before}
              let start, end
              start = performance.now()
              try {
                ${test.code}
              } catch(e) {}
              end = performance.now()
              return end - start
            }`)()
          } catch (e) {}
          times.push(time || 0)
          done--
        }
        results.push(median(times))
      })

      const max = Math.max(...results)
      const out = tests.map((test, i) => ({
        ...test,
        median: results[i],
        percent: (results[i] / max) * 100,
      }))

      setTests(out)
      setStarted(false)
    }
  }, [started])

  return html`
    <main className=${styles}>
      <${Tests}
        before=${before}
        setBefore=${setBefore}
        tests=${tests}
        setTests=${setTests}
        started=${started}
        setStarted=${setStarted}
      />
      <${Results} tests=${tests} />
    </main>
  `
}
