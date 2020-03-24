import { h } from 'https://cdn.pika.dev/preact@10.3.3'
import htm from 'https://cdn.pika.dev/htm@3.0.3'
import css from 'https://cdn.pika.dev/csz@1.2.0'

const html = htm.bind(h)
const round = num => parseFloat(num).toFixed(2)

const style = {
  aside: css`
    grid-area: graph;

    display: flex;
    flex-direction: column;
    justify-content: center;

    padding: 3rem 3rem 4rem;
    overflow-x: auto;
    max-width: 100vw;

    & div > div + div {
      margin-left: 1rem;
    }
  `,
  graph: css`
    margin: 0 auto;
    flex: 1 1 100%;
    padding: 4rem 3rem 3rem;
    display: flex;
  `,
  title: css`
    text-align: center;
    width: 100%;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.62);
    font-size: 1.2rem;
    flex: none;
    padding: 0;
    font-weight: bold;
    min-width: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    outline: none;
    max-width: 100%;
  `,
  result: css`
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  bar: css`
    display: flex;
    align-items: flex-end;
    background: rgba(0, 0, 0, 0.1);
    height: 100%;
    border-radius: 5px;
    overflow: hidden;
  `,
  label: css`
    width: 3rem;
    margin-top: 1rem;
    height: 1rem;
    text-align: center;
    font-weight: 100;
    color: rgba(255, 255, 255, 0.5);
  `,
  spinner: css`
    width: 1rem;
    height: 1rem;
    opacity: 0.5;
  `,
  id: css`
    width: 2rem;
    height: 2rem;
    flex: none;
    background: rgba(0, 0, 0, 0.2);
    color: rgba(255, 255, 255, 0.62);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
  `,
}

const getColor = value => `hsl(${(value * 120).toString(10)},62%,50%)`

const Bar = tests => (test, i) => {
  const max = Math.max(...tests.map(x => x.ops))
  const percent = test.ops ? (test.ops / max) * 100 : 0
  return html`
    <div className=${style.result}>
      <div className=${style.bar}>
        <span
          style=${{
            width: '3px',
            transition: 'height 0.3s, background 0.3s',
            height: `${test.ops === -1 ? 100 : test.ops === -2 ? 0 : percent}%`,
            background: test.ops === -1 ? getColor(0) : getColor(percent / 100),
          }}
        ></span>
      </div>
      <p className=${style.id}>${i + 1}</p>
      <div className=${style.label}>
        ${test.ops === -1 || test.ops === -2
          ? 0
          : test.ops === 0
          ? html`
              <img className=${style.spinner} src="/spinner.gif" />
            `
          : `${percent << 0}%`}
      </div>
    </div>
  `
}

export default ({ state, dispatch }) => {
  const { tests, title, started } = state
  return html`
    <aside className=${style.aside}>
      <div className="aside-toggle">
        <button disabled="true" onClick=${() => dispatch({ aside: 'results' })}>
          <svg width="20" height="20" viewBox="0 0 16 16" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M16 14v1H0V0h1v14h15zM5 13H3V8h2v5zm4 0H7V3h2v10zm4 0h-2V6h2v7z"
            ></path>
          </svg>
          <span>Results</span>
        </button>
        <button onClick=${() => dispatch({ aside: 'tests' })}>
          <svg width="20" height="20" viewBox="0 0 14 16" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M13 2H1v2h12V2zM0 4a1 1 0 001 1v9a1 1 0 001 1h10a1 1 0 001-1V5a1 1 0 001-1V2a1 1 0 00-1-1H1a1 1 0 00-1 1v2zm2 1h10v9H2V5zm2 3h6V7H4v1z"
            ></path>
          </svg>
          <span>Archive</span>
        </button>
      </div>
      <div className=${style.graph}>
        ${tests.filter(x => x.ops !== -2).map(Bar(tests))}
      </div>
      <input
        disabled=${started}
        className=${style.title}
        onInput=${e => dispatch({ title: e.target.value })}
        value=${title}
      />
    </aside>
  `
}
