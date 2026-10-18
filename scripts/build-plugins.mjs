// Generate the eight independently selectable 0.3.0 plugins from pinned feature data.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const kit=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=path.resolve(process.argv[2]);
const out=path.resolve(process.argv[3]||path.join(kit,'plugins'));
const read=(dir,n)=>JSON.parse(fs.readFileSync(path.join(dir,n+'.json'),'utf8'));
const baseDir=path.join(source,'data/vanilla');
const tables=['chess','bonds','garrisons','tokens','effects','config','items','backups'];
const base=Object.fromEntries(tables.map(n=>[n,read(baseDir,n)]));
// The legacy generator keeps extended mode aliases for older hosts. Native rooms retain original mode ids.
for(const id of Object.keys(base.config.modes))if(id.endsWith('_double'))delete base.config.modes[id];
const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
function diff(a,b,at=[],changes=[]){
 if(JSON.stringify(a)===JSON.stringify(b))return changes;
 if(object(a)&&object(b)){
  for(const [k,v]of Object.entries(b))diff(a[k],v,[...at,k],changes);
  for(const k of Object.keys(a))if(!Object.hasOwn(b,k))changes.push({path:[...at,k],remove:true});
 }else if(Array.isArray(a)&&Array.isArray(b)&&a.every(v=>b.some(w=>JSON.stringify(w)===JSON.stringify(v)))){
  const value=b.filter(v=>!a.some(w=>JSON.stringify(w)===JSON.stringify(v)));
  if(value.length)changes.push({path:at,append:value});
 }else changes.push({path:at,value:b});
 return changes;
}
const specs=[
 ['rounds','额外 4 回合','常规14→18，短单人9→13；常规Boss仍在最终回合；隐藏Boss保留原版触发条件，常规模式满足后进入第19回合。',['llleeeqi']],
 ['factions','更多阵营','莱茵生命科研与装置、卡兹戴尔魂灵与21格炮击、转职装备；含谬因二技能。',['YUYUYUYUYUYUYUTOUA','SrC2O4']],
 ['relics','收藏品玩法','46件收藏品、战后三选一、一次复活与敌人转移等；不包含鸭梨手机。',['UNDFFIO']],
 ['operators','新干员包','结城理、娜仁图亚、予愿安洁莉娜、丰川祥子；包含原有技能和模组。',['remember-4']],
 ['damage','伤害统计','实际扣血排行，召唤物归属干员，仅保留本轮与上一轮。',['Stardust-minus']],
 ['lucky','恭喜发财','每个席位随机不同五阶开局，仍使用共享卡池。',['RiZhiZhaoYi']],
 ['recruits','额外干员包','望、赤刃明霄陈、凯尔希·思衡托、维什戴尔；与更多阵营共用时采用卡兹戴尔维什戴尔。',['Lunac1a']],
 ['targeted','定向甄选','晋升奖励第一位向主要盟约加权2.6倍，后两位随机；第6回合起转职装备同样加权。',['Strinova-xinghui']],
];
const flagNames={rounds:'doubleRounds',factions:'rhineEnabled',relics:'relicsEnabled',operators:'operatorsEnabled',damage:'damageEnabled',lucky:'luckyEnabled',recruits:'recruitsEnabled',targeted:'targetedEnabled'};
const lock=JSON.parse(fs.readFileSync(path.join(kit,'upstream.lock.json')));
const sourceKeys={factions:['rhine','rhine_aphris'],relics:['relics'],operators:['operators'],damage:['damage'],lucky:['lucky'],recruits:['recruits'],targeted:['targeted']};
for(const [key,name,description,authors]of specs){
 const id='lele-'+key,folder=path.join(out,id);fs.mkdirSync(path.join(folder,'data'),{recursive:true});
 let changes=[];
 if(['factions','operators','recruits'].includes(key)){
  const dir=path.join(source,'data',key==='factions'?'':key==='operators'?'vanilla-extra':'vanilla-custom');
  const target=Object.fromEntries(tables.map(n=>[n,read(dir,n)]));
  // This descriptive constant is already owned by RHINE_BALANCE; it is not a ratio blackboard.
  if(key==='factions')delete target.bonds.rhineShip.bb.base_atk;
  if(key==='operators')for(const c of Object.values(target.chess))if(c.charId==='char_4182_oblvns')for(const s of [...(c.skills||[]),c.skill].filter(Boolean))if(s.bb?.['attack@attack_speed']!==undefined){s.bb.attack_speed=s.bb['attack@attack_speed'];delete s.bb['attack@attack_speed'];}
  // Imported fixed custom recruits do not have official stand-in forms. They always deploy themselves.
  if(['operators','recruits'].includes(key))for(const [id,c]of Object.entries(target.chess))if(!base.chess[id]&&!c.backup?.charId){c.chessType='PRESET';c.backup={charId:c.charId,skillIndex:c.skill?.index||0,uniEquipId:c.modules?.find(m=>m.isDefault)?.uniEquipId||null};}
  if(key==='factions')for(const c of Object.values(target.chess))if(c.charId==='char_4229_aphris')c.backup={charId:c.charId,skillIndex:c.skill?.index||0,uniEquipId:null};
  // A summon is resolved from one table, not both the general backup table and tokens.json.
  for(const [id,t]of Object.entries(target.tokens))if(target.backups.tokens[id]){t.variants={...target.backups.tokens[id].variants,...t.variants};delete target.backups.tokens[id];}
  for(const mode of Object.keys(target.config.modes))if(mode.endsWith('_double'))delete target.config.modes[mode];
  changes=diff(base,target);
 }else if(key==='rounds'){
  const {extendData}=await import(pathToFileURL(path.join(kit,'mods/rhine/long-session-build.mjs')));
  const original={config:base.config,choices:read(baseDir,'choices'),factions:read(baseDir,'factions')};
  changes=diff(original,extendData(structuredClone(original)).data);
 }
 const payload={api:1,feature:key,flag:flagNames[key],changes};
 const manifest={$schema:'../../schemas/plugin.schema.json',manifest:2,id,name,version:'0.3.3',app:'>=0.3.0 <0.4.0',api:1,class:'content',scope:['room'],authors,credits:authors.length===1&&authors[0]==='llleeeqi'?[]:['整合适配：llleeeqi'],license:'GPL-3.0-or-later',homepage:'https://github.com/llleeeqi/Stronghold-Protocol-Lele-Mods',description:'整合适配：llleeeqi。'+description+' 需要本仓库0.3.1宿主适配；原版宿主会拒绝加载，不会以残缺玩法开局。',permissions:['data.patch'],data:['data/feature.json']};
 const patch={patch:1,ops:[{op:'merge',file:'config',path:['economy','leleHost','packages',key],value:payload}]};
 const sources=(sourceKeys[key]||[]).map(k=>`- ${lock.mods[k]}`).join('\n')||'- https://github.com/llleeeqi/Stronghold-Protocol-Lele-Mods';
 for(const [rel,v]of Object.entries({'plugin.json':manifest,'data/feature.json':patch}))fs.writeFileSync(path.join(folder,rel),JSON.stringify(v,null,2)+'\n');
 fs.writeFileSync(path.join(folder,'README.md'),`# ${name}\n\n${description}\n\n独立选择，默认关闭。放入本仓库构建的0.3.1宿主 plugins/${id}/，由房主在官方插件面板选择。\n\n需要 Lele 宿主适配 API 1，尚非纯原版即装即用插件。没有该适配时，官方检查器会以 PLUGIN_PATCH_PATH 拒绝启用。共享引擎在宿主适配层，功能数据随本插件锁定；不要把插件文件覆盖到游戏源码。\n\n## 来源与署名\n\n${sources}\n\n感谢 ${authors.map(a=>'@'+a).join('、')}，本仓库负责兼容整合。完整引用提交与移植边界见仓库 notices/SOURCES.md。\n`);
 console.log(`${id}: ${changes.length} feature data edits`);
}
console.log('Eight feature plugin folders generated:',out);
