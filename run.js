onmessage = function(e) {
  const before = e.data[0]
  const test = e.data[1]
  let result

  try {
    ops = eval(`() => {
        let ops = 0;
        let end = performance.now() + 100;
        ${before};
        while (performance.now() < end) {
            ${test.code};
            ops++;
        }
        return ops;
      }`)()

    result = {
      ...test,
      ops,
    }
  } catch (e) {
    result = {
      ...test,
      ops: -1,
    }
  }

  postMessage(result)
}
