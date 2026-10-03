import fs from 'node:fs/promises';
import path from 'node:path';
const base=(process.env.BASE_PATH||'').replace(/\/$/,'');
const files=await fs.readdir('dist',{recursive:true});
let checked=0;
for(const file of files.filter(f=>f.endsWith('.html'))){
 const html=await fs.readFile(path.join('dist',file),'utf8');
 if(!html.includes('<title>')||!html.includes('name="description"'))throw Error(`Missing metadata in ${file}`);
 for(const [,ref] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  if(/^(https?:|mailto:|#|data:)/.test(ref))continue;
  const clean=ref.split(/[?#]/)[0];
  const target=clean.startsWith('/')?path.join('dist',clean.slice(base.length)):path.resolve('dist',path.dirname(file),clean);
  const stat=await fs.stat(target).catch(()=>null);
  if(!stat)throw Error(`Broken reference ${ref} in ${file}`);
  if(stat.isDirectory())await fs.access(path.join(target,'index.html'));
  checked++;
 }
}
console.log(`Validated metadata and ${checked} internal references across ${files.filter(f=>f.endsWith('.html')).length} pages.`);
