onmessage = async e => {
  const test = e.data[0]
  let time
  ;(async () => {
    try {
      time = await eval(`async () => {
        const start = Date.now()
        for (let i = 0; i < 10; i++) {
          ${test.code};
        }
        return Date.now() - start || 1
      }`)()
    } catch (e) {
      time = -1
    }
    postMessage(time)
  })()
}
