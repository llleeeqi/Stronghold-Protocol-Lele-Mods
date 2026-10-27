// Preserve native 0.3.3 content as the default; legacy profiles are generation inputs only.
import fs from 'node:fs';
import path from 'node:path';
const source=path.resolve(process.argv[2]),baseline=path.resolve(process.argv[3]);
const data=path.join(source,'data');
for(const entry of fs.readdirSync(data,{withFileTypes:true}))if(entry.isFile()&&entry.name.endsWith('.json')&&!['assets.json','local-assets.json','local-fx.json'].includes(entry.name))fs.unlinkSync(path.join(data,entry.name));
for(const entry of fs.readdirSync(path.join(baseline,'data'),{withFileTypes:true}))if(entry.isFile()&&entry.name.endsWith('.json')&&entry.name!=='assets.json')fs.copyFileSync(path.join(baseline,'data',entry.name),path.join(data,entry.name));
const file=path.join(data,'config.json'),config=JSON.parse(fs.readFileSync(file));
config.economy.leleHost={api:1,enabled:{},packages:Object.fromEntries(['rounds','factions','operators','recruits','relics','damage','lucky','targeted'].map(k=>[k,{}]))};
fs.writeFileSync(file,JSON.stringify(config)+'\n');
console.log('Native base restored; Lele host API 1 available; all plugins off by default.');
