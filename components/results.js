import { h } from 'https://cdn.pika.dev/preact@10.3.3'
import htm from 'https://cdn.pika.dev/htm@3.0.3'
import css from 'https://cdn.pika.dev/csz@1.2.0'

const html = htm.bind(h)
const round = num => parseFloat(num).toFixed(2)

const style = {
  aside: css`
    display: flex;
    flex-direction: column;
    color: #fff;
    overflow-x: auto;
  `,
  graph: css`
    margin: 0 auto;
    flex: 1 1 100%;
    padding: 4rem;
    display: flex;
    align-items: flex-end;
  `,
  result: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
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
    text-align: center;
    font-weight: 100;
    color: rgba(255, 255, 255, 0.5);
  `,
  legend: css`
    position: sticky;
    left: 0;
    width: 100%;
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 200;
    padding: 0 0 3rem;
  `,
}

const Bar = tests => (test, i) => {
  const max = Math.max(...tests.map(x => x.ops))
  const percent = test.ops ? (test.ops / max) * 100 : 0
  return html`
    <div className=${style.result}>
      <div className=${style.bar}>
        <span
          style=${{
            width: '3px',
            transition: 'height 0.3s',
            height: `${test.error ? 100 : percent}%`,
            background: test.error ? 'crimson' : 'rgba(255,255,255,0.4)',
          }}
        ></span>
      </div>
      <div className=${style.label}>
        ${percent.toFixed(0)}%
      </div>
    </div>
  `
}

export default ({ state }) => {
  const { tests } = state
  return html`
    <aside className="graph">
      ${tests.map(Bar(tests))}
    </aside>
  `
}
