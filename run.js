var UNNAMED = /(^|;|\s+)import\s*['"]([^'"]+)['"](?=($|;|\s))/gi
var NAMED = /(^|[;\s]+)?import\s*(\*\s*as)?\s*(\w*?)\s*,?\s*(?:\{([\s\S]*?)\})?\s*from\s*['"]([^'"]+)['"];?/gi

function destruct(keys, target) {
  var out = []
  while (keys.length)
    out.push(
      keys
        .shift()
        .trim()
        .replace(/ as /g, ':')
    )
  return 'const { ' + out.join(', ') + ' } = ' + target + ';'
}

function generate(keys, dep, base, fn) {
  dep = fn + "('" + dep + "')"
  if (keys.length && !base) return destruct(keys, dep)
  return (
    'const ' +
    base +
    ' = ' +
    dep +
    ';' +
    (keys.length ? '\n' + destruct(keys, base) : '')
  )
}

function imports(str, fn) {
  fn = fn || 'require'
  return str
    .replace(UNNAMED, '$1' + fn + "('$2')")
    .replace(NAMED, function(x, y, z, base, req, dep) {
      return (y || '') + generate(req ? req.split(',') : [], dep, base, fn)
    })
}

var CACHE = {}

function run(url, str) {
  self.dimport = dimport

  var key,
    keys = [],
    urls = [],
    mod = { exports: {} }

  var txt = imports(
    // Ensure full URLs & Gather static imports
    str
      .replace(
        /(^|\s|;)(import\s*)(\(|.*from\s*|)['"]([^'"]+)['"];?/gi,
        function(_, pre, req, type, loc) {
          loc = "'" + new URL(loc, url).href + "'"
          return (
            pre +
            req +
            type +
            (type == '(' ? loc : `'$dimport[${urls.push(loc) - 1}]';`)
          )
        }
      )

      // Ensure we caught all dynamics (multi-line clause)
      .replace(/(^|\s|;)(import)(?=\()/g, '$1window.dimport')

      // Exports
      .replace(/export default/, 'module.exports =')
      .replace(
        /export\s+(const|function|class|let|var)\s+(.+?)(?=(\(|\s|=))/gi,
        function(_, type, name) {
          return keys.push(name) && type + ' ' + name
        }
      )
      .replace(/export\s*\{([\s\S]*?)\}/gi, function(_, list) {
        var tmp,
          out = '',
          arr = list.split(',')
        while ((tmp = arr.shift())) {
          tmp = tmp.trim().split(' as ')
          out += 'exports.' + (tmp[1] || tmp[0]) + ' = ' + tmp[0] + ';\n'
        }
        return out
      }),
    'eval'
  )

  for (keys.sort(); (key = keys.shift()); ) {
    txt += '\nexports.' + key + ' = ' + key + ';'
  }

  return Promise.resolve(
    new Function(
      'module',
      'exports',
      urls.length
        ? 'return Promise.all([' +
          urls.join() +
          '].map(window.dimport)).then(function($dimport){' +
          txt +
          '});'
        : txt
    )(mod, mod.exports)
  ).then(function() {
    mod.exports.default = mod.exports.default || mod.exports
    return mod.exports
  })
}

function dimport(url) {
  url = new URL(url, location.href).href

  try {
    return new Function("return import('" + url + "')").call()
  } catch (err) {
    return CACHE[url]
      ? Promise.resolve(CACHE[url])
      : fetch(url)
          .then(function(r) {
            return r.text()
          })
          .then(run.bind(run, url))
          .then(function(x) {
            return (CACHE[url] = x)
          })
  }
}

function toURL(code, type = 'application/javascript') {
  return URL.createObjectURL(new Blob([code], { type }))
}

onmessage = async e => {
  const before = e.data[0]
  const test = e.data[1]
  const duration = e.data[2]
  dimport(
    toURL(` 
      ${before};
      let result;
      (async () => {
        try {
          result = await eval(\`async () => {
              let ops = 0;
              let end = Date.now() + ${duration};
              while (Date.now() < end) {
                  ${test.code};
                  ops++;
              }
              return ops;
            }\`)()
        } catch (e) {
          result = -1
        }
        postMessage(result)
      })()
    `)
  )
}
