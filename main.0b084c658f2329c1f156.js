!function(t){var e={};function o(s){if(e[s])return e[s].exports;var l=e[s]={i:s,l:!1,exports:{}};return t[s].call(l.exports,l,l.exports,o),l.l=!0,l.exports}o.m=t,o.c=e,o.d=function(t,e,s){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(o.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var l in t)o.d(s,l,function(e){return t[e]}.bind(null,l));return s},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o(o.s=1)}([function(t,e,o){o.r(e),o.d(e,"GAME",function(){return v});const{cp:s,ca:l}=o(3),{Graph:c}=o(4);let i,a=[],n=0,r=0,h={click:[],mousemove:[],mousedown:[],mouseup:[],keydown:[]},d={n:"",l:100,d:0,s:[],m:0},f={n:"",l:0,d:0},p={ltu:0,mfps:60,d:0,u:1e3/60,fps:60,fn:0,lfps:0};["click","mousemove","mousedown","mouseup"].forEach(t=>{s.i.addEventListener(t,e=>{let o=((t,e)=>{let o=s.i.getBoundingClientRect();return{x:t-o.left,y:e-o.top}})(e.clientX,e.clientY);h[t].forEach(t=>{o.x>=t[1].x&&o.x<=t[1].x+t[1].w&&o.y>=t[1].y&&o.y<=t[1].y+t[1].h&&t[0](e,o.x,o.y)})})}),[["touchmove",["mousemove"]],["touchstart",["mousedow"]],["touchend",["mouseup","click"]]].forEach(t=>{s.i.addEventListener(t[0],e=>{e.preventDefault();let o=e.touches.length>0?e.touches[0]:e.changedTouches[0];t[1].forEach(t=>s.i.dispatchEvent(new MouseEvent(t,{clientX:o.clientX,clientY:o.clientY})))})}),document.addEventListener("keydown",t=>h.keydown.forEach(e=>e[0](t))),document.addEventListener("contextmenu",t=>t.preventDefault());let u={a:!1,s:!1},m=()=>{u.a=document.monetization,u.s=u.a&&"started"===document.monetization.state,n==a.length-1&&l.t(u.s?"Thank you for supporting us with your Coil subscription!":"You can enable Revive and help us by clicking at Support Us and subscribing to a Coil account."),setTimeout(m,5e3)};m();let y=(t,e,o)=>(t.l-=e,o&&(t.s[n]+=o),Math.floor(t.l)<=0&&(t===d&&(t.s[n]=0),setTimeout(()=>{b(t!==d)},3e3),!0)),w=(t,e)=>Math.sqrt(Math.pow(t,2)+Math.pow(e,2)),x=t=>{if(t<p.ltu+1e3/p.mfps)i=requestAnimationFrame(x);else{for(t>p.lfps+1e3&&(p.fps=Math.floor(.25*p.fn+.75*p.fps),p.lfps=t,p.fn=0,l.u(p.fps,p.mfps)),p.fn++,p.d+=t-p.ltu,p.ltu=t;p.d>=p.u;)p.d-=p.u;s.d.fr(0,0,s.i.width,s.i.height,{fs:"#2A293E"}),a[n].ou(),i=requestAnimationFrame(x)}},g=t=>{a[n].os(t),x(0)},b=(t,e)=>{cancelAnimationFrame(i),h.click=[],h.mousemove=[],h.mousedown=[],h.mouseup=[],h.keydown=[],l.t(""),d.s[n]&&d.s[n]<0&&(d.s[n]=0),a[n].ost&&a[n].ost(),r=n,n=void 0!==e?e:!1!==t?(n+1)%a.length:a.length-1,1!=d.m&&(d.l=d.l+10>100?100:d.l+10),g(t)};const v={c:{x:0,y:0,w:s.i.width,h:s.i.height,p:s.p},ca:{t:l.t},cu:()=>n,p:d,b:f,dt:p.u,m:u,e:(t,e,o={x:0,y:0,w:s.i.width,h:s.i.height})=>h[t].push([e,o]),d:{l:s.d.l,sl:s.d.sl,ft:s.d.ft,fr:s.d.fr,sr:s.d.sr,fc:s.d.fc,sc:s.d.sc,dtx:s.UI.tx,db:s.UI.b,dt:s.UI.t,dp:t=>s.UI.p(d,f,t),dic:s.im.c},f:{dp:(t,e)=>y(d,t||f.d,e),db:(t,e)=>y(f,t||d.d,e),mag:w,norm:(t,e,o)=>(o||(o=w(t,e)),0===o?{x:0,y:0}:{x:t/o,y:e/o})},ds:{g:c},n:b,s:()=>0!==a.length&&(g(),!0),a:t=>a.push(t),r:()=>{d.l=100,b(void 0,r)}}},function(t,e,o){o(2);const{GAME:s}=o(0);s.a(o(5).INTRO),s.a(o(6).PACMAN),s.a(o(7).PONG),s.a(o(8).TICTACTOE),s.a(o(9).CHESS),s.a(o(10).GAMEOVER),function t(){s.s()||setTimeout(t,500)}()},function(t,e,o){},function(t,e,o){o.r(e),o.d(e,"cp",function(){return b}),o.d(e,"ca",function(){return E});let s=document.querySelector("#gc"),l=s.getContext("2d");s.width=1024,s.height=768;let c={x:0,y:s.height-150,w:s.width,h:150},i={lw:2,fs:"#F0EAD6",ss:"#F0EAD6",f:50,ta:"c",tb:"m"},a={s:"start",e:"end",l:"left",c:"center",r:"right"},n={t:"top",b:"bottom",m:"middle",a:"alphabetic",h:"hanging"};l.lineWidth=i.lw,l.fillStyle=i.fs,l.strokeStyle=i.ss,l.font=`${i.f}px Arial`,l.textAlign=a[i.ta],l.textBaseline=n[i.tb];let r={},h=(t,e)=>{e&&d(e),t(),e&&d(i)},d=({fs:t,ss:e,f:o,ta:s,tb:c,lw:i})=>{i&&(l.lineWidth=i),t&&(l.fillStyle=t),e&&(l.strokeStyle=e),o&&(l.font=`${o}px Arial`),s&&(l.textAlign=a[s]),c&&(l.textBaseline=n[c])};r.cc=(t,e,o,s)=>l.clearRect(t,e,o,s),r.l=(t,e,o,s,c)=>{h(()=>{l.beginPath(),l.moveTo(t,e),l.lineTo(o,s),l.stroke()},c)},r.sl=(t,e,o,s,c,i)=>{h(()=>{let i=t,a=e,n=(o-t)/c,r=(s-e)/c;for(l.beginPath();i<o||a<s;)l.moveTo(i,a),i+=n,a+=r,l.lineTo(i,a),i+=n,a+=r;l.stroke()},i)},r.ft=(t,e,o,s)=>h(()=>l.fillText(t,e,o),s);let f=(t,e,o,s,c,i)=>h(()=>l[t](e,o,s,c),i);r.fr=(t,e,o,s,l)=>f("fillRect",t,e,o,s,l),r.sr=(t,e,o,s,l)=>f("strokeRect",t,e,o,s,l);let p=(t,e,o,s,c=0,i=2*Math.PI,a)=>{h(()=>{l.beginPath(),l.arc(e,o,s,c,i),l[t]()},a)};r.fc=(t,e,o,s,l,c)=>p("fill",t,e,o,s,l,c),r.sc=(t,e,o,s,l,c)=>p("stroke",t,e,o,s,l,c);let u=(t,e,o)=>{h(()=>{l.beginPath();let o=e.shift();l.moveTo(o[0],o[1]),e.forEach(t=>l.lineTo(t[0],t[1])),l.closePath(),l[t]()},o)};r.fm=(t,e)=>u("fill",t,e),r.sm=(t,e)=>u("stroke",t,e);let m=(t,e,o,s,l)=>{let c=0,i=0;for(let a=0;a<t.length;a++){let n=t[a];if(n.tm&&l<(i+=n.tm))break;let h=Object.assign({},s,n.s),d=n.y?n.y:o;r.ft(n.c,n.x?n.x:e,d+c,h),n.sp&&(c+=n.sp)}},y=(t,e,o)=>{r.ft(e,t.x+t.w/2,t.y+t.h/2,o),r.sr(t.x,t.y,t.w,t.h,o)},w=t=>Math.PI/180*t,x=t=>w(270)+w(360*t/100),g=(t,e,o,s,l=5)=>{s<0&&(s=0),r.sc(t,e,o,w(270),x(100),{ss:"#EEEEEE",lw:l}),r.sc(t,e,o,w(270),x(s),{ss:"rgba(255,0,0,0.8)",lw:l}),r.fc(t,e,o-l+3,0,2*Math.PI,{fs:"#15AAAA",lw:l}),r.ft(Math.ceil(s),t,e,{fs:"rgba(255,0,0,0.5)",f:30})};const b={i:s,p:c,d:r,UI:{tx:m,b:y,t:(t,e,o,l,c,i)=>{t--,r.ft(e[t],s.width/2,70,{f:70}),m(o[t],20,160,{ta:"l",f:30},l),l>=1e3&&y(c[t],i[t])},p:(t,e,o)=>{r.l(c.x,c.y+5,c.x+c.w,c.y+5,{ss:"#444444"});let s=c.x+c.w/12,l=c.y+c.h/2,i=50;if(g(s,l,i,t.l),g(11*s,l,i,e.l),o)r.ft(o,c.x+c.w/2,c.y+c.h/2);else{let o="b";l+=c.h/2,i+=5,r.ft(t.n,s+i,l,{tb:o,ta:"l"}),r.ft(e.n,11*s-i,l,{tb:o,ta:"r"})}}},im:{c:(t,e,o,s,l,c=100)=>{let i=c/100;switch("PA"==t&&(i*=.8),"KN"!=t&&(r.fm([[e-40*i,o+50*i],[e-15*i,o-25*i],[e+15*i,o-25*i],[e+40*i,o+50*i]],{fs:s}),r.fc(e,o-50*i,28*i,void 0,void 0,{fs:l}),r.fc(e-82*i,o-5*i,70*i,1.9*Math.PI,.3*Math.PI,{fs:l}),r.fc(e+82*i,o-5*i,70*i,.6*Math.PI,1.3*Math.PI,{fs:l})),t){case"PA":r.fc(e,o-55*i,25*i,void 0,void 0,{fs:s});break;case"RO":r.fm([[e-30*i,o-30*i],[e-36*i,o-66*i],[e+36*i,o-66*i],[e+30*i,o-30*i]],{fs:s}),r.fr(e-15*i,o-66*i,10*i,15*i,{fs:l}),r.fr(e+15*i,o-66*i,10*-i,15*i,{fs:l});break;case"KN":r.fm([[e-45*i,o+50*i],[e-54*i,o-75*i],[e+54*i,o-75*i],[e+45*i,o+50*i]],{fs:s}),r.fm([[e-54*i,o-25*i],[e-30*i,o-60*i],[e-36*i,o-75*i],[e-57*i,o-75*i]],{fs:l}),r.fm([[e-45*i,o+50*i],[e-54*i,o-2.5*i],[e-6*i,o-25*i],[e-10*i,o],[e-12*i,o+10*i]],{fs:l}),r.fm([[e+45*i,o+50*i],[e+60*i,o-87.5*i],[e,o-87.5*i],[e+3.75*i,o-80*i],[e+20*i,o-62.5*i],[e+25*i,o-50*i]],{fs:l});break;case"BI":r.fr(e-30*i/1.3,o-90*i,45*i,45*i,{fs:s}),r.fc(e,o-51*i,30*i/1.28,void 0,void 0,{fs:s}),r.fm([[e-30*i/1.24,o-51*i],[e-30*i/1.24,o-90*i],[e+30*i/1.24,o-90*i],[e+30*i/1.24,o-51*i],[e,o-90*i]],{fs:l}),r.fc(e,o-88.5*i,10*i,void 0,void 0,{fs:s}),r.l(e,o-51*i,e+16.5*i,o-69*i,{ss:l,lw:2*i});break;case"QU":r.fm([[e-24*i,o-30*i],[e-30*i,o-48*i],[e-42*i,o-66*i],[e-18*i,o-54*i],[e,o-66*i],[e+18*i,o-54*i],[e+42*i,o-66*i],[e+30*i,o-48*i],[e+24*i,o-30*i]],{fs:s}),r.fc(e,o-78*i,10*i,void 0,void 0,{fs:s}),r.l(e-30*i,o-36*i,e+30*i,o-36*i,{ss:l,lw:3*i});break;case"KI":r.fm([[e-24*i,o-30*i],[e-33*i,o-66*i],[e+33*i,o-66*i],[e+24*i,o-30*i]],{fs:s}),r.fc(e,o-60*i,20*i,void 0,void 0,{fs:s}),r.l(e,o-60*i,e,o-99*i,{ss:s,lw:30*i/5.5}),r.l(e-10*i,o-90*i,e+10*i,o-90*i,{ss:s,lw:30*i/5.5}),r.l(e-20*i,o-68.4*i,e+20*i,o-68.4*i,{ss:l,lw:30*i/5.5}),r.l(e-30*i,o-36*i,e+30*i,o-36*i,{ss:l,lw:3*i})}r.fr(e-45*i,o+60*i,90*i,24*i,{fs:s}),r.fc(e-45*i,o+72*i,12*i,void 0,void 0,{fs:s}),r.fc(e+45*i,o+72*i,12*i,void 0,void 0,{fs:s})}}};let v=document.querySelector("#ga"),M=v.getContext("2d"),k=s.width;v.width=k,v.height=50,M.font="20px Arial",M.textBaseline="center";let T="";const E={i:v,u:(t,e)=>{M.clearRect(0,0,k,50),M.textAlign="left",M.fillStyle="#777777",M.fillText(T,0,25),M.textAlign="right",M.fillStyle=t<e/2?"red":"#777777",M.fillText(`${t} FPS`,k,25)},t:t=>T=t}},function(t,e,o){o.r(e),o.d(e,"Graph",function(){return s});class s{constructor(){this._g={}}addVertex(t){this._g[t]=[]}addEdge(t,e){this._g[t].push(e)}BFS(t,e){let o=[],s=[],l=[];return s.push(t),l.push(t),this._ib(o,s,l,e),o}_ib(t,e,o,s){if(0===e.length)return;let l=e.shift(),c=this._g[l];if(t.push(l),(void 0===s||!s(l))&&void 0!==c){for(let t=0;t<c.length;t++){let s=c[t];o.includes(s)||(e.push(s),o.push(s))}this._ib(t,e,o,s)}}shortestPath(t,e){let o=[],s=[],l=[],c={},i={};if(s.push(t),l.push(t),c[t]=0,i[t]=-1,this._is(s,l,c,i,e),void 0!==i[e]){let t=e;for(;-1!==t;)o.unshift(t),t=i[t]}return o}_is(t,e,o,s,l){if(t.length<=0)return;let c=t.shift(),i=this._g[c];if(void 0!==i){for(let a=0;a<i.length;a++){let n=i[a];if(!e.includes(n)){t.push(n),e.push(n);let i=o[n],a=o[c]+1;if((void 0===i||a<i)&&(o[n]=a,s[n]=c),n===l)return}}this._is(t,e,o,s,l)}}}},function(t,e,o){o.r(e),o.d(e,"INTRO",function(){return y});const{GAME:s}=o(0);let l,c,i,a,n,r,h,d,f,p,u,m;const y={os:()=>{let t=s.c.w/2,e=s.c.h/2;l={x:t-90,y:2*e-75,w:180,h:60},c={x:t-400,y:2*e-120,w:280,h:60},i={x:t+120,y:2*e-120,w:280,h:60},a={x:t/5,y:.9*e,w:1.6*t,h:s.c.h/3},n={w:a.w/10,h:a.h/4},r=!1,h=!1,d="",f=["1","2","3","4","5","6","7","8","9","0","Q","W","E","R","T","Y","U","I","O","P","A","S","D","F","G","H","J","K","L","Caps","Z","X","C","V","B","N","M","_","Space","Del"],p=8,u=/[a-zA-Z0-9_ ]/,m=0;let o=t=>{h&&d.length>0&&(s.p.n=d,s.p.m=t,s.n(!0))};s.e("click",()=>{0==h&&m>=1e3&&(h=!0)},l),s.e("click",()=>o(1),c),s.e("click",()=>o(1.2),i),s.e("click",(t,e,o)=>{if(h){let t=Math.floor((e-a.x)/n.w)+10*Math.floor((o-a.y)/n.h);29===t?r=!r:38===t?d.length>0&&d.length<8&&(d+=" "):39===t?d=d.slice(0,d.length-1):d.length<8&&(d+=r?f[t]:f[t].toLowerCase())}},a),s.e("keydown",t=>{h&&(d.length<8&&1===t.key.length&&u.test(t.key)?d+=t.key:8===t.keyCode?d=d.slice(0,d.length-1):20===t.keyCode&&(r=!r))})},ou:()=>{(()=>{if(!1===h){m+=s.dt;let t=70,e=50;s.d.dt(1,["Back To Game"],[[{c:"The year is 2019.",sp:t,tm:e},{c:"Chess is angry with technology because people prefer digital games.",sp:t,tm:e},{c:"He believes that he would be an important game again if he could reach",sp:t/1.8,tm:e},{c:"the most famous and classic digital games of history.",sp:t,tm:e},{c:"So he has decided to create an improved and digital version of chess and",sp:t/1.8,tm:e},{c:"send it back in time to corrupt those games.",sp:t,tm:e},{c:"The gaming world now has only one hope, a traveler able to rescue all",sp:t/1.8,tm:e},{c:"corrupted games and destroy the Evil Chess.",sp:1.1*t,tm:e},{c:"Do you accept this mission?",sp:t,tm:e,s:{ta:"c"},x:s.c.x+s.c.w/2}]],m,[l],["Accept"])}else{let t=s.c.x+s.c.w/2,e=s.c.y;s.d.ft("May I know your name,",t,e+70),s.d.ft("Traveler?",t,e+140),s.d.fr(t-160,e+200,320,46),s.d.ft(d,t,e+222,{fs:"#222222"}),s.d.sr(a.x,a.y,a.w,a.h,{ss:"#555555"});for(let t=0;t<f.length;t++){let e=f[t];!r&&t>9&&!["Caps","_","Space","Del"].includes(e)&&(e=e.toLowerCase()),s.d.ft(e,a.x+n.w/2+n.w*(t%10),a.y+n.h/2+n.h*Math.floor(t/10),{f:25})}if(d.length>0){let t="red";s.d.db(c,"Epic Travel",{fs:t,ss:t}),s.d.ft("Score Boost",c.x+c.w/2,c.y+80,{fs:t,f:20}),t="green",s.d.db(i,"Fun Travel",{fs:t,ss:t}),s.d.ft("HP Regen | ATK Boost | DEF Boost",i.x+i.w/2,i.y+80,{fs:t,f:20})}}})()}}},function(t,e,o){o.r(e),o.d(e,"PACMAN",function(){return S});const{GAME:s}=o(0);let l,c,i,a,n,r,h,d,f,p,u,m,y,w,x,g,b,v,M,k=t=>({x:l.x+a.w*(t%a.c),y:l.y+a.h*Math.floor(t/a.c)}),T=(t,e)=>{switch(t){case"l":return e%a.c==0?e+a.c-1:e-1;case"r":return e%a.c==a.c-1?e-a.c+1:e+1;case"t":return 0===Math.floor(e/a.c)?e+a.c*(a.c-1):e-a.c;case"b":return Math.floor(e/a.c)===a.c-1?e-a.c*(a.c-1):e+a.c}},E=(t,e)=>{let o=T(t,e);return 1===n[o]?-1:o},A=(t,e,o)=>t<=0&&-1!==e?e:t>0&&-1!==o?o:-1,P=()=>{if(!(1!=s.p.m&&Math.random()<=.25)){if(!f&&y.length>0&&0===s.b.p.length){let t=b.BFS(u,t=>y.includes(t)&&(y.length<=1||Math.random()<=.9)).pop();void 0!==t&&(s.b.p=b.shortestPath(u,t))}if(s.b.p.length>0){let t=s.b.p.shift();m=u,u=t;let e=["l","r","t","b"];for(let t=0;t<e.length;t++)if(u===T(e[t],m)){r.d=e[t];break}}}},C=()=>{let t=Math.abs(g.x)>=Math.abs(g.y);p=p.map(e=>{let o={l:E("l",e),r:E("r",e),t:E("t",e),b:E("b",e)},s=-1;return-1===(s=A(t?g.x:g.y,t?o.l:o.t,t?o.r:o.b))&&Math.abs(t?g.y:g.x)>=.2&&(s=A(t?g.y:g.x,t?o.t:o.l,t?o.b:o.r)),-1===s?e:s}).filter(t=>t!==m||(f||(f=1===p.length?s.f.db():s.f.dp(s.b.d2,M[0])),!1))},I=()=>{1===(p=p.filter((t,e)=>p.indexOf(t)===e)).length&&p[0]===u?f=s.f.db():p=p.filter(t=>t!==u||(f||(f=s.f.dp(s.b.d2,M[0])),!1)),y=y.filter(t=>t!==u||(f||(f=s.f.dp(void 0,M[1])),!1))};const S={os:()=>{let t=s.c.w/2,e=s.c.h/2;l={x:t/4,y:e/10,w:1.5*t,h:1.5*e},c={x:t-180,y:2*e-75,w:360,h:60},i={x:t-120,y:2*e-100,w:240,h:60},n=[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,1,1,0,1,0,1,0,1,0,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,0,1,0,1,0,1,1,1,1,0,1,1,0,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,1,0,1,1,1,0,1,1,0,1,0,1,1,0,1,1,0,0,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,0,0,1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,0,1,1,0,0,0,0,1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,1,0,1,1,1,0,1,1,0,1,1,0,1,1,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,1,1,1,0,1,0,1,0,1,1,1,0,1,1,0,1,0,1,0,1,1,1,0,0,1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,1,0,1,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],(a={c:Math.sqrt(n.length),w:0,h:0}).w=l.w/a.c,a.h=l.h*a.w/l.w,r={d:"c",b:0},h={c:0,t:[["blue","white"],["royalblue","white"]]},d=1,f=!1,m=u=210,w=0,x=0,g={x:t,y:e},v=0,M=[-300/(p=[21,38,361,378]).length,-700/(y=[22,26,33,37,44,48,51,55,61,78,83,87,92,96,121,124,126,133,135,138,148,166,170,173,176,181,184,198,208,211,226,233,241,244,248,251,255,258,282,286,293,297,304,315,321,327,332,,338,362,365,368,371,374,377]).length],s.p.d=100,s.p.s[s.cu()]=1e3/Math.pow(s.p.m,2),s.b.n="Pacman",s.b.l=100,s.b.d=100/(y.length-1),s.b.d2=20/s.p.m,s.b.p=[],s.e("click",()=>{1==d&&setTimeout(()=>{v=0,d=2},100)},c),s.e("click",()=>{2==d&&(d=0)},i),s.e("mousemove",(t,e,o)=>{0==d&&(g=s.f.norm(e-(l.x+l.w/2),o-(l.y+l.h/2)))}),b=new s.ds.g;for(let t=0;t<n.length;t++)0===n[t]&&(b.addVertex(t),["l","r","t","b"].forEach(e=>{let o=T(e,t),s=0===n[o]?o:-1;-1!==s&&b.addEdge(t,s)}))},ou:()=>{0!=d||f||(w+=s.dt,(x+=s.dt)>=90&&(r.b=(r.b+1)%2,h.c=(h.c+1)%2,x=0),w>=300&&(P(),C(),I(),w=0)),(()=>{if(0!=d){v+=s.dt;let t=70,e=50;s.d.dt(d,["Mission #1","Controls"],[[{c:"The year is 1980.",sp:t,tm:e},{c:"Evil Chess has taken control of Pac Man. Your first mission is to defeat",sp:t/1.8,tm:e},{c:"Pac Man in order to restart it.",sp:t,tm:e},{c:"You will be given control of the ghosts and aim to eat Pac Man.",sp:t,tm:e},{c:"However, to be able to eat Pac Man, you will need to gather all weakened",sp:t/1.8,tm:e},{c:"ghosts into one.",sp:t,tm:e},{c:"Be careful, Pac Man can eat your weakened ghosts and foods along the",sp:t/1.8,tm:e},{c:"map, and this can hurt you.",sp:1.1*t,tm:e},{c:"Do you accept this mission?",sp:t,tm:e,s:{ta:"c"},x:s.c.x+s.c.w/2}],[{c:"- Use your mouse to move through the game board.",sp:t,tm:e},{c:"- You control the ghosts direction with the position of your mouse.",sp:t,tm:e},{c:"- If you're in the left side of map, ghosts will go to left.",sp:t,tm:e},{c:"- If you're in the top side of map, ghosts will go to top.",sp:t,tm:e},{c:"- The same to right side and bottom side.",sp:t,tm:e},{c:"- Check the panel at bottom to see which direction are you pointing now.",sp:t,tm:e}]],v,[c,i],["Travel to 1980","Play"])}else{for(let t=0;t<n.length;t++){let e=k(t);1===n[t]?(s.d.fr(e.x,e.y,a.w,a.h),s.d.sr(e.x,e.y,a.w,a.h,{ss:"#EEEEEE"})):s.d.fr(e.x,e.y,a.w,a.h,{fs:"#666666"})}let t=a.w>=a.h?a.h/2:a.w/2;if(y.forEach(e=>{let o=k(e);s.d.fc(o.x+a.w/2,o.y+a.h/2,t/8)}),p.forEach(e=>{let o=k(e),l=o.x+a.w/2,c=o.y+a.h/2,i=1===p.length?"orange":h.t[h.c][0],n=1===p.length?"royalblue":h.t[h.c][1];if(s.d.fc(l,c,t,void 0,void 0,{fs:i}),s.d.fr(l-t,c,2*t,9*t/10,{fs:i}),1!==p.length){let e=c+t/4;[[l,e,l-t/4,e+t/5],[l-t/4,e+t/5,l-2*t/4,e],[l-2*t/4,e,l-3*t/4,e+t/5],[l,e,l+t/4,e+t/5],[l+t/4,e+t/5,l+2*t/4,e],[l+2*t/4,e,l+3*t/4,e+t/5]].forEach(t=>{s.d.l(t[0],t[1],t[2],t[3],{ss:n})})}s.d.fc(l-t/3,c-t/2,t/8,void 0,void 0,{fs:n}),s.d.fc(l+t/3,c-t/2,t/8,void 0,void 0,{fs:n})}),s.b.l>0){let e,o,l=k(u),c=l.x+a.w/2,i=l.y+a.h/2,n=Math.PI,h=Math.PI,d=Math.PI/8*r.b;switch(r.d){case"l":n*=1.25,h*=1.75,e=c+a.w/20,o=i-a.h/5;break;case"r":n*=.25,h*=.75,e=c-a.w/20,o=i-a.h/5;break;case"t":n*=1.75,h*=.25,e=c-a.w/5,o=i-a.h/20;break;case"b":n*=.75,h*=1.25,e=c-a.w/5,o=i+a.h/20;break;default:n=0}let f="yellow";s.d.fc(c,i,t,n-d,n+Math.PI+d,{fs:f}),s.d.fc(c,i,t,h-d,h+Math.PI+d,{fs:f}),s.d.fc(e,o,t/7,void 0,void 0,{fs:"black"})}if(!0===f)s.d.dp(s.b.l<=0?`${s.b.n} is now rebooting...`:`${s.p.n} was Defeated!`);else{s.d.dp();let t=s.c.p.x+s.c.p.w/2,e=s.c.p.y+s.c.p.h/2;s.d.fc(t,e,5);let o=40,l=15,c=.7,i=t,a=e,n=i+o*g.x,r=a+o*g.y;s.d.l(n,r,n+l/o*((i-n)*Math.cos(c)+(a-r)*Math.sin(c)),r+l/o*((a-r)*Math.cos(c)-(i-n)*Math.sin(c))),s.d.l(n,r,n+l/o*((i-n)*Math.cos(c)-(a-r)*Math.sin(c)),r+l/o*((a-r)*Math.cos(c)+(i-n)*Math.sin(c)))}}})()}}},function(t,e,o){o.r(e),o.d(e,"PONG",function(){return g});const{GAME:s}=o(0);let l,c,i,a,n,r,h,d,f,p,u,m,y,w=(t,e)=>{let o={x:f.x-t.x,y:e-t.y},c=s.f.norm(o.x,o.y);if(c.y>=-.1&&c.y<=.1)return;let i=t.y+c.y*s.dt,n=l.y+l.h-a.h;i<l.y?i=l.y:i>n&&(i=n),t.y=i},x=(t,e)=>{r||(t.B>e.y&&t.T<e.y+a.h?(r=s.f.dp(void 0,y[0]),f.s<2&&(f.s+=.05*Math.random())):r=s.f.db())};const g={os:()=>{let t=s.c.w/10,e=s.c.h/10;c={x:5*t-180,y:10*e-72,w:360,h:60},i={x:5*t-120,y:10*e-100,w:240,h:60},a={w:10,h:(l={x:t,y:e,w:8*t,h:6*e}).h/5},h={x:l.x+3,y:l.y+l.h/2},d={x:l.x+l.w-3-a.w,y:h.y},n=1,r=!1,f={x:l.x+l.w/2,y:l.y+l.h/2,r:7,dx:Math.random(),dy:Math.random(),fx:0,fy:0,s:1},p=!1,u={x:f.x,y:f.y},m=0,y=[-10],s.p.d=10*s.p.m,s.p.s[s.cu()]=1e3/Math.pow(s.p.m,2),s.b.n="Pong",s.b.l=100,s.b.d=1,s.e("click",()=>{1==n&&setTimeout(()=>{m=0,n=2},100)},c),s.e("click",()=>{2==n&&(n=0)},i),s.e("mousemove",(t,e,o)=>{0==n&&(u={x:e,y:o})}),s.e("mousedown",()=>{0==n&&(p=!0)}),s.e("mouseup",()=>{0==n&&(p=!1)})},ou:()=>{(()=>{if(0!=n)return;let t=f.y-a.h/2,e=l.y+l.h-a.h;t<l.y?t=l.y:t>e&&(t=e),w(h,t),w(d,t);let o={x:f.dx,y:f.dy};if(p){let t={x:u.x-f.x,y:u.y-f.y},e=s.f.norm(t.x,t.y);f.fx=e.x,f.fy=e.y,o.x+=f.fx/50,o.y+=f.fy/50}let c=s.f.norm(o.x,o.y);c.x>-.5&&c.x<.5&&(c.x=c.x<=0?-.5:.5),c.y>-.5&&c.y<.5&&(c.y=c.y<=0?-.5:.5),f.dx=c.x,f.dy=c.y;let i=f.s*s.dt/1.5,r=f.x+f.dx*i,m=f.y+f.dy*i,y=h.x+a.w,g=d.x,b=l.y,v=l.y+l.h,M={L:r-f.r,R:r+f.r,T:m-f.r,B:m+f.r};M.L<y?(x(M,h),r=y+f.r,f.dx*=-1):M.R>g&&(x(M,d),r=g-f.r,f.dx*=-1),M.T<b?(m=b+f.r,f.dy*=-1):M.B>v&&(m=v-f.r,f.dy*=-1),f.x=r,f.y=m})(),(()=>{if(0!=n){m+=s.dt;let t=70,e=50;s.d.dt(n,["Mission #2","Controls"],[[{c:"The year is 1972.",sp:t,tm:e},{c:"Evil Chess has taken control of Pong. Your second mission is to defeat",sp:t/1.8,tm:e},{c:"Pong in order to restart it.",sp:t,tm:e},{c:"You will receive control of a magnetic field with the power to influence the",sp:t/1.8,tm:e},{c:"movement of the ball on the field.",sp:t,tm:e},{c:"However, Pong will do everything to avoid the ball going out of bounds by ",sp:t/1.8,tm:e},{c:"controlling the side bars.",sp:t,tm:e},{c:"Your goal, then, is to get the ball out of the field to weaken the Pong. But",sp:t/1.8,tm:e},{c:"be careful, you can be hurt when hitting the side bars.",sp:1.1*t,tm:e},{c:"Are you ready for the mission?",sp:t,tm:e,s:{ta:"c"},x:s.c.x+s.c.w/2}],[{c:"- Use your mouse to move through the game area.",sp:t,tm:e},{c:"- Click to activate the magnetic field.",sp:t,tm:e},{c:"- It will try to push the ball to your mouse position.",sp:t,tm:e},{c:"- This can slightly change ball direction.",sp:t,tm:e},{c:"- You can see magnetic field direction when active.",sp:t,tm:e}]],m,[c,i],["Travel to 1972","Play"])}else if(s.d.sr(l.x,l.y,l.w,l.h),s.d.sl(l.x+l.w/2,l.y,l.x+l.w/2,l.y+l.h,30),s.d.fr(h.x,h.y,a.w,a.h),s.d.fr(d.x,d.y,a.w,a.h),s.d.fc(f.x,f.y,f.r),!0===r)s.d.dp(s.b.l<=0?`${s.b.n} is now rebooting...`:`${s.p.n} was Defeated!`);else if(s.d.dp(),s.d.ft("Ball Speed",s.c.p.x+s.c.p.w/2,s.c.p.y+s.c.p.h/3,{f:20}),s.d.ft(Math.round(10*f.s)/10,s.c.p.x+s.c.p.w/2,s.c.p.y+s.c.p.h/3+30,{f:25}),p)for(let t=1,e=f.x,o=f.y;t<50&&!(f.x<=u.x&&e>u.x||f.x>u.x&&e<=u.x||f.y<=u.y&&o>u.y||f.y>u.y&&o<=u.y);e+=++t*f.fx*2.5,o+=t*f.fy*2.5)s.d.fc(e,o,1,void 0,void 0,{fs:"orange"})})()}}},function(t,e,o){o.r(e),o.d(e,"TICTACTOE",function(){return M});const{GAME:s}=o(0);let l,c,i,a,n,r,h,d,f,p,u,m,y,w=()=>{for(let t=0;t<p.length;t++)if(-1===p[t])return t;return-1},x=(t=w())=>{let e=Math.floor(t/3);return{x:t-3*e,y:e}},g=t=>{for(let e=0;e<f.length;e++){let o=f[e].reduce((e,o)=>e*=t[o],1);if(1===o||8===o)return Math.cbrt(o)}return 0!==p.reduce((t,e)=>t*e,1)?-1:0},b=t=>{if(-1===u)for(let t=0;t<p.length;t++)-1===p[t]&&(p[t]=0);switch(p[t]=u,u){case-1:u=1;break;case 1:u=2;break;case 2:let e=x(),o=!1;for(let t=-1;t<2;t++)for(let s=-1;s<2;s++){let l=e.x+t,c=e.y+s;if(l>=0&&l<=2&&c>=0&&c<=2&&0===p[l+3*c]){o=!0;break}}u=o?-1:1}let e=g(p);0!==e?(r=-1===e?s.f.db():s.f.dp(void 0,y[0]))||(d=e,setTimeout(v,2e3)):u>0&&setTimeout(()=>{let t=-1,e=[],o=[],s=1===u?2:1;for(let l=0;l<9;l++)if(0===p[l]){let c=p.slice(0);if(c[l]=u,g(c)===u){t=l;break}c[l]=s,g(c)===s?e.push(l):o.push(l)}-1===t&&(t=e.length>0?e[0]:o[Math.floor(Math.random()*o.length)]),setTimeout(()=>b(t),500)},1e3)},v=()=>{p=[0,0,0,0,0,0,0,0,0],d=0,u=-1};const M={os:()=>{let t=s.c.w/5,e=s.c.h/10;c={x:2.5*t-180,y:10*e-75,w:360,h:60},i={x:2.5*t-120,y:10*e-100,w:240,h:60},a={w:(l={x:t,y:e,w:3*t,h:6*e}).w/3,h:l.h/3},n=1,r=!1,h={"-1":"⊗",0:"",1:"X",2:"0"},f=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],m=0,y=[-200],s.p.d=25*s.p.m,s.p.s[s.cu()]=1e3/Math.pow(s.p.m,2),s.b.n="Tic & Tac",s.b.l=100,s.b.d=15/s.p.m,s.e("click",()=>{1==n&&setTimeout(()=>{m=0,n=2},100)},c),s.e("click",()=>{2==n&&(n=0)},i),s.e("click",(t,e,o)=>{if(0==n&&-1===u&&0===d&&!r){let t={x:Math.floor((e-l.x)/a.w),y:Math.floor((o-l.y)/a.h)},s=w(),c=x(s);if(-1===s||Math.abs(t.x-c.x)<=1&&Math.abs(t.y-c.y)<=1){let e=t.x+3*t.y;0===p[e]&&b(e)}}},l),v()},ou:()=>{(()=>{if(0!=n){m+=s.dt;let t=70,e=50;s.d.dt(n,["Mission #3","Controls"],[[{c:"The year is 1952.",sp:t,tm:e},{c:"Evil Chess has taken control of Tic Tac Toe. Your third mission is to defeat",sp:t/1.8,tm:e},{c:"Tic and Tac in order to restart it.",sp:t,tm:e},{c:"Tic is playing against Tac. Your goal is to prevent any of them from winning",sp:t/1.8,tm:e},{c:"a match by weakening them.",sp:t,tm:e},{c:"For this you will be positioned inside the board. Each turn, you will have to",sp:t/1.8,tm:e},{c:"move to an adjacent board square.",sp:t,tm:e},{c:"This will prevent Tic or Tac from marking the board where you are situated.",sp:t/1.8,tm:e},{c:"Be careful, as if Tic or Tac wins a match, you will take damage.",sp:1.05*t,tm:e},{c:"Ready for this?",sp:t,tm:e,s:{ta:"c"},x:s.c.x+s.c.w/2}],[{c:"- Use your mouse to move through the board cells.",sp:t,tm:e},{c:"- Click on a cell to move to it.",sp:t,tm:e},{c:"- Movable cells will have a small ball on it's center.",sp:t,tm:e},{c:"- You can only move to adjacent cells.",sp:t,tm:e}]],m,[c,i],["Travel to 1952","Play"])}else{for(let t=0;t<2;t++)for(let e=0;e<2;e++)s.d.l(l.x+a.w*t*(e+1),l.y+a.h*(1-t)*(e+1),l.x+l.w*(1-t)+a.w*t*(e+1),l.y+a.h*(1-t)*(e+1)+l.h*t);let t=w(),e=x(t);for(let o=0;o<9;o++){let c=x(o);0!==p[o]?s.d.ft(h[p[o]],l.x+a.w*(.5+c.x),l.y+a.h*(.5+c.y)):-1==u&&(-1==t||Math.abs(e.x-c.x)<=1&&Math.abs(e.y-c.y)<=1)&&s.d.fc(l.x+(c.x+.5)*a.w,l.y+(c.y+.5)*a.h,2,void 0,void 0,{fs:"#AAAAAA"})}if(!0===r)s.d.dp(s.b.l<=0?`${s.b.n} is now rebooting...`:`${s.p.n} was Defeated!`);else if(0!==d)s.d.dp(-1===d?`${s.p.d} damage to ${s.b.n}!`:`${s.b.d} damage to you!`);else{let t="b",e=s.c.p.x+s.c.p.w/2,o=s.c.p.y+s.c.p.h-17;s.d.ft("x",e,o-3,{tb:t}),-1===u?s.d.ft("<",e-40,o,{tb:t}):s.d.ft(">",e+40,o,{tb:t}),s.d.dp()}}})()}}},function(t,e,o){o.r(e),o.d(e,"CHESS",function(){return R});const{GAME:s}=o(0);let l,c,i,a,n,r,h,d,f,p,u,m,y,w,x,g,b,v,M,k,T,E,A=t=>({x:l.x+a.w*(t%8),y:l.y+a.h*Math.floor(t/8)}),P=(t,e,o)=>{t[t.indexOf(e)]=o,x[o]=x[e],x[e]=0},C=(t,e)=>{t.splice(t.indexOf(e),1),x[e]=0},I=(t,e,o)=>{t===g?(f=s.f.db(6==x[o]?50:void 0),C(b.includes(o)?b:v,o),P(t,e,o)):(f=s.f.dp(void 0,E[0]),C(t,e))},S=t=>{if(f)return;let e=[];for(let o=0;o<x.length;o++){x[o]==w[0]&&t.includes(o)&&e.push(o)}if(e.length>0){let o,s,l=[...e].sort(()=>Math.random()-.5),c=t===b?-1:1,i=[],a=[];for(;l.length>0;){o=l.shift();let e=_(t,o,c);if(e.length>0){i=e;break}let n=B(o,c);n.length>0&&(a=n,s=o)}if(i.length>0){let e=i[Math.floor(Math.random()*i.length)];r=o,setTimeout(()=>{h=e,setTimeout(()=>{r=-1,h=-1,I(t,o,e),O(t)},400)},400)}else if(a.length>0){let e=a[Math.floor(Math.random()*a.length)];r=o,setTimeout(()=>{h=e,setTimeout(()=>{r=-1,h=-1,P(t,s,e),1==x[e]&&(t===v&&e<8||t===b&&e>=56)&&(x[e]=m[Math.floor(Math.random()*(m.length-2))+1]),O(t)},400)},400)}else O(t)}else O(t)},O=t=>{f||(y=(y+1)%3,t===b?setTimeout(()=>S(v),1e3):t===v&&(w.push(m[Math.floor(Math.random()*m.length)]),w.shift(),x[g[0]]=w[0],k=_(g,g[0],0),M=B(g[0],0),0==k.length&&0==M.length&&(y=1,setTimeout(()=>S(b),1e3))))},_=(t,e,o)=>{let s=[],l=1,c=!1;switch(w[0]){case 1:s=0===o?[-9,-7,9,7]:[-9*o,-7*o];break;case 2:s=[-10,-17,-6,-15,6,15,10,17],l=2;break;case 3:s=[-9,-7,7,9],c=!0;break;case 4:s=[-1,1,-8,8],c=!0;break;case 5:s=[-1,1,-8,8,-9,-7,7,9],c=!0;break;case 6:s=[-1,1,-8,8,-9,-7,7,9]}return s.reduce((o,s)=>{let i=e,a=!0;for(;a&&(a=G(i,s,l));){let e=i+s;if(0!=x[e]){x[e]==w[0]&&(t===g||g.includes(e)&&6!=w[0])&&o.push(e);break}if(!c)break;i+=s}return o},[])},B=(t,e)=>{let o=[],s=1,l=!1;switch(w[0]){case 1:o=0===e?[-8,8]:[-8*e];break;case 2:o=[-10,-17,-6,-15,6,15,10,17],s=2;break;case 3:o=[-9,-7,7,9],l=!0;break;case 4:o=[-1,1,-8,8],l=!0;break;case 5:o=[-1,1,-8,8,-9,-7,7,9],l=!0;break;case 6:o=[-1,1,-8,8,-9,-7,7,9]}return o.reduce((e,o)=>{let c=t,i=!0;for(;i&&(i=G(c,o,s));){let t=c+o;if(0!=x[t])break;if(e.push(t),!l)break;c+=o}return e},[])},G=(t,e,o)=>{let s=t%8,l=Math.floor(t/8),c=t+e;if(c<0||c>63)return!1;let i=c%8,a=Math.floor(c/8);return!(Math.abs(i-s)>o||Math.abs(a-l)>o)},Y=(t,e)=>{for(let o=0;o<t.length;o++){let l=t[o],c=A(l);s.d.dic(u[x[l]],c.x+a.w/2,c.y+a.h/2,e,(l+Math.floor(l/8))%2==0?p[0]:p[1],30)}},$=(t,e)=>{for(let o=0;o<t.length;o++){let l=t[o],c=A(l);l==n?s.d.fr(c.x,c.y,a.w,a.h,{fs:e}):s.d.sr(c.x,c.y,a.w,a.h,{ss:e})}};const R={os:()=>{let t=s.c.w/2,e=s.c.h/2;c={x:t-180,y:2*e-70,w:360,h:60},i={x:t-120,y:2*e-100,w:240,h:60},a={w:(l={x:t/4,y:e/10,w:1.5*t,h:1.5*e}).w/8,h:l.h/8,c:8},n=-1,r=-1,h=-1,d=1,f=!1,p=["#D8DbBf","#7d8796","#224422","maroon","indigo","rgba(255, 0, 0, 0.5)"],u={1:"PA",2:"KN",3:"BI",4:"RO",5:"QU",6:"KI"},m=Object.keys(u).map(t=>parseInt(t)),y=0,w=[1,1,1,1],x=[4,2,3,5,6,3,2,4,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,4,2,3,5,6,3,2,4],g=[],b=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],v=[48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63],M=[24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39],k=[],T=0,E=[-12.5],s.p.d=3.125*s.p.m,s.p.s[s.cu()]=2e3/Math.pow(s.p.m,2),s.b.n="Evil Chess",s.b.l=100,s.b.d=6.25/s.p.m,s.e("click",()=>{1==d&&setTimeout(()=>{T=0,d=2},100)},c),s.e("click",()=>{2==d&&(d=0)},i),s.e("click",(t,e,o)=>{if(0==y){let t={x:Math.floor((e-l.x)/a.w),y:Math.floor((o-l.y)/a.h)},s=t.x+8*t.y;M.includes(s)?(0==g.length?(g.push(s),x[s]=w[0]):P(g,g[0],s),y=1,setTimeout(()=>S(b),1e3)):k.includes(s)&&(I(g,g[0],s),y=1,setTimeout(()=>S(b),1e3))}},l),s.e("mousemove",(t,e,o)=>{if(0==y){let t={x:Math.floor((e-l.x)/a.w),y:Math.floor((o-l.y)/a.h)};n=t.x+8*t.y}},l)},ou:()=>{(()=>{if(0!=d){T+=s.dt;let t=70,e=50;s.d.dt(d,["Final Mission","Controls"],[[{c:"The year is 1950.",sp:t,tm:e},{c:"Evil Chess has completely replaced it's original game. Your last mission is",sp:t/1.8,tm:e},{c:"to defeat him in order to restart it.",sp:t,tm:e},{c:"Your goal is to kill enough pieces of Evil Chess, but he is controlling both",sp:t/1.8,tm:e},{c:"sides and you are just one piece.",sp:t,tm:e},{c:"Each turn, only one type of piece can move or attack. But don't worry, you",sp:t/1.8,tm:e},{c:"got the power to change your piece type as the selected at round.",sp:t,tm:e},{c:"Killing a King will do a lot of damage to Evil Chess. Think smart and plan",sp:t/1.8,tm:e},{c:"your best strategy.",sp:1.05*t,tm:e},{c:"Are you prepared?",sp:t,tm:e,s:{ta:"c"},x:s.c.x+s.c.w/2}],[{c:"- Use your mouse to move through the board cells.",sp:t,tm:e},{c:"- Click on a cell to move to it or attack it.",sp:t,tm:e},{c:"- Movable cells will have green borders and attackable red.",sp:t,tm:e},{c:"- Your piece type will change along the turns (check sequence on bottom).",sp:t,tm:e},{c:"- Only pieces of turn type can move, attack or be attacked.",sp:t,tm:e}]],T,[c,i],["Travel to 1950","Play"])}else{for(let t=0;t<x.length;t++){let e=A(t);s.d.fr(e.x,e.y,a.w,a.h,{fs:(t+Math.floor(t/8))%2==0?p[0]:p[1]})}if(Y(g,p[2]),Y(b,p[3]),Y(v,p[4]),0==y)$(M,p[2]),$(k,p[5]);else if(0!=y){let t=1==y?p[3]:p[4];if(-1!=r){let e=A(r);s.d.sr(e.x,e.y,a.w,a.h,{ss:t})}if(-1!=h){let e=A(h);0==x[h]?s.d.fr(e.x,e.y,a.w,a.h,{fs:t}):s.d.sr(e.x,e.y,a.w,a.h,{ss:p[5]})}}!0===f?s.d.dp(s.b.l<=0?`${s.b.n} is now rebooting...`:`${s.p.n} was Defeated!`):(s.d.dp(),s.d.dic(u[w[0]],s.c.p.x+s.c.p.w/2-70,s.c.p.y+s.c.p.h/3-5,"white","#333333",25),s.d.ft("->",s.c.p.x+s.c.p.w/2-35,s.c.p.y+s.c.p.h/3-5,{f:20}),s.d.dic(u[w[1]],s.c.p.x+s.c.p.w/2,s.c.p.y+s.c.p.h/3-5,"#AAAAAA","#333333",25),s.d.ft("->",s.c.p.x+s.c.p.w/2+35,s.c.p.y+s.c.p.h/3-5,{f:20}),s.d.dic(u[w[2]],s.c.p.x+s.c.p.w/2+70,s.c.p.y+s.c.p.h/3-5,"#AAAAAA","#333333",25),s.d.ft("Order",s.c.p.x+s.c.p.w/2,s.c.p.y+s.c.p.h/3+35,{f:20}))}})()}}},function(t,e,o){o.r(e),o.d(e,"GAMEOVER",function(){return d});const{GAME:s}=o(0);let l,c,i,a,n,r,h=()=>{let t=r<1300?"#999999":void 0,e=l.y;if(s.d.db(l,"New Game",{fs:t,ss:t}),!n){e+=100;let o=s.m.s?t:"#999999";if(c.y=e,s.d.db(c,"Revive",{fs:o,ss:o}),!s.m.s){let t=1,e=c.x+c.w-30,l=c.y+c.h/2+2,i="#2A293E";s.d.fc(e,l-5*t,10*t,void 0,void 0,{fs:o}),s.d.fr(e-10*t,l+10*t,20*t,13*-t,{fs:o}),s.d.fc(e,l-5*t,6.5*t,Math.PI,2*Math.PI,{fs:i}),s.d.fc(e,l+t,3.5*t,void 0,void 0,{fs:i}),s.d.l(e,l,e,l+7*t,{ss:i,lw:4})}}s.m.s||(e+=100,i.y=e,s.d.db(i,"Support Us",{fs:t,ss:t})),e+=100,a.y=e,s.d.db(a,"View Code",{fs:t,ss:t})};const d={os:t=>{let e=s.c.x+s.c.w/2,o=s.c.y+s.c.h;l={x:e/2-180,y:o-390,w:360,h:60},c={x:e/2-180,y:o,w:360,h:60},i={x:e/2-180,y:o,w:360,h:60},a={x:e/2-180,y:o,w:360,h:60},n=!1,r=0,s.e("click",()=>{r>=1300&&(s.p.n="",s.p.l=100,s.n())},l),s.e("click",()=>{r>=1300&&!n&&s.m.s&&s.r()},c),s.e("click",()=>{r>=1300&&(s.m.a?s.m.s||window.open("https://coil.com/settings/payment","_blank"):window.open("https://coil.com","_blank"))},i),s.e("click",()=>{r>=1300&&window.open("https://gitlab.com/ighour-projects/games/html/back-to-game","_blank")},a)},ou:()=>{(()=>{r+=s.dt;let t=s.c.x,e=s.c.y,o=t+s.c.w/2,l=40;if(n){s.d.ft("Congratulations!",o,e+80,{f:70}),s.d.l(t+20,e+180,2*o-20,e+180);let c=[{c:"You have rescued all corrupted games and defeated Evil Chess.",sp:l,tm:50},{c:"Now you can return home and safely play your games.",sp:l,tm:50}];s.d.dtx(c,o,e+220,{f:30},r),s.d.l(t+20,e+300,2*o-20,e+300)}else{s.d.ft("Game Over!",o,e+80,{f:70}),s.d.l(t+20,e+160,2*o-20,e+160);let c=[{c:"Gaming world is still being corrupted by Evil Chess.",sp:l,tm:50},{c:"Now you need to return home and try all again to save your games.",sp:l,tm:50},{c:"Unless you revive yourself to continue from last mission.",sp:l,tm:50}];s.d.dtx(c,o,e+200,{f:30},r),s.d.l(t+20,e+320,2*o-20,e+320)}l=70;let c=s.p.s.map(t=>Math.round(t)),i=c.reduce((t,e)=>t+e,0),a=[{c:"Score",tm:200,x:1.5*o-60,y:e+380,s:{f:40}},{c:"Pacman",tm:100},{c:`${c[1]?c[1]:0} pts`,sp:l,tm:70,ta:"r",x:2*o-140},{c:"Pong",tm:100},{c:`${c[2]?c[2]:0} pts`,sp:l,tm:70,ta:"r",x:2*o-140},{c:"Tic Tac Toe",tm:100},{c:`${c[3]?c[3]:0} pts`,sp:l,tm:70,ta:"r",x:2*o-140},{c:"Chess",tm:100},{c:`${c[4]?c[4]:0} pts`,sp:l,tm:70,ta:"r",x:2*o-140},{c:"Total",tm:100},{c:`${i} pts`,sp:l,tm:70,ta:"r",x:2*o-140}];s.d.dtx(a,o+20,e+430,{ta:"l",f:30},r),h()})()}}}]);