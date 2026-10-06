// Apply new research data after legacy generation; never reset vanilla or +4 modes.
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const source=path.resolve(process.argv[2]);
const {applyRhineData,validateRhineData}=await import(pathToFileURL(path.join(source,'tools/rhine-data.mjs')));
const names=['chess','bonds','garrisons','tokens','effects','config','items'];
const files=Object.fromEntries(names.map(n=>[n,JSON.parse(fs.readFileSync(path.join(source,'data',n+'.json'),'utf8'))]));
await applyRhineData(files);
const errors=validateRhineData(files);if(errors.length)throw new Error(JSON.stringify(errors));
for(const n of names)fs.writeFileSync(path.join(source,'data',n+'.json'),JSON.stringify(files[n]));
const {addRhineArt}=await import(pathToFileURL(path.join(source,'tools/assets/rhine-plan.mjs')));
const {contentHash}=await import(pathToFileURL(path.join(source,'tools/assets/manifest.mjs')));
const assetFile=path.join(source,'data/assets.json');
const manifest=JSON.parse(fs.readFileSync(assetFile,'utf8'));addRhineArt(manifest);
const {hash,...body}=manifest;manifest.hash=contentHash(body);
fs.writeFileSync(assetFile,JSON.stringify(manifest)+'\n');
console.log('Rhine research updated; vanilla and optional round modes preserved.');
