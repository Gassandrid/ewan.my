import { h } from "preact"

const CSS = `
.quartztoc{--scroll-amount:0;--thumb-amount:0;display:flex;flex-direction:column;align-self:stretch;width:100%;flex:1 1 0;min-height:0;margin:0;padding:0;font-family:var(--bodyFont);font-size:.85rem;line-height:1.3;text-align:left;word-break:break-word;position:relative}
.quartztoc.desktop-only{display:flex}
@media(max-width:800px){.quartztoc.desktop-only{display:none}}
.quartztoc-track{position:relative;flex:1 1 0;min-height:0;width:100%}
.quartztoc-track::before{content:"";position:absolute;inset:0 auto 0 0;width:1px;background:var(--lightgray);z-index:0}
.quartztoc-rail-thumb{position:absolute;left:-1px;width:3px;top:calc(var(--scroll-amount)*1%);height:calc(var(--thumb-amount)*1%);background:var(--gray);z-index:1;border-radius:1.5px;transition:top .05s linear}
.quartztoc .toc-row{position:absolute;left:0;right:0;top:calc(var(--toc-top,0)*1%);display:flex;align-items:flex-start;z-index:2;pointer-events:none}
.quartztoc .toc-row>*{pointer-events:auto}
.quartztoc .toc-level-2 .toc-link{padding-left:12px}.quartztoc .toc-level-3 .toc-link{padding-left:24px;font-size:.92em}.quartztoc .toc-level-4 .toc-link{padding-left:36px;font-size:.92em}.quartztoc .toc-level-5 .toc-link{padding-left:48px;font-size:.88em}.quartztoc .toc-level-6 .toc-link{padding-left:60px;font-size:.88em}
.quartztoc .toc-row-title .toc-text{font-family:var(--headerFont);font-weight:500;font-size:.95rem;letter-spacing:.01em}
.quartztoc .toc-dot{flex-shrink:0;width:7px;height:7px;margin-left:-3px;margin-top:.45em;margin-right:9px;border-radius:50%;background:var(--gray);opacity:.55;box-shadow:0 0 0 2px var(--light);position:relative;z-index:2;transition:background-color .2s,opacity .2s,transform .2s}
.quartztoc .toc-level-3 .toc-dot,.quartztoc .toc-level-4 .toc-dot{width:5px;height:5px;margin-left:-2px;opacity:.4}.quartztoc .toc-level-5 .toc-dot,.quartztoc .toc-level-6 .toc-dot{width:4px;height:4px;margin-left:-1.5px;opacity:.35}
.quartztoc .toc-link{display:inline-block;padding:0;color:var(--gray);text-decoration:none!important;background:none!important;line-height:1.3;opacity:0;max-width:calc(100% - 16px);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;transition:color .25s ease,opacity .25s ease}
.quartztoc .toc-link:hover{color:var(--dark)}.quartztoc:hover .toc-link{opacity:.85;white-space:normal;overflow:visible;text-overflow:clip}.quartztoc:hover .toc-link:hover{opacity:1}.quartztoc .toc-text{display:inline}
.quartztoc .toc-row.is-active .toc-dot{opacity:1;background:var(--secondary);box-shadow:0 0 0 2px var(--light);transform:scale(1.5)}.quartztoc .toc-row.is-active .toc-link{opacity:1;color:var(--dark);font-weight:500;white-space:normal;overflow:visible;text-overflow:clip}
`

