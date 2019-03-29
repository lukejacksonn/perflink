const round = num => parseFloat(num).toFixed(2)

const style = {
  aside: css`
    position: relative;
    display: flex;
    flex-direction: column;
    color: #fff;
    overflow-x: auto;
  `,
  graph: css`
    margin: 0 auto;
    flex: 1 1 100%;
    padding: 4rem 3rem 2rem;
    display: flex;
    align-items: flex-end;
  `,
  result: index => css`
    display: flex;
    flex-direction: column;
    height: 100%;
    marginleft: ${index === 0 ? 0 : '2rem'};
  `,
  bar: css`
    display: flex;
    justify-content: center;
    align-items: flex-end;
    flex: 1 1 100%;
  `,
  label: css`
    width: 3rem;
    margin-top: 2rem;
    text-align: center;
    font-weight: 100;
    color: rgba(255, 255, 255, 0.5);
  `,
  legend: css`
    position: sticky;
    left: 3rem;
    width: calc(100% - 6rem);
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
    font-weight: bold;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 2rem 0 4rem;
    margin: 0 3rem;
  `,
}

export default ({ tests }) => html`
  <aside className=${style.aside}>
    <div className=${style.graph}>
      ${tests.map(
        (test, i) => html`
          <div className=${style.result(i)}>
            <div className=${style.bar}>
              <span
                style=${{
                  width: '1px',
                  transition: 'height 0.5s',
                  height: `${test.percent ? test.percent : 0}%`,
                  background: 'rgba(255,255,255,0.5)',
                }}
              ></span>
            </div>
            <div className=${style.label}>
              ${round(test.median || 0)}
            </div>
          </div>
        `
      )}
    </div>
    <div className=${style.legend}>
      Execution Time (ms)
    </div>
  </aside>
`
