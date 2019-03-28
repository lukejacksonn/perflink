const styles = css`/routes/home/index.css`

import Tests from '../../components/tests.js'

const total = xs => xs.reduce((p, c) => p + c, 0)
const median = xs => xs.sort()[Math.ceil(xs.length / 2)]
const round = num => parseFloat(num).toFixed(3)

export default () => {
  const [before, setBefore] = React.useState(
    'const data = [...Array(12801).keys()]'
  )
  const [tests, setTests] = React.useState([
    'data.find(x => x == 400)',
    'data.find(x => x == 800)',
    'data.find(x => x == 1600)',
    'data.find(x => x == 3200)',
    'data.find(x => x == 6400)',
    'data.find(x => x == 12800)',
  ])
  const [started, setStarted] = React.useState(true)
  const [results, setResults] = React.useState([])

  React.useEffect(() => {
    if (started) {
      const results = []
      const iterations = 100

      tests.forEach((test, i) => {
        const times = []
        let done = iterations
        while (done > 0) {
          times.push(
            eval(`() => {
              ${before}
              let start, end
              start = performance.now()
              ${test}
              end = performance.now()
              return end - start
            }`)()
          )
          done--
        }
        results.push({
          total: total(times),
          median: median(times),
        })
      })

      const max = Math.max(...results.map(x => x.median))
      const out = results.map(result => ({
        ...result,
        percent: (result.median / max) * 100,
      }))

      setResults(out)
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
      <aside
        className=${css`
          display: flex;
          flex-direction: column;
          color: #fff;
          overflow-x: auto;
        `}
      >
        <div
          className=${css`
            margin: 0 auto;
            flex: 1 1 100%;
            padding: 4rem 3rem;
            display: flex;
            align-items: flex-end;
          `}
        >
          ${tests.map(
            (test, i) => html`
              <div
                style=${{
                  marginLeft: i === 0 ? 0 : '2rem',
                }}
                className=${css`
                  display: flex;
                  flex-direction: column;
                  height: 100%;
                `}
              >
                <div
                  className=${css`
                    display: flex;
                    justify-content: center;
                    align-items: flex-end;
                    flex: 1 1 100%;
                  `}
                >
                  <span
                    style=${{
                      width: '1px',
                      height: `${results[i] ? results[i].percent : 100}%`,
                      background: results[i] ? 'rgba(255,255,255,0.8)' : '#000',
                    }}
                  ></span>
                </div>
                <p
                  className=${css`
                    width: 3rem;
                    margin-top: 2rem;
                    text-align: center;
                  `}
                >
                  ${results[i] ? `${round(results[i].median)}` : i + 1}
                </p>
              </div>
            `
          )}
        </div>
      </aside>
    </main>
  `
}
