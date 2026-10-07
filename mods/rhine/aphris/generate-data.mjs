// Selected character data from SrC2O4/Stronghold-Protocol @ c76a81fb5cd8ca5bb360ff10f834cc9a166b0c88.
// Add only to the Rhine base before generating either optional operator profile.
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.argv[2]),cards=JSON.parse(fs.readFileSync(new URL('./cards.json',import.meta.url),'utf8'));
for(const name of ['chess','tokens']){
 const file=path.join(root,'data',name+'.json'),data=JSON.parse(fs.readFileSync(file));
 for(const [id,c]of Object.entries(cards[name])){
  if(name==='tokens'&&data[id])data[id]={...data[id],owners:[...new Set([...(data[id].owners||[]),...c.owners])],variants:{...data[id].variants,...c.variants}};
  else data[id]=c;
 }
 fs.writeFileSync(file,JSON.stringify(data));
}
const file=path.join(root,'data/bonds.json'),bonds=JSON.parse(fs.readFileSync(file)),bond=bonds.rhineShip;
if(!bond)throw new Error('Rhine must be generated before Aphris');
for(const c of Object.values(cards.chess).filter(c=>!c.isGolden)){
 if(Array.isArray(bond.members)&&!bond.members.some(v=>(typeof v==='string'?v:v.chessId)===c.chessId))bond.members.push(typeof bond.members[0]==='string'?c.chessId:{chessId:c.chessId,charId:c.charId,name:c.name,tier:c.tier,inHand:false});
 if(Array.isArray(bond.chessIds)&&!bond.chessIds.includes(c.chessId))bond.chessIds.push(c.chessId);
 if(Array.isArray(bond.visibleMembers)&&!bond.visibleMembers.includes(c.chessId))bond.visibleMembers.push(c.chessId);
}
fs.writeFileSync(file,JSON.stringify(bonds));
console.log('Rhine Aphris S2 added; vanilla roster preserved.');
