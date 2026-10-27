// Local installer: never overwrites game source, server configuration, or another author's plugins.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const kit=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const runtime=path.resolve(process.argv[2]||'');
if(!process.argv[2]||runtime===kit)throw new Error('Usage: node scripts/install-plugins.mjs /path/to/adapted-game [lele-id ...]');
const config=JSON.parse(fs.readFileSync(path.join(runtime,'data/config.json'),'utf8'));
if(config.economy?.leleHost?.api!==1)throw new Error('This host needs the Lele 0.3.3 compatibility layer first. See docs/PLUGINS.md.');
const names=process.argv.slice(3).length?process.argv.slice(3):fs.readdirSync(path.join(kit,'plugins')).filter(id=>id.startsWith('lele-'));
for(const id of names){
 if(!/^lele-[a-z]+$/.test(id)||!fs.existsSync(path.join(kit,'plugins',id,'plugin.json')))throw new Error('Unknown plugin: '+id);
 const destination=path.join(runtime,'plugins',id);
 console.log('Installing',id,'into',runtime);
 if(fs.existsSync(destination)&&fs.lstatSync(destination).isSymbolicLink())throw new Error('Plugin destination must not be a link');
 function copy(from,to){fs.mkdirSync(to,{recursive:true});for(const e of fs.readdirSync(from,{withFileTypes:true})){const a=path.join(from,e.name),b=path.join(to,e.name);if(e.isSymbolicLink())throw new Error('Plugin sources must not contain links');if(e.isDirectory())copy(a,b);else if(e.isFile())fs.copyFileSync(a,b);}}
 copy(path.join(kit,'plugins',id),destination);
 for(const args of [['check',id,'--strict'],['pack',id,'--zip']]){
  const p=spawnSync(process.execPath,['tools/plugin.mjs',...args],{cwd:runtime,encoding:'utf8',maxBuffer:4*1024*1024});
  if(p.stdout)process.stdout.write(p.stdout);if(p.stderr)process.stderr.write(p.stderr);
  if(p.error)throw p.error;
  if(p.status!==0)throw new Error(`plugin ${args[0]} failed (${p.status}, ${p.signal}): ${id}`);
 }
}
console.log('Installed and packed',names.length,'plugins. All remain off until selected by the room host.');
