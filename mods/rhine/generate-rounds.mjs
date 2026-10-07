// Data-only +4 adapter. UI and protocol code live in the versioned Mod patch.
import fs from 'node:fs';
import path from 'node:path';
import { extendData } from './long-session-build.mjs';
const root = path.resolve(process.argv[2]);
for (const profile of ['', 'vanilla']) {
  const dir = path.join(root, 'data', profile);
  const raw = Object.fromEntries(['config', 'choices', 'factions'].map(name => [name, JSON.parse(fs.readFileSync(path.join(dir, name + '.json'), 'utf8'))]));
  const result = extendData(raw);
  for (const id of result.manifest.modes) {
    raw.config.modes[id + '_double'] = result.data.config.modes[id];
    if (result.data.choices.schedule[id]) raw.choices.schedule[id + '_double'] = result.data.choices.schedule[id];
  }
  for (const name of ['config', 'choices', 'factions']) fs.writeFileSync(path.join(dir, name + '.json'), JSON.stringify(raw[name]));
  fs.writeFileSync(path.join(dir, 'factionsDouble.json'), JSON.stringify(result.data.factions));
  fs.writeFileSync(path.join(dir, 'trophiesDouble.json'), JSON.stringify(result.data.config.trophies));
  if (!profile) fs.writeFileSync(path.join(dir, 'friend-mod.json'), JSON.stringify(result.manifest, null, 2));
}
console.log('Optional +4 rounds generated; upstream UI kept.');
