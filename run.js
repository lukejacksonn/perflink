onmessage = async e => {
  const test = e.data[0]
  const duration = e.data[1]
  let result
  ;(async () => {
    try {
      result = await eval(`async () => {
        let ops = 0;
        let end = Date.now() + ${duration};
        while (Date.now() < end) {
          ${test.code};
          ops++;
        }
        return ops;
      }`)()
    } catch (e) {
      result = -1
    }
    postMessage(result === -1 ? result : (result * (1000 / duration)) << 0)
  })()
}
