onmessage = function(e) {
  const before = e.data[0]
  const test = e.data[1]
  const duration = e.data[2]
  let result

  try {
    ops = eval(`() => {
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

// var hz, period, startTime = new Date, runs = 0;

// do {
//   // Code snippet goes here
//   runs++;
//   totalTime = new Date - startTime;
// } while (totalTime < 1000);
// // convert ms to seconds
// totalTime /= 1000;
// // period → how long per operation
// period = totalTime / runs;
// // hz → the number of operations per second
// hz = 1 / period;
// // can be shortened to //
// hz = (runs * 1000) / totalTime;
