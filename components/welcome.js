import { html, css } from '../utils.js'

export default ({ state, dispatch }) =>
  state.dialog &&
  html`
    <dialog className=${styles} open>
      <h1><i>Perflink</i></h1>
      <p>
        Quick and easy JavaScript benchmarks.
        <br />
        Reliably compare code exectution times in browser.
      </p>
      <button onClick=${() => dispatch({ dialog: false, started: true })}>
        Start Experimenting
      </button>
    </dialog>
  `

const styles = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: #fff;
  background: rgba(44, 45, 51, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 0;

  h1 {
    font-size: 16vmin;
  }

  h3 {
    text-transform: uppercase;
    font-weight: bold;
    letter-spacing: 1px;
    text-align: center;
    font-size: 3vmin !important;
    padding: 0 2rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  p {
    max-width: 50ex;
    text-align: center;
    line-height: 150%;
    font-size: 3vmin;
  }

  > * + * {
    margin-top: 1rem;
  }

  button {
    color: hotpink;
    border: 1px solid hotpink;
    margin-top: 2rem;
    font-size: 1.2rem;
    height: 4rem;
    padding: 1rem;
  }
`
