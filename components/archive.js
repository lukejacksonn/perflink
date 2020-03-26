import { h } from 'https://cdn.pika.dev/preact@10.3.3'
import htm from 'https://cdn.pika.dev/htm@3.0.3'
import css from 'https://cdn.pika.dev/csz@1.2.0'

import { RemoveIcon, GraphIcon, ArchiveIcon } from './icons.js'
import { timeSince, latestLocalStorage } from '../utils.js'

const html = htm.bind(h)

const suite = dispatch => ([id, { title, before, tests, updated }]) =>
  html`
    <li className=${style.item}>
      <div
        key=${id}
        onClick=${() =>
          dispatch({ id, title, before, tests, aside: 'results' })}
      >
        <h4>${title}</h4>
        <small>
          ${tests.length} test cases updated ${timeSince(new Date(updated))} ago
        </small>
      </div>
      <button
        onClick=${() => {
          localStorage.removeItem(id)
          dispatch(latestLocalStorage)
        }}
      >
        <${RemoveIcon} />
      </button>
    </li>
  `

export default ({ state, dispatch }) => {
  const { suites } = state

  return html`
    <aside className=${style.container}>
      <div className="aside-toggle">
        <button onClick=${() => dispatch({ aside: 'results' })}>
          <${GraphIcon} />
          <span>Results</span>
        </button>
        <button disabled="true" onClick=${() => dispatch({ aside: 'tests' })}>
          <${ArchiveIcon} />
          <span>Archive</span>
        </button>
      </div>
      <ul className=${style.list}>
        ${suites
          .sort(([k, v], [k1, v1]) =>
            +new Date(v.updated) < +new Date(v1.updated) ? 0 : -1
          )
          .map(suite(dispatch))}
      </ul>
    </aside>
  `
}

const style = {
  container: css`
    display: flex;
    flex-direction: column;
    width: 100%;
    color: rgba(255, 255, 255, 0.62);
    padding: 3rem 2rem 3rem;
    > * + * {
      margin-top: 3rem;
    }
    @media (min-width: 480px) {
      padding: 3rem 3rem 3rem;
      > * + * {
        margin-top: 2rem;
      }
    }
  `,
  list: css`
    flex: 1 1 100%;
    border-radius: 1rem;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background: rgba(0, 0, 0, 0.1);
    padding: 2rem;
    > * + * {
      padding-top: 1rem;
      border-top: 1px solid rgba(0, 0, 0, 0.2);
    }
  `,
  item: css`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    opacity: 0.9;
    padding: 1rem 0rem;
    &:hover {
      opacity: 1;
    }
    &:first-child {
      padding-top: 0;
    }
    > * + * {
      margin-left: 1rem;
    }
    > div {
      cursor: pointer;
      flex: 1 1 100%;
      > * {
        display: block;
      }
      > * + * {
        margin-top: 0.38rem;
      }
      overflow: hidden;
    }
    h4 {
      font-size: 1.1rem;
      line-height: 150%;
    }
    small {
      color: rgba(255, 255, 255, 0.38);
    }
    button {
      border: 0;
      padding: 0;
    }
  `,
}
