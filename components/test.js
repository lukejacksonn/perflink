import { CopyIcon, CloseIcon } from './icons.js'
import Editor from './editor.js'
const { highlight, languages } = Prism

const insert = (arr, index, newItem) => [
  ...arr.slice(0, index),
  newItem,
  ...arr.slice(index),
]

export default ({ tests, setTests, started, id, value }) => html`
  <li key=${id}>
    <div>
      <${Editor}
        disabled=${started}
        value=${value}
        onValueChange=${val => {
          const modified = [...tests]
          modified[id] = val
          setTests(modified)
        }}
        highlight=${code => highlight(code, languages.js)}
        padding=${20}
        style=${{
          width: '100%',
          fontFamily: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New'",
          color: '#fff',
          fontSize: 16,
          backgroundColor: '#212121',
          color: 'rgb(255, 255, 255)',
          borderRadius: '1rem',
          lineHeight: '162%',
        }}
      />
      <div
        className=${css`
          position: absolute;
          right: 1rem;
          top: 1.3rem;
        `}
      >
        <button
          className=${css`
            padding: 0;
            border: 0;
          `}
          onClick=${e => setTests(insert(tests, id, tests[id]))}
        >
          <${CopyIcon} //>
        </button>
        <button
          className=${css`
            padding: 0;
            border: 0;
          `}
          onClick=${e => setTests(tests.filter((x, y) => y !== id))}
        >
          <${CloseIcon} //>
        </button>
      </div>
    </div>
  </li>
`
