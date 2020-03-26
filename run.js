// prettier-ignore
!function(){
  var e=/(^|;|\s+)import\s*['"]([^'"]+)['"](?=($|;|\s))/gi,t=/(^|[;\s]+)?import\s*(\*\s*as)?\s*(\w*?)\s*,?\s*(?:\{([\s\S]*?)\})?\s*from\s*['"]([^'"]+)['"];?/gi;function r(e,t){for(var r=[];e.length;)r.push(e.shift().trim().replace(/ as /g,":"));return"const { "+r.join(", ")+" } = "+t+";"}
  var n={};function s(n,s){var o,i=[],p=[],u={exports:{}},f=function(n,s){return n.replace(e,"$1"+(s=s||"require")+"('$2')").replace(t,function(e,t,n,o,i,p){return(t||"")+function(e,t,n,s){return t=s+"('"+t+"')",e.length&&!n?r(e,t):"const "+n+" = "+t+";"+(e.length?"\n"+r(e,n):"")}(i?i.split(","):[],p,o,s)})}(s.replace(/(^|\s|;)(import\s*)(\(|.*from\s*|)['"]([^'"]+)['"];?/gi,function(e,t,r,s,o){return o="'"+new URL(o,n).href+"'",t+r+s+("("==s?o:"'$dimport["+(p.push(o)-1)+"]';")}).replace(/(^|\s|;)(import)(?=\()/g,"$1self.dimport").replace(/export default/,"module.exports =").replace(/export\s+(const|function|class|let|var)\s+(.+?)(?=(\(|\s|=))/gi,function(e,t,r){return i.push(r)&&t+" "+r}).replace(/export\s*\{([\s\S]*?)\}/gi,function(e,t){for(var r,n="",s=t.split(",");r=s.shift();)n+="exports."+((r=r.trim().split(" as "))[1]||r[0])+" = "+r[0]+";\n";return n}),"eval");for(i.sort();o=i.shift();)f+="\nexports."+o+" = "+o+";";return Promise.resolve(new Function("module","exports",p.length?"return Promise.all(["+p.join()+"].map(self.dimport)).then(function($dimport){"+f+"});":f)(u,u.exports)).then(function(){return u.exports.default=u.exports.default||u.exports,u.exports})}
  self.dimport=function(e){return e=new URL(e,location.href).href,n[e]?Promise.resolve(n[e]):fetch(e).then(function(e){return e.text()}).then(s.bind(s,e)).then(function(t){return n[e]=t})};
}();

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
