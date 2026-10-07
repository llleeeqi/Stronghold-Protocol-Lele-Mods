import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.argv[2]);
const cards=JSON.parse(fs.readFileSync(new URL('./cards.json',import.meta.url),'utf8'));
// Avoid fs.cpSync's platform-specific recursion; only copy the profile's assets.
function copyDir(from,to){fs.mkdirSync(to,{recursive:true});for(const e of fs.readdirSync(from,{withFileTypes:true})){const a=path.join(from,e.name),b=path.join(to,e.name);if(e.isDirectory())copyDir(a,b);else if(e.isFile())fs.copyFileSync(a,b);}}
for(const base of ['vanilla','rhine','vanilla-extra','rhine-extra']){
 const from=path.join(root,'data',base==='rhine'?'':base),to=path.join(root,'data',base+'-custom');
 fs.mkdirSync(to,{recursive:true});
 for(const e of fs.readdirSync(from,{withFileTypes:true})){
  if(e.isFile()&&e.name.endsWith('.json'))fs.copyFileSync(path.join(from,e.name),path.join(to,e.name));
  else if(e.isDirectory()&&['i18n','backups'].includes(e.name))copyDir(path.join(from,e.name),path.join(to,e.name));
 }
 for(const [name,extra]of Object.entries(cards)){
  const file=path.join(to,name+'.json'),data=JSON.parse(fs.readFileSync(file));
  for(const [id,rec]of Object.entries(extra)){
   if(name==='chess'&&(data[id]||!rec.isGolden&&Object.values(data).some(c=>!c.isGolden&&!c.isDiy&&!c.isHidden&&c.charId===rec.charId)))throw new Error('Duplicate recruit '+id);
   if(name==='tokens'&&data[id]){data[id]={...data[id],variants:{...data[id].variants,...rec.variants}};continue;}
   data[id]=rec;
  }
  fs.writeFileSync(file,JSON.stringify(data));
 }
 const file=path.join(to,'bonds.json'),bonds=JSON.parse(fs.readFileSync(file));
 for(const c of Object.values(cards.chess))if(!c.isGolden)for(const id of c.bonds){
  if(!bonds[id])throw new Error('Missing bond '+id);
  const list=bonds[id].members;if(Array.isArray(list)&&!list.some(v=>(typeof v==='string'?v:v.chessId)===c.chessId))list.push(typeof list[0]==='string'?c.chessId:{chessId:c.chessId,charId:c.charId,name:c.name,tier:c.tier,inHand:false});
 }
 fs.writeFileSync(file,JSON.stringify(bonds));
}
console.log('Eight isolated rosters ready; four distinct extra recruits, existing Saki retained.');
