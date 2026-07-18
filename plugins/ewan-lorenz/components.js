import { h } from "preact"

const CSS = `
#lorenz-canvas { position:fixed; inset:0; width:100vw; height:100vh; z-index:-1; pointer-events:none; opacity:0; transition:opacity 240ms ease; }
#lorenz-canvas[data-lorenz-quality]:not([data-lorenz-quality="off"]) { opacity:1; }
[saved-theme="dark"] #lorenz-canvas { opacity:.5; }
[saved-theme="light"] #lorenz-canvas { filter:invert(1); opacity:.35; }
#lorenz-controls { position:fixed; right:0; bottom:20px; z-index:1000; width:220px; font-family:var(--bodyFont); font-size:.85rem; transform:translateX(100%); transition:transform .3s ease; }
#lorenz-controls.open { transform:translateX(0); }
#lorenz-controls .controls-tab { position:absolute; left:0; top:50%; transform:translate(-100%,-50%); padding:8px 6px; border:1px solid var(--lightgray); border-right:0; border-radius:8px 0 0 8px; background:var(--light); color:var(--gray); cursor:pointer; writing-mode:vertical-rl; font-size:.75rem; }
#lorenz-controls .controls-panel { max-height:70vh; overflow-y:auto; padding:16px; border:1px solid var(--lightgray); border-radius:8px 0 0 8px; background:color-mix(in srgb,var(--light) 92%,transparent); box-shadow:-2px 2px 10px rgba(0,0,0,.1); backdrop-filter:blur(12px); }
#lorenz-controls h4 { margin:0 0 12px; padding-bottom:8px; border-bottom:1px solid var(--lightgray); color:var(--dark); font-size:.9rem; }
#lorenz-controls .control-group { margin-bottom:12px; }
#lorenz-controls label { display:flex; justify-content:space-between; gap:.5rem; margin-bottom:4px; color:var(--darkgray); font-size:.8rem; }
#lorenz-controls input,#lorenz-controls select { width:100%; accent-color:var(--secondary); }
#lorenz-controls select { padding:5px 7px; border:1px solid var(--lightgray); border-radius:4px; background:var(--light); color:var(--darkgray); }
#lorenz-controls .control-value,#lorenz-controls .lorenz-status { color:var(--gray); font-size:.75rem; }
#lorenz-controls .control-reset { width:100%; padding:6px 12px; border:1px solid var(--gray); border-radius:4px; background:var(--lightgray); color:var(--darkgray); cursor:pointer; }
@media(max-width:800px){#lorenz-controls{display:none}}
`

