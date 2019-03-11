export default props => {
  const [count, setCount] = React.useState(parseInt(props.count))
  return html`
    <div>
      <h1>${count}</h1>
      <button onClick="${e => setCount(count - 1)}">Decrement</button>
      <button onClick="${e => setCount(count + 1)}">Increment</button>
    </div>
  `
}
