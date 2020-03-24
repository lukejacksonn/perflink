import { h } from 'https://cdn.pika.dev/preact@10.3.3'
import htm from 'https://cdn.pika.dev/htm@3.0.3'
import css from 'https://cdn.pika.dev/csz@1.2.0'
import uid from 'https://cdn.pika.dev/uid'
import { RemoveIcon, SaveIcon } from './icons.js'

const html = htm.bind(h)
const round = num => parseFloat(num).toFixed(2)

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

function timeSince(date) {
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
          dispatch({
            suites: Object.entries(localStorage).map(([k, v]) => [
              k,
              JSON.parse(v),
            ]),
          })
        }}
      >
        <${RemoveIcon} />
      </button>
    </li>
  `

export default ({ state, dispatch }) => {
  const { name, suites, tests } = state

  return html`
    <aside className=${style.container}>
      <div className="aside-toggle">
        <button onClick=${() => dispatch({ aside: 'results' })}>
          <svg width="20" height="20" viewBox="0 0 16 16" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M16 14v1H0V0h1v14h15zM5 13H3V8h2v5zm4 0H7V3h2v10zm4 0h-2V6h2v7z"
            ></path>
          </svg>
          <span>Results</span>
        </button>
        <button disabled="true" onClick=${() => dispatch({ aside: 'tests' })}>
          <svg width="20" height="20" viewBox="0 0 14 16" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M13 2H1v2h12V2zM0 4a1 1 0 001 1v9a1 1 0 001 1h10a1 1 0 001-1V5a1 1 0 001-1V2a1 1 0 00-1-1H1a1 1 0 00-1 1v2zm2 1h10v9H2V5zm2 3h6V7H4v1z"
            ></path>
          </svg>
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
