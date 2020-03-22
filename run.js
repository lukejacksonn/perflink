onmessage = async e => {
  const before = e.data[0]
  const test = e.data[1]
  const duration = e.data[2]
  let result

  try {
    ops = await eval(`async () => {
        ${before};
        let ops = 0;
        let end = Date.now() + ${duration};
        while (Date.now() < end) {
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
