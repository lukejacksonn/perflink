import {
  html,
  css,
  uid,
  startTesting,
  latestLocalStorage,
  updateTestCaseName,
  removeTestCase,
  addTestCase,
  copyTestCase,
  updateTestCaseCode,
  highlightCode,
} from '../utils.js'

import {
  CopyIcon,
  CloseIcon,
  RunIcon,
  ForkIcon,
  SaveIcon,
  AddIcon,
} from './icons.js'

import Editor from './editor.js'

export const TestControls = ({ id, test, state, dispatch }) => {
  const { tests, runs, progress, started } = state
  const progressPercent = ((progress / (tests.length * runs)) * 100) << 0
  return html`
    <div className=${style.testHeader}>
      <small className=${style.id}>${id + 1}</small>
      <input
        disabled=${started}
        className=${style.nameInput}
        onInput=${(e) => dispatch(updateTestCaseName(id, e.target.value))}
        value=${`${test.name}`}
      />
      <p>
        ${test.ops !== -2 &&
        (test.ops === -1
          ? 'Failed'
          : test.ops === 0
          ? `Testing ${progressPercent}%`
          : `${Number(test.ops).toLocaleString('en')} ops/s`)}
      </p>
      <button
        disabled=${started}
        className=${style.button}
        onClick=${(e) => dispatch(copyTestCase(id))}
      >
        <${CopyIcon} />
      </button>
      <button
        disabled=${started}
        className=${style.button}
        onClick=${(e) => dispatch(removeTestCase(id))}
      >
        <${CloseIcon} />
      </button>
    </div>
  `
}

export default ({ state, dispatch }) => {
  const { suites, before, tests, id, title, started, dialog } = state
  return html`
    <article className="tests">
      <div className=${style.testToolbar}>
        <h3>Globals</h3>
        <b className=${style.cmds}>
          ${navigator.platform.match('Mac') ? '⌘ + ⏎' : 'ctrl + ⏎'}
        </b>
        <button
          disabled=${started}
          data-animate=${dialog}
          className=${style.start}
          onClick=${() => dispatch(startTesting)}
        >
          <span>Run Tests</span>
          <${RunIcon} />
        </button>
        <button
          disabled=${started}
          className=${style.save}
          onClick=${() => {
            const exists = Object.fromEntries(suites)[id]
            const t = exists ? uid() : title || uid()
            const key = exists ? uid() : id
            const data = { title: t, before, tests, updated: new Date() }
            localStorage.setItem(key, JSON.stringify(data))
            dispatch({ id: key, title, ...latestLocalStorage() })
          }}
        >
          ${Object.fromEntries(suites)[id]
            ? html` <${ForkIcon} /> `
            : html` <${SaveIcon} /> `}
        </button>
      </div>
      <${Editor}
        value=${before}
        disabled=${started}
        onValueChange=${(before) => dispatch({ before })}
        highlight=${highlightCode}
        padding=${20}
        style=${style.editor}
      />
      <div className=${style.testToolbar}>
        <h3>Test Cases</h3>
        <div>
          <button
            className=${style.add}
            disabled=${started}
            onClick=${() => dispatch(addTestCase)}
          >
            <span>Add Case</span>
            <${AddIcon} />
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
              <${Editor}
                key=${id}
                value=${test.code}
                disabled=${started}
                onValueChange=${(code) =>
                  dispatch(updateTestCaseCode(id, code))}
                highlight=${highlightCode}
                padding=${20}
                style=${style.editor}
              />
            </li>
          `
        )}
      </ul>
    </article>
  `
}

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
    display: flex;
    align-items: center;
    font-weight: bold;
    &:disabled {
      opacity: 0.38;
      cursor: wait;
    }
    > * + * {
      margin-left: 0.62rem;
    }
    svg {
      width: 1.1rem;
      height: 1.1rem;
      fill: lightblue;
    }
  `,
  start: css`
    color: lightblue;
    border: 2px solid lightblue;
    border-radius: 1rem 0rem 0rem 1rem;
    height: 3rem;
    display: flex;
    font-weight: bold;
    align-items: center;
    &:disabled {
      opacity: 0.38;
      cursor: wait;
    }
    &[data-animate='true'] {
      background: #303037;
      z-index: 1;
      animation: pulse 1s ease-in-out infinite;
    }
    > * + * {
      margin-left: 0.62rem;
    }
    &:disabled svg {
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
    @keyframes pulse {
      from {
        transform: scale(1.038);
      }
      50% {
        transform: scale(1.1);
      }
      to {
        transform: scale(1.038);
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
    > svg {
      fill: rgba(255, 255, 255, 0.62);
    }
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
    color: rgba(255, 255, 255, 0.8);
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
  testToolbar: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
  `,
}
