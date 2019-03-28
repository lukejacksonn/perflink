import Editor from './editor.js'
const { highlight, languages } = Prism

const insert = (arr, index, newItem) => [
  ...arr.slice(0, index),
  newItem,
  ...arr.slice(index),
]

export default ({ tests, setTests, started, id, results, value }) => html`
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
        }}
      />
      <div
        className=${css`
          position: absolute;
          right: 0.62rem;
          top: 0.62rem;
        `}
      >
        <button onClick=${e => setTests(insert(tests, id, tests[id]))}>
          <b>Copy</b>
        </button>
        <button onClick=${e => setTests(tests.filter((x, y) => y !== id))}>
          <b>X</b>
        </button>
      </div>
    </div>
  </li>
`
