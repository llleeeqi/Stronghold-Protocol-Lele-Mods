import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const [source, baseline] = process.argv.slice(2).map(p=>path.resolve(p));
if (!source || !baseline || source === baseline) throw new Error('Usage: generate-data.mjs STAGED_SOURCE CLEAN_UPSTREAM');
const {applyRhineData,validateRhineData}=await import(pathToFileURL(path.join(source,'tools/rhine-data.mjs')));
const {applyKazdelData,validateKazdelData}=await import(pathToFileURL(path.join(source,'tools/kazdel-data.mjs')));
const names=['chess','bonds','garrisons','tokens','effects','config','items','backups'];
const files=Object.fromEntries(names.map(n=>[n,JSON.parse(fs.readFileSync(path.join(source,'data',n+'.json'),'utf8'))]));
await applyRhineData(files);
await applyKazdelData(files);
const errors=[...validateRhineData(files),...validateKazdelData(files)];
if(errors.length)throw new Error(JSON.stringify(errors));
for(const n of names)fs.writeFileSync(path.join(source,'data',n+'.json'),JSON.stringify(files[n]));
const vanilla=path.join(source,'data/vanilla');fs.mkdirSync(vanilla,{recursive:true});
function copyDir(from,to){fs.mkdirSync(to,{recursive:true});for(const e of fs.readdirSync(from,{withFileTypes:true})){const a=path.join(from,e.name),b=path.join(to,e.name);if(e.isDirectory())copyDir(a,b);else if(e.isFile())fs.copyFileSync(a,b);}}
copyDir(path.join(baseline,'data'), vanilla);
console.log('Rhine generated from pinned upstream; complete vanilla snapshot copied.');
