const pReduce = (iterable, reducer, initialValue) =>
  new Promise((resolve, reject) => {
    const iterator = iterable[Symbol.iterator]()
    let index = 0
    const next = async total => {
      const element = iterator.next()
      if (element.done) {
        resolve(total)
        return
      }
      try {
        const value = await Promise.all([total, element.value])
        next(reducer(value[0], value[1], index++))
      } catch (error) {
        reject(error)
      }
    }
    next(initialValue)
  })

export const pSeries = async tasks => {
  const results = []
  await pReduce(tasks, async (_, task) => {
    const value = await task()
    results.push(value)
  })
  return results
}

export const average = arr => {
  var sums = {},
    counts = {},
    results = [],
    ids = {},
    name
  for (var i = 0; i < arr.length; i++) {
    name = arr[i].code
    if (!(name in sums)) {
      sums[name] = 0
      counts[name] = 0
      ids[name] = arr[i].name
    }
    sums[name] += arr[i].ops
    counts[name]++
  }

  for (name in sums) {
    results.push({
      name: ids[name],
      code: name,
      ops: (sums[name] / counts[name]) << 0,
    })
  }
  return results
}

export const toURL = (code, type = 'application/javascript') =>
  URL.createObjectURL(new Blob([code], { type }))