const RUNTIME = `
(function(){
  var TOP="__top__", activeCleanup=null;
  function setup(){
    if(activeCleanup){activeCleanup();activeCleanup=null;}
    var toc=document.getElementById("quartztoc");if(!toc)return;
    var article=document.querySelector("article")||document.querySelector(".center");
    var rows=Array.from(toc.querySelectorAll(".toc-row[data-for]"));
    var links=Array.from(toc.querySelectorAll("a.toc-link[data-for]"));if(!rows.length)return;
    var rowBySlug=new Map(),headings=[];rows.forEach(function(row){var slug=row.dataset.for;if(slug)rowBySlug.set(slug,row);});
    rows.forEach(function(row){var slug=row.dataset.for;if(!slug||slug===TOP)return;var el=document.getElementById(slug);if(el)headings.push({slug:slug,el:el});});
    var current=null,ticking=false,cleanups=[];
    function on(target,event,handler,options){target.addEventListener(event,handler,options);cleanups.push(function(){target.removeEventListener(event,handler,options);});}
    function setActive(slug){if(slug===current)return;if(current)rowBySlug.get(current)?.classList.remove("is-active");if(slug)rowBySlug.get(slug)?.classList.add("is-active");current=slug;}
    function computeActive(){var target=innerHeight*.35,next=null;for(var i=0;i<headings.length;i++){var rect=headings[i].el.getBoundingClientRect();if(rect.top+rect.height/2<=target)next=headings[i].slug;else break;}setActive(next||(rowBySlug.has(TOP)?TOP:null));}
    function positionRows(){var title=rowBySlug.get(TOP);if(title)title.style.setProperty("--toc-top","0");if(!article||!headings.length)return;var rect=article.getBoundingClientRect(),top=rect.top+scrollY,height=rect.height;if(height<=0)return;headings.forEach(function(item){var row=rowBySlug.get(item.slug);if(!row)return;var offset=Math.max(0,item.el.getBoundingClientRect().top+scrollY-top);row.style.setProperty("--toc-top",Math.max(0,Math.min(100,offset/height*100)).toFixed(3));});}
    function updateThumb(){var ref=article||document.documentElement,rect=ref.getBoundingClientRect(),height=rect.height,viewport=innerHeight;if(height<=0){toc.style.setProperty("--scroll-amount","0");toc.style.setProperty("--thumb-amount","0");return;}var amount=Math.max(2,Math.min(100,viewport/height*100)),progress=Math.max(0,Math.min(1,Math.max(0,-rect.top)/Math.max(1,height-viewport)));toc.style.setProperty("--scroll-amount",(progress*(100-amount)).toFixed(3));toc.style.setProperty("--thumb-amount",amount.toFixed(3));}
    function refresh(){computeActive();updateThumb();ticking=false;}
    function onScroll(){if(ticking)return;ticking=true;requestAnimationFrame(refresh);}
    function onResize(){positionRows();onScroll();}
    function click(event){var slug=event.currentTarget.dataset.for;if(!slug)return;event.preventDefault();if(slug===TOP){scrollTo({top:0,behavior:"smooth"});history.pushState(null,"","#");setActive(TOP);return;}var el=document.getElementById(slug);if(!el)return;el.scrollIntoView({behavior:"smooth",block:"start"});history.pushState(null,"","#"+slug);setActive(slug);}
    links.forEach(function(link){on(link,"click",click);});on(document,"scroll",onScroll,{passive:true});on(window,"resize",onResize,{passive:true});
    positionRows();computeActive();updateThumb();var reflow=function(){positionRows();onScroll();};if(document.readyState!=="complete")on(window,"load",reflow,{once:true});else setTimeout(reflow,100);
    activeCleanup=function(){cleanups.forEach(function(fn){fn();});};if(typeof window.addCleanup==="function")window.addCleanup(activeCleanup);
  }
  document.addEventListener("nav",setup);if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",setup,{once:true});else setup();
})();
`

export function QuartzTOC() {
  function Component({ fileData, displayClass }) {
    const toc = fileData?.toc
    if (!Array.isArray(toc) || toc.length === 0) return null
    const title = fileData.frontmatter?.title
    const rows = []
    if (title) {
      rows.push(
        h(
          "div",
          { class: "toc-row toc-row-title", "data-for": "__top__", key: "__top__" },
          h("div", { class: "toc-dot", "aria-hidden": "true" }),
          h(
            "a",
            { class: "toc-link", href: "#", "data-for": "__top__" },
            h("span", { class: "toc-text" }, title),
          ),
        ),
      )
    }
    for (const entry of toc) {
      const slug = String(entry.slug)
      const level = Math.min(6, Math.max(2, Number(entry.depth) + 1))
      rows.push(
        h(
          "div",
          { class: `toc-row toc-level-${level}`, "data-for": slug, key: slug },
          h("div", { class: "toc-dot", "aria-hidden": "true" }),
          h(
            "a",
            { class: "toc-link", href: `#${slug}`, "data-for": slug },
            h("span", { class: "toc-text" }, String(entry.text)),
          ),
        ),
      )
    }
    return h(
      "div",
      { class: [displayClass, "quartztoc"].filter(Boolean).join(" "), id: "quartztoc" },
      h(
        "div",
        { class: "quartztoc-track" },
        h("div", { class: "quartztoc-rail-thumb", "aria-hidden": "true" }),
        rows,
      ),
    )
  }
  Component.displayName = "QuartzTOC"
  Component.css = CSS
  Component.afterDOMLoaded = RUNTIME
  return Component
}
