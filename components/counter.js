import { React } from "https://unpkg.com/es-react";

import htm from "https://unpkg.com/htm?module";
const html = htm.bind(React.createElement);

export const Counter = props => {
  const [count, setCount] = React.useState(parseInt(props.count));
  return html`
    <div>
      <h1>${count}</h1>
      <button onClick="${e => setCount(count - 1)}">Decrement</button>
      <button onClick="${e => setCount(count + 1)}">Increment</button>
    </div>
  `;
};
