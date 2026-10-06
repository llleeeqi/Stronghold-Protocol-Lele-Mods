import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=path.resolve(process.argv[2]);
const {buildChess}=await import(pathToFileURL(path.join(root,'tools/build-data.mjs')));
const {buildMakoto}=await import(pathToFileURL(path.join(root,'tools/custom/makoto.mjs')));
const {buildNarant}=await import(pathToFileURL(path.join(root,'tools/custom/narant.mjs')));
const {buildExtraOperators}=await import(pathToFileURL(path.join(root,'tools/custom/operators.mjs')));
const makoto=buildMakoto(buildChess),narant=buildNarant(buildChess);
const chess={...makoto.chess,...narant.chess,...buildExtraOperators(buildChess)};
const garrisons={...makoto.garrisons,...narant.garrisons};
for(const [src,dst] of [['vanilla','vanilla-extra'],['','rhine-extra']]) {
 const from=path.join(root,'data',src),to=path.join(root,'data',dst);fs.mkdirSync(to,{recursive:true});
 for(const e of fs.readdirSync(from,{withFileTypes:true})) if(e.isFile()&&e.name.endsWith('.json'))fs.copyFileSync(path.join(from,e.name),path.join(to,e.name));
 for(const [name,extra] of Object.entries({chess,garrisons})) {
  const file=path.join(to,name+'.json'),raw=JSON.parse(fs.readFileSync(file));
  for(const id of Object.keys(extra))if(raw[id])throw new Error('Duplicate custom ID '+id);
  fs.writeFileSync(file,JSON.stringify({...raw,...extra}));
 }
 const bondsFile=path.join(to,'bonds.json'),bonds=JSON.parse(fs.readFileSync(bondsFile));
 for(const c of Object.values(chess))if(!c.isGolden)for(const id of c.bonds){
  if(!bonds[id])throw new Error('Missing bond '+id);
  const list=bonds[id].members;if(Array.isArray(list)&&!list.some(x=>x===c.chessId||x.chessId===c.chessId))list.push(typeof list[0]==='string'?c.chessId:{chessId:c.chessId,charId:c.charId,name:c.name,tier:c.tier,inHand:false});
 }
 fs.writeFileSync(bondsFile,JSON.stringify(bonds));
}
console.log('Four isolated rosters ready; custom cards:',Object.values(chess).filter(c=>!c.isGolden).map(c=>c.name));
