(()=>{"use strict";var e,v={},g={};function r(e){var n=g[e];if(void 0!==n)return n.exports;var t=g[e]={exports:{}};return v[e].call(t.exports,t,t.exports,r),t.exports}r.m=v,e=[],r.O=(n,t,o,f)=>{if(!t){var a=1/0;for(i=0;i<e.length;i++){for(var[t,o,f]=e[i],c=!0,d=0;d<t.length;d++)(!1&f||a>=f)&&Object.keys(r.O).every(b=>r.O[b](t[d]))?t.splice(d--,1):(c=!1,f<a&&(a=f));if(c){e.splice(i--,1);var u=o();void 0!==u&&(n=u)}}return n}f=f||0;for(var i=e.length;i>0&&e[i-1][2]>f;i--)e[i]=e[i-1];e[i]=[t,o,f]},r.n=e=>{var n=e&&e.__esModule?()=>e.default:()=>e;return r.d(n,{a:n}),n},(()=>{var n,e=Object.getPrototypeOf?t=>Object.getPrototypeOf(t):t=>t.__proto__;r.t=function(t,o){if(1&o&&(t=this(t)),8&o||"object"==typeof t&&t&&(4&o&&t.__esModule||16&o&&"function"==typeof t.then))return t;var f=Object.create(null);r.r(f);var i={};n=n||[null,e({}),e([]),e(e)];for(var a=2&o&&t;"object"==typeof a&&!~n.indexOf(a);a=e(a))Object.getOwnPropertyNames(a).forEach(c=>i[c]=()=>t[c]);return i.default=()=>t,r.d(f,i),f}})(),r.d=(e,n)=>{for(var t in n)r.o(n,t)&&!r.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:n[t]})},r.f={},r.e=e=>Promise.all(Object.keys(r.f).reduce((n,t)=>(r.f[t](e,n),n),[])),r.u=e=>e+"."+{484:"f3b141e5f68e16ed",896:"011c5e90b578641e"}[e]+".js",r.miniCssF=e=>{},r.o=(e,n)=>Object.prototype.hasOwnProperty.call(e,n),(()=>{var e={},n="client:";r.l=(t,o,f,i)=>{if(e[t])e[t].push(o);else{var a,c;if(void 0!==f)for(var d=document.getElementsByTagName("script"),u=0;u<d.length;u++){var l=d[u];if(l.getAttribute("src")==t||l.getAttribute("data-webpack")==n+f){a=l;break}}a||(c=!0,(a=document.createElement("script")).type="module",a.charset="utf-8",a.timeout=120,r.nc&&a.setAttribute("nonce",r.nc),a.setAttribute("data-webpack",n+f),a.src=r.tu(t)),e[t]=[o];var s=(_,b)=>{a.onerror=a.onload=null,clearTimeout(p);var y=e[t];if(delete e[t],a.parentNode&&a.parentNode.removeChild(a),y&&y.forEach(m=>m(b)),_)return _(b)},p=setTimeout(s.bind(null,void 0,{type:"timeout",target:a}),12e4);a.onerror=s.bind(null,a.onerror),a.onload=s.bind(null,a.onload),c&&document.head.appendChild(a)}}})(),r.r=e=>{typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;r.tt=()=>(void 0===e&&(e={createScriptURL:n=>n},typeof trustedTypes<"u"&&trustedTypes.createPolicy&&(e=trustedTypes.createPolicy("angular#bundler",e))),e)})(),r.tu=e=>r.tt().createScriptURL(e),r.p="",(()=>{var e={666:0};r.f.j=(o,f)=>{var i=r.o(e,o)?e[o]:void 0;if(0!==i)if(i)f.push(i[2]);else if(666!=o){var a=new Promise((l,s)=>i=e[o]=[l,s]);f.push(i[2]=a);var c=r.p+r.u(o),d=new Error;r.l(c,l=>{if(r.o(e,o)&&(0!==(i=e[o])&&(e[o]=void 0),i)){var s=l&&("load"===l.type?"missing":l.type),p=l&&l.target&&l.target.src;d.message="Loading chunk "+o+" failed.\n("+s+": "+p+")",d.name="ChunkLoadError",d.type=s,d.request=p,i[1](d)}},"chunk-"+o,o)}else e[o]=0},r.O.j=o=>0===e[o];var n=(o,f)=>{var d,u,[i,a,c]=f,l=0;if(i.some(p=>0!==e[p])){for(d in a)r.o(a,d)&&(r.m[d]=a[d]);if(c)var s=c(r)}for(o&&o(f);l<i.length;l++)r.o(e,u=i[l])&&e[u]&&e[u][0](),e[u]=0;return r.O(s)},t=self.webpackChunkclient=self.webpackChunkclient||[];t.forEach(n.bind(null,0)),t.push=n.bind(null,t.push.bind(t))})()})();