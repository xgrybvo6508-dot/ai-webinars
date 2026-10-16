// Простой статический генератор: content/webinars/*.md -> dist/
import fs from 'node:fs'; import path from 'node:path'; import { marked } from 'marked';
const ROOT = path.dirname(new URL(import.meta.url).pathname), OUT = path.join(ROOT, 'dist');
const COMPANIES = {
  anthropic:{name:'Anthropic / Claude',color:'#d97757'}, openai:{name:'OpenAI',color:'#10a37f'},
  google:{name:'Google',color:'#4f8cff'}, meta:{name:'Meta',color:'#0a7cff'},
  cursor:{name:'Cursor',color:'#b8b8ff'}, other:{name:'Другие',color:'#9aa3b2'} };
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function front(src){ const m = src.match(/^---\n([\s\S]*?)\n---\n?/); const d = {};
  if(!m) return [d, src];
  for(const line of m[1].split('\n')){ const i=line.indexOf(':'); if(i<0) continue;
    let k=line.slice(0,i).trim(), v=line.slice(i+1).trim();
    if(v.startsWith('[')) v=v.slice(1,-1).split(',').map(x=>x.trim().replace(/^["']|["']$/g,'')).filter(Boolean);
    else v=v.replace(/^["']|["']$/g,''); d[k]=v; }
  return [d, src.slice(m[0].length)]; }
const fmtDate = d => d ? new Date(d+'T12:00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'}) : '';
const items = fs.readdirSync(path.join(ROOT,'content/webinars')).filter(f=>f.endsWith('.md')).map(f=>{
  const [d, body] = front(fs.readFileSync(path.join(ROOT,'content/webinars',f),'utf8'));
  const slug = f.replace(/\.md$/,'');
  const md = body.replace(/^::fig\s+([\w-]+)(?:\s+"([^"]*)")?\s*$/gm, (_, n, cap) => { const fp = path.join(ROOT,'content/figures',n+'.svg');
    if(!fs.existsSync(fp)){ console.warn(`! ${f}: нет иллюстрации ${n}.svg`); return ''; }
    return `\n<figure class="fig draw">${fs.readFileSync(fp,'utf8').trim()}${cap?`<figcaption>${esc(cap)}</figcaption>`:''}</figure>\n`; });
  return {slug, ...d, company: COMPANIES[d.company]?d.company:'other', tags: Array.isArray(d.tags)?d.tags:(d.tags?[d.tags]:[]), html: marked.parse(md)};
}).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
const upcoming = JSON.parse(fs.readFileSync(path.join(ROOT,'content/upcoming.json'),'utf8'));
const allTags = [...new Set(items.flatMap(i=>i.tags))].sort();
const layout = (title, rel, body, cls='') => `<!doctype html><html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#0e0f13">
<title>${esc(title)}</title><link rel="stylesheet" href="${rel}assets/style.css"><link rel="icon" href="${rel}assets/icon.svg">
</head><body class="${cls}"><div class="aurora" aria-hidden="true"><i></i><i></i><i></i></div>
<header class="nav"><a class="brand press" href="${rel}index.html"><svg class="mark" viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8f9bff"/><stop offset="1" stop-color="#d97757"/></linearGradient></defs><circle cx="16" cy="16" r="13" fill="none" stroke="url(#lg)" stroke-width="2.4" class="ring" pathLength="1"/><path d="M13 10.5v11l9-5.5z" fill="url(#lg)" class="play"/><circle cx="26.5" cy="7" r="2.6" fill="#2fd6c3" class="dot"/></svg><span class="word">вебинары<b>.ai</b></span></a></header>
<main>${body}</main><footer class="foot">Саммари вебинаров AI-компаний · Reboard</footer>
<script src="${rel}assets/motion.js" defer></script></body></html>`;
const chip = (t, attr='') => `<button class="chip press" ${attr}>${esc(t)}</button>`;
const card = (w, rel) => { const c = COMPANIES[w.company];
  return `<a class="card reveal tilt press" href="${rel}w/${w.slug}/index.html" data-company="${w.company}" data-tags="${esc(w.tags.join('|'))}" style="--c:${c.color}">
  <span class="glow"></span><span class="co" style="view-transition-name:co-${w.slug}">${esc(c.name)}</span>
  <h3 style="view-transition-name:t-${w.slug}">${esc(w.title)}</h3><p>${esc(w.lead)}</p>
  <span class="meta">${fmtDate(w.date)}${w.duration?' · '+esc(w.duration):''}</span>
  <span class="tags">${w.tags.map(t=>`<em>#${esc(t)}</em>`).join('')}</span></a>`; };
fs.rmSync(OUT,{recursive:true,force:true}); fs.mkdirSync(path.join(OUT,'assets'),{recursive:true});
for(const f of fs.readdirSync(path.join(ROOT,'public'))) fs.cpSync(path.join(ROOT,'public',f), path.join(OUT,'assets',f), {recursive:true});
const index = `<section class="hero"><p class="kicker reveal">Библиотека знаний</p>
<h1 class="reveal parallax" data-speed="0.15">Вебинары<br><span class="grad">AI-компаний</span></h1>
<p class="sub reveal">Саммари по одной схеме: суть → пункты → инсайты → как применить → источник.</p>
<div class="stats reveal">Саммари: <b>${items.length}</b> · компаний: <b>${Object.keys(COMPANIES).filter(k=>items.some(i=>i.company===k)).length}</b> · впереди: <b>${upcoming.length}</b></div></section>
<section class="block"><h2 class="reveal">Ближайшие вебинары</h2><div class="upcoming">
${upcoming.map(u=>`<div class="up reveal tilt" data-at="${u.datetime}" style="--c:${(COMPANIES[u.company]||COMPANIES.other).color}">
<span class="glow"></span><span class="co">${esc((COMPANIES[u.company]||COMPANIES.other).name)}</span><h3>${esc(u.title)}</h3>
<span class="when">${esc(u.label)}</span><span class="countdown" aria-live="off"></span></div>`).join('')}</div></section>
<section class="block"><h2 class="reveal">Компании</h2><div class="chips reveal" data-filter="company">
${chip('Все','data-v="" aria-pressed="true"')}${Object.entries(COMPANIES).map(([k,c])=>chip(c.name+` <i>${items.filter(i=>i.company===k).length}</i>`,`data-v="${k}" aria-pressed="false" style="--c:${c.color}"`).replace(/&lt;i&gt;(\d+)&lt;\/i&gt;/,'<i>$1</i>')).join('')}</div>
<h2 class="reveal small">Темы</h2><div class="chips reveal" data-filter="tag">${chip('Все','data-v="" aria-pressed="true"')}${allTags.map(t=>chip('#'+t,`data-v="${esc(t)}" aria-pressed="false"`)).join('')}</div>
<div class="grid">${items.map(w=>card(w,'')).join('')}</div><p class="empty" hidden>Пока нет саммари с такими фильтрами.</p></section>`;
fs.writeFileSync(path.join(OUT,'index.html'), layout('Вебинары AI — саммари','',index,'home'));
for(const w of items){ const c=COMPANIES[w.company], rel='../../';
  const body = `<article class="page" style="--c:${c.color}"><a class="back press" href="${rel}index.html">← Все вебинары</a>
<header class="phead"><p class="eyebrow"><span class="co" style="view-transition-name:co-${w.slug}">${esc(c.name)}</span><span class="meta">${fmtDate(w.date)}${w.duration?' · '+esc(w.duration):''}</span></p>
<h1 style="view-transition-name:t-${w.slug}">${esc(w.title)}</h1><p class="sub">${esc(w.lead)}</p>
${w.speaker?`<p class="meta">${esc(w.speaker)}</p>`:''}
<span class="tags">${w.tags.map(t=>`<em>#${esc(t)}</em>`).join('')}</span></header>
<div class="prose">${w.html}</div>
${w.source?`<p class="source"><span class="orn">❦</span><br>Источник: <a class="press" href="${esc(w.source)}" target="_blank" rel="noopener">${esc(w.source_label||w.source)} ↗</a></p>`:''}</article>`;
  fs.mkdirSync(path.join(OUT,'w',w.slug),{recursive:true}); fs.writeFileSync(path.join(OUT,'w',w.slug,'index.html'), layout(w.title+' — саммари',rel,body,'detail')); }
fs.writeFileSync(path.join(OUT,'.nojekyll'),''); console.log(`✓ ${items.length} страниц → dist/`);
