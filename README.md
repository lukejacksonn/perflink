# Perflink

> JavaScript performance benchmarks that you can share via URL

The motivation here was to create a single page app alternative to [jsperf](https://jsperf.com) – which is commonly used to compare performance characteristics of different Javascript code implementations – but with improved portibility and usability as a priority.

![perflink](https://user-images.githubusercontent.com/1457604/55242563-6c959f00-5235-11e9-8cb5-f1f140781f3b.gif)

## Features

- 🎨 Syntax highlighted textarea inputs
- ♻️ Benchmarks run automatically when test cases change
- 🌍 Serializable state encoded into shareable URLs
- ⏱ Accurate timing using `performance.now()`
- 🗜 Super light weight – almost no dependencies

## Usage

To use the web interface simply visit https://perf.link and start typing. As you type the code will be evaluated and benchmarked – against all other test cases – the results of which will appear on graph to the right.

The contents of all inputs and latest benchmark results for each test case, are stored in state which is serialised using the browsers `atob` function and set as the `location.hash`. This happens every time a benchmark is ran. That means you can share your findings with anyone by just copy pasting the window URL.

## Development

If you would like to develop the project, first clone this repo then run the following command in your terminal (from the project root directory) which will open the app in your preferred browser.

```
$ npx servor
```

> Live reload is enabled by default with [servor](https://github.com/lukejacksonn/servor) so when you make changes to your code the browser will reload the tab and your changes will be reflected there.

### es-react

This project uses a proprietary version of react called [`es-react`](https://github.com/lukejacksonn/es-react) which allows you to import `React` and `ReactDOM` (version 16.8.3) as an es module from within your app and component files.

```js
import { React, ReactDOM } from 'https://unpkg.com/es-react'
```

## Implementation

Benchmarking involves accurate timing. Historically this has been hard to do due to the limitations of timers in JavaScript. Recently a high resolution timer was added by the WebPerf Working Group to allow measurement in the Web Platform with much greater degree of accuracy.

Here is how time of execution is calculated:

```js
let time
try {
  time = eval(`() => {
    ${before}
    let start, end
    start = performance.now()
    ${test.code}
    end = performance.now()
    return end - start
  }`)()
} catch (e) {}
```

### Measuring

This timer is available through the `performance.now()` method. Numbers returned from function call are not limited to one-millisecond resolution. Instead, they represent times as floating-point numbers with up to microsecond precision and are monotonic.

### Benchmarking

Currently when the benchmark is ran, each tast case will be executed execute 100 times (this is subject to becoming variable as to cover more advanced use cases) then both the total and the median execution time in milliseconds is recorded and displayed on the graph.

## Todo

I would like the app to remain simple with very focussed scope but I am interested in a few features:

- Look into running tests from a service worker
- Support test cases with async code
- More options around benchmark settings (iteration count etc.)
- Offer various different graph types and legends
- More interesting and demonstrative tests cases
- Being able to archive URLs by putting them into localstorage
- A proper logo and maybe a better color scheme
- Making the user interface responsive

I am not interested in:

- Rewriting the project in TypeScript
- Adding Babel or Webpack (or any build step for that matter)

Although I am currently quite busy with work I will try take the time to review PRs that address these todos.
