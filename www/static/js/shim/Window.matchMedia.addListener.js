window.addEventListener&&function(){if(!window.matchMedia("").addListener){var e=window.matchMedia;window.matchMedia=function(t){var n=e(t),r=[],i=!1,s,o=function(){var s=e(t),o=s.matches&&!i,u=!s.matches&&i;if(o||u)for(var a=0,f=r.length;a<f;a++)r[a].call(n,s);i=s.matches};return n.addListener=function(e){r.push(e),s||(s=setInterval(o,1e3))},n.removeListener=function(e){for(var t=0,n=r.length;t<n;t++)r[t]===e&&r.splice(t,1);!r.length&&s&&clearInterval(s)},n}}}();