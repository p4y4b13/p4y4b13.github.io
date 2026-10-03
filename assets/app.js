const theme = document.querySelector('.theme-toggle');
function updateThemeLabel() { theme?.setAttribute('aria-label', `Switch to ${document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'} theme`); }
updateThemeLabel();
theme?.addEventListener('click', () => { const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = next; try { localStorage.setItem('fieldnotes-theme', next); } catch {} updateThemeLabel(); });
const filters = [...document.querySelectorAll('[data-filter]')];
const search = document.querySelector('input[type="search"]');
if (filters.length) {
 const params = new URLSearchParams(location.search);
 let category = filters.some(b=>b.dataset.filter===params.get('category')) ? params.get('category') : 'All';
 search.value = params.get('q') || '';
 function filter() {
  let total = 0;
  const q = search.value.trim().toLowerCase();
  document.querySelectorAll('.post-row').forEach(row => { row.hidden = !((category === 'All' || row.dataset.category === category) && row.dataset.search.includes(q)); if (!row.hidden) total++; });
  document.querySelectorAll('.year-group').forEach(group => { group.hidden = ![...group.querySelectorAll('.post-row')].some(row => !row.hidden); });
  filters.forEach(button => button.setAttribute('aria-pressed', button.dataset.filter === category));
  document.querySelector('.empty').hidden = total !== 0;
  document.querySelector('.results-info').textContent = `${total} ${total===1?'entry':'entries'}${category === 'All'?'':` in ${category.toLowerCase()}`}`;
  const p = new URLSearchParams(); if(category!=='All') p.set('category',category); if(q) p.set('q',search.value);
  history.replaceState(null,'',`${location.pathname}${p.size?'?'+p:''}`);
 }
 filters.forEach(button => button.addEventListener('click',()=>{ category=button.dataset.filter; filter(); }));
 search.addEventListener('input',filter);
 document.querySelector('[data-reset]').addEventListener('click',()=>{category='All';search.value='';filter();search.focus();});
 filter();
}
document.querySelectorAll('.prose pre').forEach(pre=>{ const button = document.createElement('button'); button.textContent='Copy'; button.className='copy-code'; button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(pre.querySelector('code').textContent);button.textContent='Copied';}catch{button.textContent='Select to copy';}setTimeout(()=>button.textContent='Copy',2000);});pre.append(button);});
