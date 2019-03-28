const styles = css`/routes/home/index.css`

import Tests from '../../components/tests.js'

const total = xs => xs.reduce((p, c) => p + c, 0)
const median = xs => xs.sort()[Math.ceil(xs.length / 2)]
const round = num => parseFloat(num).toFixed(3)

export default () => {
  const [before, setBefore] = React.useState(
    'const data = [...Array(10000).keys()]'
  )
  const [tests, setTests] = React.useState([
    'data.find(x => x == 1)',
    'data.find(x => x == 9999)',
  ])
  const [started, setStarted] = React.useState(false)
  const [results, setResults] = React.useState([])

  React.useEffect(() => {
    if (started) {
      const results = []
      const iterations = 1000

      ;['', ...tests].forEach((test, i) => {
        const code = eval(`(() => {
          ${before};
          ${test};
        })`)
        const times = []

        let start, end
        let done = iterations
        while (done > 0) {
          start = performance.now()
          code()
          end = performance.now()
          times.push(end - start)
          done--
        }

        i !== 0 &&
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

      console.log(out)

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
        `}
      >
        <div
          className=${css`
            flex: 1 1 100%;
            padding: 2rem;
            display: flex;
            justify-content: center;
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
                    margin-top: 2rem;
                  `}
                >
                  ${results[i] ? round(results[i].median) : `RUN ${i + 1}`}
                </p>
              </div>
            `
          )}
        </div>
      </aside>
    </main>
  `
}
