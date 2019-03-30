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
    left: 0;
    width: 100%;
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
    font-weight: bold;
    padding: 0 0 4rem;
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
                  transition: 'all 0.38s',
                  height: `${!test.percent ? 100 : test.percent}%`,
                  background: !test.percent
                    ? 'rgba(0,0,0,0.15)'
                    : 'rgba(255,255,255,0.5)',
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
      Median Execution Time (ms)
    </div>
  </aside>
`
