import fs from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';
const cfg = JSON.parse(await fs.readFile('site.config.json', 'utf8'));
const base = (process.env.BASE_PATH ?? cfg.basePath).replace(/\/$/, '');
const origin = (process.env.SITE_URL ?? cfg.url).replace(/\/$/, '');
const url = p => `${base}/${p}`;
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const xml = esc;
const posts = [];
for (const file of (await fs.readdir('content/posts')).filter(f => f.endsWith('.md'))) {
 const raw = await fs.readFile(`content/posts/${file}`, 'utf8');
 const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
 if (!match) throw new Error(`Invalid frontmatter: ${file}`);
 const meta = JSON.parse(match[1]);
 if (meta.draft) continue;
 if (!meta.title || !meta.description || !/^\d{4}-\d{2}-\d{2}$/.test(meta.date) || !['Articles','Reports','Hacks'].includes(meta.category)) throw new Error(`Invalid metadata: ${file}`);
 const slug = file.replace(/\.md$/, '');
 let html = marked.parse(match[2]);
 const headings = [];
 html = html.replace(/<h2>(.*?)<\/h2>/g, (_, label) => { const id = `section-${headings.length + 1}`; headings.push({id,label}); return `<h2 id="${id}">${label}</h2>`; });
 posts.push({...meta,slug,html,headings,minutes:Math.max(1,Math.ceil(match[2].split(/\s+/).length/220))});
}
posts.sort((a,b) => b.date.localeCompare(a.date));
const date = d => new Date(d+'T12:00:00Z').toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'});
const postUrl = p => url(`posts/${p.slug}/`);
const nav = active => `<a class="skip" href="#main">Skip to content</a><header class="header"><a class="brand" href="${url('')}">p4y4b13<span class="brand-dot">.</span><span class="brand-sub">research notes</span></a><div class="nav-wrap"><nav aria-label="Main navigation"><a ${active==='home'?'aria-current="page"':''} href="${url('')}">Blog</a><a href="${cfg.portfolio}">Portfolio</a><a href="${cfg.github}">GitHub</a></nav><button class="theme-toggle" aria-label="Switch color theme" title="Switch color theme"><span aria-hidden="true">◐</span></button></div></header>`;
const footer = `<footer><span>© ${new Date().getFullYear()} P4Y4B13</span><div><a href="${url('feed.xml')}">RSS</a><a href="${cfg.twitter}">X / Twitter</a><a href="${cfg.portfolio}">Portfolio</a></div></footer>`;
const shell = (title,body,active='home',desc=cfg.description,route='') => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)} — P4Y4B13</title><meta name="description" content="${esc(desc)}"><meta name="color-scheme" content="light dark"><link rel="canonical" href="${origin}${url(route)}"><meta property="og:title" content="${esc(title)} — P4Y4B13"><meta property="og:description" content="${esc(desc)}"><meta property="og:type" content="${route.startsWith('posts/')?'article':'website'}"><meta property="og:url" content="${origin}${url(route)}"><meta name="twitter:card" content="summary"><link rel="icon" href="${url('assets/favicon.svg')}" type="image/svg+xml"><link rel="alternate" type="application/rss+xml" title="P4Y4B13 Research notes" href="${url('feed.xml')}"><script>try{document.documentElement.dataset.theme=localStorage.getItem('fieldnotes-theme')||'light'}catch{}</script><link rel="stylesheet" href="${url('assets/style.css')}"><script src="${url('assets/app.js')}" defer></script></head><body>${nav(active)}<main id="main">${body}</main>${footer}</body></html>`;
const shortDate = d => new Date(d+'T12:00:00Z').toLocaleDateString('en-GB',{day:'2-digit',month:'short',timeZone:'UTC'});
const row = p => `<article class="post-row" data-category="${esc(p.category)}" data-search="${esc([p.title,p.description,...(p.tags||[])].join(' ').toLowerCase())}"><div><div class="post-meta"><span class="category">${p.category}</span><span>${p.minutes} min read</span></div><h3><a href="${postUrl(p)}">${esc(p.title)}</a></h3><p>${esc(p.description)}</p></div><time datetime="${p.date}">${shortDate(p.date)}</time></article>`;
const years = [...new Set(posts.map(p=>p.date.slice(0,4)))];
const home = `<section class="intro"><span class="eyebrow">SMART CONTRACT SECURITY</span><h1>Research notes<span>.</span></h1><p>Articles, audit writeups, and lessons from on-chain hacks.<br>A notebook by <a href="${cfg.portfolio}">P4Y4B13</a>.</p></section><section class="archive" aria-label="Blog posts"><div class="archive-tools"><div class="filters" role="group" aria-label="Filter writing">${['All','Articles','Reports','Hacks'].map((c,i)=>`<button data-filter="${c}" aria-pressed="${i===0}">${c==='All'?'All posts':c}</button>`).join('')}</div><label class="search"><span class="sr-only">Search writing</span><input type="search" placeholder="Search posts…" aria-label="Search writing"></label></div><div class="results-info" aria-live="polite"></div><div class="post-list">${years.map(year=>`<section class="year-group"><h2 class="year">${year}</h2><div>${posts.filter(p=>p.date.startsWith(year)).map(row).join('')}</div></section>`).join('')}</div><div class="empty" hidden><h2>No posts yet.</h2><p>New notes will appear here when published.</p><button class="button" data-reset>Show all posts</button></div></section>`;
const portfolio = `<section class="intro"><h1>About P4Y4B13<span>.</span></h1><p>Independent smart contract security researcher. This blog is home to my articles, audit writeups, and hack analyses.</p><p><a href="${cfg.portfolio}">View my portfolio at p4y4b13.com</a></p><p><a href="${url('')}">Read the blog</a></p></section>`;
await fs.rm('dist',{recursive:true,force:true});
await fs.mkdir('dist/assets',{recursive:true});
await fs.cp('assets','dist/assets',{recursive:true});
async function write(route,html) { const file = path.join('dist',route,'index.html'); await fs.mkdir(path.dirname(file),{recursive:true}); await fs.writeFile(file,html); }
await write('',shell('Research notes',home));
await write('writing',shell('All posts',home,'home',cfg.description,'writing/'));
await write('portfolio',shell('Portfolio',portfolio,'portfolio',cfg.description,'portfolio/'));
for(const p of posts) {
 const body = `<div class="article-top"><a class="text-link" href="${url('')}">All posts</a><span>${p.kind||'FIELDNOTES'}</span></div><header class="article-header"><div class="post-meta"><span class="category">${p.category}</span><span>${date(p.date)}</span><span>${p.minutes} min read</span></div><h1>${esc(p.title)}</h1><p>${esc(p.description)}</p><div class="article-author">P4Y4B13 <span> / Independent security researcher</span></div></header><div class="reading-layout"><aside class="toc"><span class="eyebrow">ON THIS PAGE</span>${p.headings.map(h=>`<a href="#${h.id}">${h.label}</a>`).join('')}<a href="${url('feed.xml')}" class="rss-link">Follow via RSS</a></aside><article class="prose">${p.html}<div class="article-end"><span>END OF POST</span><a href="${url('')}">More posts</a></div></article></div>`;
 await write(`posts/${p.slug}`,shell(p.title,body,'home',p.description,`posts/${p.slug}/`));
}
await fs.writeFile('dist/404.html',shell('Page not found',`<section class="page-heading"><span class="eyebrow">404 / OUTSIDE THE MARGIN</span><h1>This page<br><em>is missing.</em></h1><p>The note may have moved, or this address may be incorrect.</p><a class="button" href="${url('')}">Return home</a></section>`));
await fs.writeFile('dist/.nojekyll','');
await fs.writeFile('dist/feed.xml',`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>P4Y4B13 Research notes</title><link>${xml(origin+url(''))}</link><description>${xml(cfg.description)}</description>${posts.map(p=>`<item><title>${xml(p.title)}</title><link>${xml(origin+postUrl(p))}</link><guid>${xml(origin+postUrl(p))}</guid><description>${xml(p.description)}</description><pubDate>${new Date(p.date+'T12:00:00Z').toUTCString()}</pubDate></item>`).join('')}</channel></rss>`);
await fs.writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['','writing/','portfolio/',...posts.map(p=>`posts/${p.slug}/`)].map(p=>`<url><loc>${xml(origin+url(p))}</loc></url>`).join('')}</urlset>`);
await fs.writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${origin}${url('sitemap.xml')}\n`);
console.log(`Built ${posts.length} posts + blog index, about, RSS and sitemap. Base path: ${base||'/'}`);