const RUNTIME = `
(function() {
  if (window.__ewanLorenz) { window.__ewanLorenz.mount(); return; }
  var defaults = { sigma:14, rho:32, beta:2.666667, speed:.5, turbulence:.5, length:.6, intensity:.75 };
  var params = Object.assign({}, defaults), cleanup = null, startTimer = null;
  var prefKey = "ewan-lorenz-mode";
  function storedMode() { try { return localStorage.getItem(prefKey) || "auto"; } catch (_) { return "auto"; } }
  function autoTier() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return "off";
    if (navigator.connection?.saveData || /(?:slow-)?2g/.test(navigator.connection?.effectiveType || "")) return "off";
    var memory = navigator.deviceMemory || 4, cores = navigator.hardwareConcurrency || 4;
    if (innerWidth <= 800 || memory <= 2 || cores <= 2) return "off";
    if (innerWidth <= 1100 || memory <= 4 || cores <= 4) return "low";
    if (memory >= 8 && cores >= 8 && innerWidth >= 1400) return "high";
    return "medium";
  }
  function quality() { var mode = storedMode(); return mode === "off" ? "off" : mode === "on" ? (autoTier() === "off" ? "low" : autoTier()) : autoTier(); }
  function createControls(onChange) {
    document.getElementById("lorenz-controls")?.remove();
    var root = document.createElement("div"); root.id = "lorenz-controls";
    var tab = document.createElement("button"); tab.className = "controls-tab"; tab.textContent = "Flow Settings"; tab.onclick = function(){root.classList.toggle("open");};
    var panel = document.createElement("div"); panel.className = "controls-panel"; panel.innerHTML = '<h4>Lorenz Flow</h4>';
    var group = document.createElement("div"); group.className = "control-group"; group.innerHTML = '<label>Rendering mode</label>';
    var select = document.createElement("select"); [["auto","Auto"],["on","Always on"],["off","Off"]].forEach(function(o){var e=document.createElement("option");e.value=o[0];e.textContent=o[1];select.appendChild(e);}); select.value=storedMode();
    select.onchange=function(){try{localStorage.setItem(prefKey,select.value);}catch(_){} onChange();}; group.appendChild(select); panel.appendChild(group);
    [["sigma","Sigma (σ)",1,30,.5],["rho","Rho (ρ)",1,50,.5],["beta","Beta (β)",.1,10,.1],["speed","Speed",.1,2,.1],["turbulence","Turbulence",0,1.5,.05],["length","Vector Length",.1,1.5,.05],["intensity","Intensity",.1,1,.05]].forEach(function(s){
      var g=document.createElement("div");g.className="control-group";var label=document.createElement("label");label.innerHTML=s[1]+' <span class="control-value">'+params[s[0]].toFixed(2)+'</span>';var input=document.createElement("input");input.type="range";input.min=s[2];input.max=s[3];input.step=s[4];input.value=params[s[0]];input.oninput=function(){params[s[0]]=Number(input.value);label.querySelector("span").textContent=params[s[0]].toFixed(2);};g.append(label,input);panel.appendChild(g);
    });
    var status=document.createElement("div");status.className="lorenz-status";status.dataset.lorenzStatus="";panel.appendChild(status);
    var reset=document.createElement("button");reset.className="control-reset";reset.textContent="Reset to Default";reset.onclick=function(){Object.assign(params,defaults);root.remove();createControls(onChange);};panel.appendChild(reset);
    root.append(tab,panel);document.body.appendChild(root);return root;
  }
  function run(canvas, tier, status) {
    var ctx=canvas.getContext("2d",{alpha:true}), stopped=false, raf=0, last=0, samples=[], pointer=null;
    var settings={low:[26,1,24],medium:[20,1.25,30],high:[15,1.5,60]}[tier] || [26,1,24];
    function resize(){var dpr=Math.min(devicePixelRatio||1,settings[1]);canvas.width=Math.round(innerWidth*dpr);canvas.height=Math.round(innerHeight*dpr);canvas.style.width=innerWidth+"px";canvas.style.height=innerHeight+"px";ctx.setTransform(dpr,0,0,dpr,0,0);}
    function draw(now){if(stopped)return;raf=requestAnimationFrame(draw);if(document.hidden||now-last<1000/settings[2])return;var dt=last?now-last:16;last=now;samples.push(dt);if(samples.length>120)samples.shift();
      ctx.clearRect(0,0,innerWidth,innerHeight);ctx.strokeStyle="rgba(255,255,255,"+params.intensity+")";ctx.fillStyle="rgba(255,255,255,.3)";ctx.lineWidth=.7;var spacing=settings[0],t=now*.0005*params.speed;
      for(var x=-spacing;x<innerWidth+spacing;x+=spacing)for(var y=-spacing;y<innerHeight+spacing;y+=spacing){var px=(x-innerWidth/2)*.035+Math.sin(t*.8)*5,py=(y-innerHeight/2)*.035+Math.cos(t*.7)*5,pz=25+Math.sin(t*.5)*10;var dx=params.sigma*(py-px),dy=px*(params.rho-pz)-py;var a=Math.atan2(dy,dx)+Math.sin(px*.5+t*2)*Math.cos(py*.5+t*1.7)*params.turbulence;if(pointer){var ox=x-pointer[0],oy=y-pointer[1],d=Math.hypot(ox,oy);if(d<140&&d>1)a+=Math.atan2(oy,ox)*(1-d/140);}
        var len=Math.min(Math.hypot(dx,dy)/300,1)*spacing*params.length;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a)*len,y+Math.sin(a)*len);ctx.stroke();ctx.fillRect(x-1,y-1,2,2);}
      if(samples.length===120&&storedMode()==="auto"){var avg=samples.reduce(function(a,b){return a+b;},0)/samples.length;if(avg>45){status.textContent="Auto-disabled: render budget exceeded";stop();canvas.dataset.lorenzQuality="off";}}
    }
    function move(e){if(e.buttons)pointer=[e.clientX,e.clientY];} function up(){pointer=null;} function stop(){stopped=true;cancelAnimationFrame(raf);removeEventListener("resize",resize);removeEventListener("pointermove",move);removeEventListener("pointerup",up);}
    resize();addEventListener("resize",resize,{passive:true});addEventListener("pointermove",move,{passive:true});addEventListener("pointerup",up,{passive:true});raf=requestAnimationFrame(draw);return stop;
  }
  function mount(){if(cleanup){cleanup();cleanup=null;}clearTimeout(startTimer);var canvas=document.getElementById("lorenz-canvas");if(!canvas)return;var tier=quality();canvas.dataset.lorenzQuality=tier;var controls=createControls(mount);var status=controls.querySelector("[data-lorenz-status]");status.textContent=tier==="off"?"Disabled for this client":"Quality: "+tier;if(tier==="off")return;
    var start=function(){if(!document.getElementById("lorenz-canvas"))return;cleanup=run(canvas,tier,status);}; if("requestIdleCallback" in window)requestIdleCallback(start,{timeout:1200});else startTimer=setTimeout(start,150);
    navigator.getBattery?.().then(function(b){if(storedMode()==="auto"&&!b.charging&&b.level<.15){cleanup?.();cleanup=null;canvas.dataset.lorenzQuality="off";status.textContent="Auto-disabled: low battery";}}).catch(function(){});
  }
  document.addEventListener("nav",mount);document.addEventListener("visibilitychange",function(){if(!document.hidden&&!cleanup)mount();});window.__ewanLorenz={mount:mount};mount();
})();
`

export function LorenzBackground() {
  function Component() {
    return h("canvas", { id: "lorenz-canvas", "aria-hidden": "true" })
  }
  Component.displayName = "LorenzBackground"
  Component.css = CSS
  Component.afterDOMLoaded = RUNTIME
  return Component
}
