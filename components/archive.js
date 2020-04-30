import {
  html,
  css,
  timeSince,
  latestLocalStorage,
  setSearchTerm,
  copyHashURL,
} from '../utils.js'

import { RemoveIcon, SearchIcon, LinkIcon, ArchiveIcon } from './icons.js'

const suite = (dispatch) => ([id, { title, before, tests, updated }]) =>
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
        onClick=${() =>
          copyHashURL({
            title,
            before,
            tests,
            updated: new Date(),
          })}
      >
        <${LinkIcon} />
      </button>
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
  const { suites, searchTerm, aside } = state
  return aside === 'results'
    ? html`
        <button
          className=${style.showArchiveButton}
          onClick=${() =>
            dispatch({
              aside: state.aside === 'archive' ? 'results' : 'archive',
            })}
        >
          <${ArchiveIcon} />
          <span>Archive</span>
        </button>
      `
    : html`
        <dialog
          className=${style.container}
          onClick=${(e) =>
            e.target.tagName === 'DIALOG' && dispatch({ aside: 'results' })}
        >
          <div>
            <div className=${style.searchInput}>
              <input
                onInput=${(e) => dispatch(setSearchTerm(e.target.value))}
                placeholder="Search the archive..."
                value=${searchTerm}
              />
              <${SearchIcon} />
            </div>
            <ul className=${style.list}>
              ${suites
                .filter((x) =>
                  x[1].title.toLowerCase().match(searchTerm.toLowerCase())
                )
                .sort(([k, v], [k1, v1]) =>
                  +new Date(v.updated) < +new Date(v1.updated) ? 0 : -1
                )
                .map(suite(dispatch))}
            </ul>
          </div>
        </dialog>
      `
}

const style = {
  container: css`
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(37, 38, 42, 0.62);

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
    > div {
      box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
      margin: auto;
      width: 100%;
      height: 100%;
      max-width: 70ch;
      background: #2f3037;
      padding: 2rem;
      border-radius: 1rem;
      display: flex;
      flex-direction: column;
      > * + * {
        margin-top: 2rem;
      }
      @media (max-width: 480px) {
        padding: 1rem;
        > * + * {
          margin-top: 1rem;
        }
      }
    }
  `,
  list: css`
    flex: 0 1 100%;
    border-radius: 1rem;
    overflow-y: scroll;
    overscroll-behavior: contain;
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
  searchInput: css`
    position: relative;
    width: 100%;
    input {
      width: 100%;
      padding: 0 2rem;
      height: 5rem;
      font-size: 1.62rem;
      color: rgba(255, 255, 255, 0.8);
      background: rgba(0, 0, 0, 0.2);
      border: 0;
      border-radius: 1rem;
    }
    svg {
      position: absolute;
      top: 50%;
      right: 2rem;
      width: 2rem;
      height: 2rem;
      transform: translateY(-50%);
    }
  `,
  showArchiveButton: css`
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 0;
    background: rgba(0, 0, 0, 0.2);
    height: 6rem;
    width: 6rem;
    flex: none;
    border: 0;
    svg {
      width: 2rem;
      height: 2rem;
    }
    > * + * {
      margin-top: 0.38rem;
    }
  `,
}
