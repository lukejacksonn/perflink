onmessage = function(e) {
  const before = e.data[0]
  const test = e.data[1]
  let result

  try {
    ops = eval(`() => {
        let ops = 0;
        let end = performance.now() + 100;
        const now = () => performance.now();
        ${before};
        while (now() <= end) {
            ${test.code};
            ops++;
        }
        return ops;
      }`)()

    result = {
      ...test,
      error: false,
      median: 0,
      ops,
    }
  } catch (e) {
    console.log(e)
    result = {
      ...test,
      error: true,
      median: 0,
      ops: 0,
    }
  }

  postMessage(result)
}
