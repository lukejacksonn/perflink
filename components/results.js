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
  legend: css`
    position: sticky;
    left: 0;
    width: 100%;
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 200;
    padding: 0 0 3rem;
  `,
  spinner: css`
    width: 1rem;
    height: 1rem;
    opacity: 0.5;
  `,
  id: css`
    width: 1.62rem;
    height: 1.62rem;
    flex: none;
    background: rgba(0, 0, 0, 0.38);
    color: rgba(255, 255, 255, 0.62);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
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
            height: `${test.ops === -1 ? 100 : test.ops === -2 ? 0 : percent}%`,
            background: test.ops === -1 ? 'crimson' : 'rgba(255,255,255,0.4)',
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

export default ({ state }) => {
  const { tests } = state
  return html`
    <aside className="graph">
      ${tests.filter(x => x.ops !== -2).map(Bar(tests))}
    </aside>
  `
}
