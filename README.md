# Perflink

> JavaScript performance benchmarks you can share via URL

The motivation here was to create a single page app like [jsperf](https://jsperf.com) – which is commonly used to compare performance characteristics of different Javascript code snippets – but with improved usability and portability of results. It is a frontend only static web app with no build step and is hosted on Github pages.

![perflink](https://user-images.githubusercontent.com/1457604/78142792-49dc2e80-7425-11ea-95a5-2003b2b027f1.gif)

## Features

- 🧪 Benchmarks run in isolated web workers
- 🌍 Supports imports with worker type module
- 🗂 Saves test suites to local storage
- 🎨 Syntax highlighted textarea inputs
- 🔗 Serializable state encoded into shareable URLs
- ⏱ Adaptive timing for more accurate results
- 🗜 Super light weight – almost no dependencies

## Usage

To use the web interface simply visit https://perf.link and write out some test cases. When you are ready hit "Run Test". The code will be evaluated and benchmarked – against all other test cases – the results of which will appear on the graph to the right.

The contents of all inputs and latest benchmark results for each test case, are stored in state which is serialised using the browsers `atob` function and set as the `location.hash`. This happens every time a benchmark is ran. That means you can share your findings with anyone by just copy pasting the window URL.

## Development

If you would like to develop the project, first clone this repo then run the following command in your terminal (from the project root directory) which will open the app in your preferred browser.

```
$ npx servor --reload --browse
```

> Live reload is enabled using the `--reload` flag with [servor](https://github.com/lukejacksonn/servor) so when you make changes to your code the browser will reload the tab and your changes will be reflected there.

## Implementation

Benchmarking involves accurate timing. Historically this has been hard to do due to the limitations of timers in JavaScript. Recently a high resolution timer was added by the WebPerf Working Group to allow measurement in the Web Platform with much greater degree of accuracy. Unfortunately, these timers became an attack vector for both Spectre and Meltdown and have since had their reolution reduced drastically (down to 1ms in Firefox) as well as jitter added. This makes them almost useless when it comes to benchmarking high performance code.

So instead, tests are now ran for a fixed duration of time (>1ms) and then the amount of times that the test ran for is multiplied up to give an operation per second reading. Here is the worker code for that calculation:

```js
onmessage = async (e) => {
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
```

### Benchmarking

Currently when the benchmark is ran, each tast case will be executed execute 100 times in its own worker. Before running the full test suite, each test case is executed 10 times in order to calculate the duration required to get a meaningful ops/s reading from each case. The max duration is then taken and each test case is executed for that amount of time. The mean average of running the full test suite is then recorded for each test case. When the tests are complete this data is surfaced next to the test code (as ops/s) and on the graph (as a % comparrison compared to all other test cases).

## Contributing

If you have an idea for a new feature or find a bug then please feel free to create an issue or even better a pull request! I have a lot of projects to maintain but will try respond to every request.
