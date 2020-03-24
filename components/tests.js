import { h } from 'https://cdn.pika.dev/preact@10.3.3'
import htm from 'https://cdn.pika.dev/htm@3.0.3'
import css from 'https://cdn.pika.dev/csz@1.2.0'
import uid from 'https://cdn.pika.dev/uid'
import { CopyIcon, CloseIcon, SaveIcon } from './icons.js'
import Editor from './editor.js'

const html = htm.bind(h)
const { highlight, languages } = Prism
const round = num => parseFloat(num).toFixed(0)
const insert = (arr, index, newItem) => [
  ...arr.slice(0, index),
  newItem,
  ...arr.slice(index),
]

const style = {
  editor: {
    width: '100%',
    backgroundColor: '#2a2b2f',
    color: 'rgb(255, 255, 255)',
    borderRadius: '1rem',
    fontFamily: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New'",
    lineHeight: '170%',
  },
  add: css`
    color: lightblue;
    border-radius: 1rem;
    border: 2px solid lightblue;
    opacity: 0.7;
    display: flex;
    align-items: center;
    &:disabled {
      opacity: 0.38;
      cursor: wait;
    }
    > * + * {
      margin-left: 0.62rem;
    }
    svg {
      fill: lightblue;
    }
  `,
  start: css`
    color: lightblue;
    border: 2px solid lightblue;
    border-radius: 1rem 0rem 0rem 1rem;
    height: 3rem;
    display: flex;
    align-items: center;
    &:disabled {
      opacity: 0.38;
      cursor: wait;
    }
    > * + * {
      margin-left: 0.62rem;
    }
    :disabled svg {
      animation: rotate 1s linear infinite;
    }
    svg {
      fill: lightblue;
    }
    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `,
  save: css`
    color: lightblue;
    border: 2px solid lightblue;
    height: 3rem;
    border-radius: 0 1rem 1rem 0;
    border-left: 0;
    svg {
      fill: lightblue;
    }
    &:disabled {
      opacity: 0.38;
      cursor: wait;
    }
  `,
  button: css`
    padding: 0;
    border: 0;
    &:disabled {
      opacity: 0.5;
    }
  `,
  spinner: css`
    width: 1rem;
    opacity: 0.5;
  `,
  nameInput: css`
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.62);
    font-size: 1rem;
    flex: 1 1 100%;
    min-width: 0;
    margin-right: 1rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    outline: none;
  `,
  id: css`
    width: 1.62rem;
    height: 1.62rem;
    flex: none;
    background: rgba(0, 0, 0, 0.2);
    color: rgba(255, 255, 255, 0.62);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  cmds: css`
    margin-right: 1rem;
    color: rgba(255, 255, 255, 0.5);
    background: rgba(0, 0, 0, 0.2);
    padding: 0.38rem 0.62rem;
    border-radius: 0.38rem;
    white-space: nowrap;
    font-weight: lighter;
    @media (max-width: 480px) {
      display: none;
    }
  `,
  list: css`
    > * + * {
      margin-top: 1rem;
    }
  `,
  test: css`
    display: flex;
    flex-direction: column;
    border-radius: 1rem;
    background-color: #2a2b2f;
    overflow: hidden;
    color: #fff;
  `,
  testHeader: css`
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.1);
    width: 100%;

    padding: 1rem 1rem;

    button {
      height: 2rem;
    }

    p {
      display: block;
      font-family: monospace;
      background: rgba(0, 0, 0, 0.2);
      padding: 0.38rem;
      border-radius: 0.38rem;
      margin-left: auto;
      white-space: nowrap;
    }
    > * + * {
      margin-left: 1rem;
    }
  `,
}

function commaFormatted(amount) {
  var delimiter = ',' // replace comma if desired
  var a = amount.split('.', 2)
  var d = a[1]
  var i = parseInt(a[0])
  if (isNaN(i)) {
    return ''
  }
  var minus = ''
  if (i < 0) {
    minus = '-'
  }
  i = Math.abs(i)
  var n = new String(i)
  var a = []
  while (n.length > 3) {
    var nn = n.substr(n.length - 3)
    a.unshift(nn)
    n = n.substr(0, n.length - 3)
  }
  if (n.length > 0) {
    a.unshift(n)
  }
  n = a.join(delimiter)
  if (d.length < 1) {
    amount = n
  } else {
    amount = n + '.' + d
  }
  amount = minus + amount
  return amount
}

export const TestControls = ({ id, test, state, dispatch }) => {
  const { tests, runs, duration, progress, started } = state
  return html`
    <div className=${style.testHeader}>
      <small className=${style.id}>${id + 1}</small>
      <input
        disabled=${started}
        className=${style.nameInput}
        onInput=${e => {
          dispatch(state => ({
            tests: tests.map((t, i) =>
              i === id ? { ...t, name: e.target.value } : t
            ),
          }))
        }}
        value=${`${test.name || 'Test Case'}`}
      />
      <p>
        ${test.ops !== -2 &&
          (test.ops === -1
            ? 'Failed'
            : test.ops === 0
            ? `Testing ${((progress / (tests.length * runs)) * 100) << 0}%`
            : `${Number((test.ops * (1000 / duration)) << 0).toLocaleString(
                'en'
              )} ops/s`)}
      </p>
      <button
        disabled=${started}
        className=${style.button}
        onClick=${e => dispatch({ tests: insert(tests, id, tests[id]) })}
      >
        <${CopyIcon} />
      </button>
      <button
        disabled=${started}
        className=${style.button}
        onClick=${e => dispatch({ tests: tests.filter((_, y) => y !== id) })}
      >
        <${CloseIcon} />
      </button>
    </div>
  `
}

let debouncedSetStart
export default ({ state, dispatch }) => {
  const { suites, before, tests, runs, duration, progress, id, title } = state
  return html`
    <article className="tests">
      <div className="tests__header">
        <h3>Globals</h3>
        <b className=${style.cmds}>
          ${navigator.platform.match('Mac') ? '⌘ + ⏎' : 'ctrl+↵'}
        </b>
        <button
          disabled=${state.started}
          className=${style.start}
          onClick=${_ => {
            dispatch({
              tests: tests.map(test => ({ ...test, ops: 0 })),
              started: true,
              progress: 0,
            })
          }}
        >
          <span>Run Test</span>
          <svg width="20" height="20" viewBox="0 0 12 16" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M10.24 7.4a4.15 4.15 0 01-1.2 3.6 4.346 4.346 0 01-5.41.54L4.8 10.4.5 9.8l.6 4.2 1.31-1.26c2.36 1.74 5.7 1.57 7.84-.54a5.876 5.876 0 001.74-4.46l-1.75-.34zM2.96 5a4.346 4.346 0 015.41-.54L7.2 5.6l4.3.6-.6-4.2-1.31 1.26c-2.36-1.74-5.7-1.57-7.85.54C.5 5.03-.06 6.65.01 8.26l1.75.35A4.17 4.17 0 012.96 5z"
            ></path>
          </svg>
        </button>
        <button
          disabled=${state.started}
          className=${style.save}
          onClick=${() => {
            const exists = Object.fromEntries(suites)[id]
            const key = exists ? uid() : id
            localStorage.setItem(
              key,
              JSON.stringify({
                title: exists
                  ? `${title} (${uid(4)})`
                  : title || `Untitled Test (${uid(4)})`,
                before,
                tests,
                updated: new Date(),
              })
            )
            dispatch({
              id: key,
              title: exists
                ? `${title} (${uid(4)})`
                : title || `Untitled Test (${uid(4)})`,
              suites: Object.entries(localStorage).map(([k, v]) => [
                k,
                JSON.parse(v),
              ]),
            })
          }}
        >
          ${Object.fromEntries(suites)[id]
            ? html`
                <svg
                  width="20"
                  height="20"
                  class="octicon octicon-repo-forked"
                  viewBox="0 0 10 16"
                  version="1.1"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 1a1.993 1.993 0 00-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 002 1a1.993 1.993 0 00-1 3.72V6.5l3 3v1.78A1.993 1.993 0 005 15a1.993 1.993 0 001-3.72V9.5l3-3V4.72A1.993 1.993 0 008 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"
                  ></path>
                </svg>
              `
            : html`
                <svg
                  width="20"
                  height="20"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  viewBox="0 0 640 640"
                >
                  <path
                    d="M626.689 15.414zm-55.654 574.472v.011H459.336c-2.09 0-3.79-1.689-3.79-3.767V416.97l-.013-.508c0-4.701-.862-8.599-2.575-11.587a23.657 23.657 0 0 0-1.05-1.618 13.646 13.646 0 0 0-1.23-1.394l-.105-.13c-1.571-1.559-3.544-2.764-5.859-3.59l-1.287-.39-.201-.071h-.035c-2.15-.579-4.571-.874-7.205-.886h-.26l-.402-.012H204.262c-4.618 0-8.433.886-11.35 2.528l-.095.07-1.382.875-.212.189c-.485.354-.957.791-1.394 1.193l-.083.094-.035.036c-3.213 3.271-4.82 8.197-4.82 14.705l-.023.2V586.13h-.012c0 2.08-1.724 3.756-3.78 3.756h-63.874a3.744 3.744 0 0 1-2.681-1.11l-62.906-62.894a3.901 3.901 0 0 1-1.512-3.083V69.474l-.024-.402c0-4.323.78-7.949 2.292-10.795h.011c.284-.555.58-1.016.898-1.5l.13-.166a9.743 9.743 0 0 1 1.3-1.535l.046-.083.13-.13h.012c1.323-1.322 2.965-2.35 4.82-3.094l.188-.095.095-.035.082-.06.945-.318v.012l.071-.036c2.197-.708 4.713-1.05 7.512-1.11l.46-.035h54.202c2.079 0 3.791 1.689 3.791 3.767v227.436c0 2.729.237 5.35.697 7.796a36.732 36.732 0 0 0 2.02 6.992l.07.106.013.036v.012a38.87 38.87 0 0 0 3.472 6.52c1.347 2.019 2.894 4.027 4.713 5.905l.118.094.023.036.036.012a38.841 38.841 0 0 0 8.433 6.638l.06.011.07.024.07.035 1.678.886.024.012 2.09.933v.012l.036.012.012.012h.035v.011c1.713.709 3.472 1.347 5.232 1.784h.036l.165.023.047.012h.178l1.346.284v.012c2.362.448 4.854.708 7.382.732l.106-.012h309.181c5.386 0 10.323-.933 14.847-2.787l.07-.048c4.536-1.866 8.682-4.677 12.473-8.421l.142-.177c1.866-1.878 3.579-3.91 4.996-6.024a36.432 36.432 0 0 0 3.45-6.342l.011-.06.035-.059.036-.118a35.794 35.794 0 0 0 2.138-6.98l.023-.142c.46-2.457.685-5.067.685-7.772V53.871c0-2.079 1.725-3.78 3.827-3.78h53.765c3.047 0 5.693.367 8.008 1.075 2.492.78 4.618 2.032 6.26 3.674 1.346 1.334 2.433 3.023 3.189 4.972l-.024.012.07.095.32.909h-.024l.06.13c.72 2.138 1.05 4.654 1.11 7.406l.047.448v.284l-.024.082v501.727c0 2.906-.378 5.587-1.075 7.855l-.059.165v.012l-.012.118-.413 1.122h-.012l-.118.296-.472 1.039-.071.2-.13.213-.012-.012-.154.308-.755 1.169h-.012l-.26.401-.732.898-.32.354c-.767.815-1.7 1.56-2.74 2.186a17.6 17.6 0 0 1-2.881 1.358l-.331.118c-.839.283-1.76.52-2.74.72l-.095.012-.059.012-.094.024-.45.07-.106.024h-.023l-.083.012c-1.17.165-2.54.283-3.957.307h-.696zM467.912 51.155l-296.248-1.063V262.42h-.024c0 2.386.295 4.465.886 6.272.154.295.224.543.343.78a10.107 10.107 0 0 0 2.078 3.153l.154.142v.011c.295.296.59.544.874.768.307.26.697.496 1.063.709 2.055 1.193 4.795 1.76 8.232 1.76v.011l269 1.312v-.012h.023v.012c4.724 0 8.197-1.099 10.346-3.308 2.186-2.22 3.284-5.716 3.296-10.535h-.024V51.155zM221.177 426.502h79.23v.023c1.842 0 3.377 1.5 3.377 3.343V586.53c0 1.843-1.535 3.367-3.378 3.367h-79.23v-.012c-1.83 0-3.365-1.512-3.365-3.355V429.868c0-1.842 1.535-3.366 3.366-3.366zm405.596 197.672zm-576.15-622h543.55c6.355 0 12.237 1.122 17.67 3.342l2.646 1.17c4.394 2.137 8.469 5.066 12.272 8.799l3.39 3.85 2.929 4.075c4.594 7.217 6.933 15.425 6.933 24.591v543.538c0 6.33-1.122 12.225-3.354 17.693-2.21 5.445-5.516 10.418-9.922 14.988a46.306 46.306 0 0 1-7.724 6.32l-1.323.885a40.453 40.453 0 0 1-5.823 2.989c-5.457 2.29-11.35 3.413-17.705 3.413H90.475l-1.276-1.287-83.576-83.576-5.48-3.638V47.846C-1.7 27.544 14.683 7.89 32.907 5.493c5.469-2.209 11.374-3.319 17.717-3.319z"
                  ></path>
                </svg>
              `}
        </button>
      </div>
      <${Editor}
        value=${before}
        disabled=${state.started}
        onValueChange=${before => dispatch({ before })}
        highlight=${code => highlight(code, languages.js)}
        padding=${20}
        style=${style.editor}
      />
      <div className="tests__header">
        <h3>Test Cases</h3>
        <div>
          <button
            className=${style.add}
            disabled=${state.started}
            onClick=${e =>
              dispatch({ tests: [{ code: '', ops: -2 }, ...tests] })}
          >
            <span>Add Case</span>
            <svg width="20" height="20" viewBox="0 0 12 16" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M12 9H7v5H5V9H0V7h5V2h2v5h5v2z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <ul className=${style.list}>
        ${tests.map(
          (test, id) => html`
            <li key=${id} className=${style.test}>
              <${TestControls}
                id=${id}
                test=${test}
                state=${state}
                dispatch=${dispatch}
              />
              <div className="test__editor">
                <${Editor}
                  key=${id}
                  value=${test.code}
                  disabled=${state.started}
                  onValueChange=${code => {
                    dispatch({
                      tests: tests.map((t, i) =>
                        i == id ? { ...t, code } : t
                      ),
                    })
                  }}
                  highlight=${code => highlight(code, languages.js)}
                  padding=${20}
                />
              </div>
            </li>
          `
        )}
      </ul>
    </article>
  `
}
