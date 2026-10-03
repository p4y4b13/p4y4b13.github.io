const theme = document.querySelector('.theme-toggle');
function updateThemeLabel() { theme?.setAttribute('aria-label', `Switch to ${document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'} theme`); }
updateThemeLabel();
theme?.addEventListener('click', () => { const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = next; try { localStorage.setItem('fieldnotes-theme', next); } catch {} updateThemeLabel(); });
document.querySelectorAll('.prose pre').forEach(pre=>{ const button = document.createElement('button'); button.textContent='Copy'; button.className='copy-code'; button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(pre.querySelector('code').textContent);button.textContent='Copied';}catch{button.textContent='Select to copy';}setTimeout(()=>button.textContent='Copy',2000);});pre.append(button);});
