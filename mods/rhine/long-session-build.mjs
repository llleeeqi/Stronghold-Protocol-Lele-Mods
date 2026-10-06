import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const EXTRA_ROUNDS = 4;
const clone = value => structuredClone(value);
const requireValue = (ok, message) => { if (!ok) throw new Error(`Long-session mod: ${message}`); };

// Transform fresh upstream data only; never patch or overwrite upstream files.
export function extendData(raw) {
  requireValue(raw.config?.modes && raw.choices?.schedule && raw.factions?.generation, 'upstream schema changed');
  const out = { ...raw, config: clone(raw.config), choices: clone(raw.choices), factions: clone(raw.factions) };
  const changedModes = [];
  for (const [id, mode] of Object.entries(out.config.modes)) {
    if (!/^mode_(single|multi)_/.test(id)) continue;
    const boss = mode.bossRound;
    requireValue(Number.isInteger(boss) && boss >= 2 && boss <= 28, `unsupported boss round for ${id}`);
    requireValue(mode.lastRound === boss && mode.rounds?.[boss]?.isBoss, `invalid final boss for ${id}`);
    const FINAL_ROUND = boss + EXTRA_ROUNDS;
    const original = clone(mode);
    const lateStart = Math.max(1, boss - 7);
    const extraSp = mode.spRounds?.length ? Array.from({length: Math.floor((FINAL_ROUND - boss - 1) / 3)}, (_, i) => boss + 2 + i * 3) : [];
    const schedule = out.choices.schedule[id];
    requireValue(Array.isArray(mode.spRounds), `missing choice rounds for ${id}`);
    if (extraSp.length) {
      const latestSp = Math.max(...mode.spRounds);
      requireValue(schedule?.rounds?.[latestSp], `missing late choice event for ${id}`);
      for (const round of extraSp) schedule.rounds[round] = clone(schedule.rounds[latestSp]);
    }
    mode.spRounds = [...new Set([...mode.spRounds.filter(r => r < boss), ...extraSp])].sort((a,b) => a-b);
    if (schedule) schedule.spRounds = [...mode.spRounds];
    mode.rounds = {};
    mode.enemyScale = {};
    mode.combatTimeLimit = {};
    for (let round = 1; round <= FINAL_ROUND; round++) {
      const source = round === FINAL_ROUND ? boss : round < boss ? round : lateStart + (round - boss) % (boss - lateStart);
      const row = original.rounds[source];
      requireValue(row && (round === FINAL_ROUND ? row.bossTemplates : row.template && !row.isBoss && !row.isHidden), `invalid wave at ${id} R${source}`);
      mode.rounds[round] = { ...clone(row), isSpPrepare: mode.spRounds.includes(round), isBoss: round === FINAL_ROUND, isHidden: false };
      // Added rounds use existing late templates with the original final normal-round strength.
      const scaleRound = round === FINAL_ROUND ? boss : round >= boss ? boss - 1 : round;
      requireValue(original.enemyScale?.[scaleRound], `missing enemy scale for ${id} R${scaleRound}`);
      mode.enemyScale[round] = clone(original.enemyScale[scaleRound]);
      mode.combatTimeLimit[round] = mode.rounds[round].combatTimeLimit;
    }
    mode.lastRound = FINAL_ROUND;
    mode.bossRound = FINAL_ROUND;
    mode.hiddenRound = null;
    mode.hiddenBossWeights = {};
    mode.desc = `${original.desc || ''} · 乐勒砳特供：额外${EXTRA_ROUNDS}回合，共${FINAL_ROUND}回合，最终回合打 Boss，无额外隐藏关。`;
    changedModes.push(id);
  }
  requireValue(changedModes.length > 0, 'no supported modes');
  const finalRound = Math.max(...changedModes.map(id => out.config.modes[id].lastRound));
  const poolFactor = finalRound / raw.factions.generation.maxLevelCnt;
  out.factions.generation.maxLevelCnt = finalRound;
  // Keep early/late enemy pools at the original boundary; all added waves are late-game waves.
  for (const type of Object.values(out.factions.types)) if (type.involveRandom) type.count = Math.ceil(type.count * poolFactor);
  for (const key of Object.keys(out.factions.generation.typeSlots || {})) out.factions.generation.typeSlots[key] = Math.ceil(out.factions.generation.typeSlots[key] * poolFactor);
  const tiers = out.config.trophies?.byRoundsPassed;
  if (Array.isArray(tiers) && tiers.length) tiers[tiers.length - 1].maxRound = finalRound;
  return { data: out, manifest: { mod: 'long-session', version: 3, extraRounds: EXTRA_ROUNDS, optional: true, hiddenBoss: false, modes: changedModes } };
}

export function buildOverlay(sourceDir, outputDir) {
  const source = path.resolve(sourceDir), output = path.resolve(outputDir);
  requireValue(output !== source && !source.startsWith(output + path.sep) && !output.startsWith(source + path.sep), 'output must be separate from upstream');
  const raw = {};
  for (const name of ['config', 'choices', 'factions']) raw[name] = JSON.parse(fs.readFileSync(path.join(source, name+'.json'), 'utf8'));
  const result = extendData(raw); // Validate everything before creating the overlay.
  // Keep every original mode/data value intact; extended modes are additional records.
  const combined = clone(raw);
  for (const id of result.manifest.modes) {
    combined.config.modes[id + '_double'] = result.data.config.modes[id];
    if (result.data.choices.schedule[id]) combined.choices.schedule[id + '_double'] = result.data.choices.schedule[id];
  }
  const root = path.resolve(source, '..');
  const profileAware = fs.readFileSync(path.join(root, 'server/lobby.js'), 'utf8').includes('data: this.roomData(room),');
  const dataExpr = profileAware ? 'this.roomData(room)' : 'this.safeData()';
  const adapters = new Map();
  const adapt = (file, changes) => {
    let text = fs.readFileSync(path.join(root, file), 'utf8');
    for (const [anchor, replacement] of changes) {
      requireValue(text.split(anchor).length === 2, `${file}: upstream anchor changed: ${anchor}`);
      text = text.replace(anchor, replacement);
    }
    adapters.set(file, text);
  };
  adapt('shared/protocol.js', [
    ["'room.setDifficulty': { difficulty: (v) => DIFFICULTIES.includes(v) },", "'room.setDifficulty': { difficulty: (v) => DIFFICULTIES.includes(v) },\n  'room.setRounds': { enabled: isBool },"], [
    profileAware ? "'room.create': { mode: (v) => v === 'solo' || v === 'coop', difficulty: (v) => DIFFICULTIES.includes(v), rhineEnabled: isBool, $optional: ['rhineEnabled'] }," : "'room.create': { mode: (v) => v === 'solo' || v === 'coop', difficulty: (v) => DIFFICULTIES.includes(v) },",
    profileAware ? "'room.create': { mode: (v) => v === 'solo' || v === 'coop', difficulty: (v) => DIFFICULTIES.includes(v), rhineEnabled: isBool, doubleRounds: isBool, $optional: ['rhineEnabled', 'doubleRounds'] }," : "'room.create': { mode: (v) => v === 'solo' || v === 'coop', difficulty: (v) => DIFFICULTIES.includes(v), doubleRounds: isBool, $optional: ['doubleRounds'] },"
  ]]);
  adapt('server/lobby.js', [
    ["case 'room.setDifficulty': return this.setDifficulty(session, msg);", "case 'room.setDifficulty': return this.setDifficulty(session, msg);\n      case 'room.setRounds': return this.setRounds(session, msg);"],
    ['setDifficulty(session, { difficulty }) {', `setRounds(session, { enabled }) {
    const room = this.roomOf(session);
    if (!room) return fail(ERR.NOT_IN_ROOM);
    if (room.hostId !== session.playerId) return fail(ERR.NOT_HOST);
    if (room.match) return fail(ERR.ROOM_STARTED);
    if (typeof enabled !== 'boolean') return fail(ERR.BAD_MSG);
    if ((room.doubleRounds === true) === enabled) return OK;
    room.doubleRounds = enabled;
    room.replay = null;
    for (const seat of room.seats) if (seat && !seat.isBot) seat.ready = false;
    this.broadcastState(room);
    return OK;
  }

  setDifficulty(session, { difficulty }) {`],
    [profileAware ? 'create(session, { mode, difficulty, rhineEnabled = false }) {' : 'create(session, { mode, difficulty }) {', profileAware ? 'create(session, { mode, difficulty, rhineEnabled = false, doubleRounds = false }) {' : 'create(session, { mode, difficulty, doubleRounds = false }) {'],
    ['room.ownerKey = key;', 'room.doubleRounds = doubleRounds === true;\n    room.ownerKey = key;'],
    ['difficulty: this.difficulty,', 'difficulty: this.difficulty,\n      doubleRounds: this.doubleRounds === true,'],
    ['modeId: modeIdFor(room.mode, room.difficulty),', "modeId: modeIdFor(room.mode, room.difficulty) + (room.doubleRounds ? '_double' : ''),"],
    [`data: ${dataExpr},`, `data: room.doubleRounds ? { ...${dataExpr}, factions: ${dataExpr}.factionsDouble, config: { ...${dataExpr}.config, trophies: ${dataExpr}.trophiesDouble } } : ${dataExpr},`]
  ]);
  adapt('public/js/screens/lobby.js', [
    [profileAware ? 'export function difficultyInfo(roomMode, difficulty, playerCount = null) {' : 'export function difficultyInfo(roomMode, difficulty) {', profileAware ? 'export function difficultyInfo(roomMode, difficulty, playerCount = null, doubleRounds = false) {' : 'export function difficultyInfo(roomMode, difficulty, doubleRounds = false) {'],
    ['getMode(modeIdFor(roomMode, difficulty))', "getMode(modeIdFor(roomMode, difficulty) + (doubleRounds ? '_double' : ''))"],
    ["hidden: difficulty !== 'FUNNY',", "hidden: m ? Number.isInteger(m.hiddenRound) && m.hiddenRound > 0 : difficulty !== 'FUNNY',"],
    ['function DifficultyCard({ roomMode, difficulty, selected, onSelect }) {', 'function DifficultyCard({ roomMode, difficulty, selected, onSelect, doubleRounds }) {'],
    ['const info = difficultyInfo(roomMode, difficulty);', profileAware ? 'const info = difficultyInfo(roomMode, difficulty, null, doubleRounds);' : 'const info = difficultyInfo(roomMode, difficulty, doubleRounds);'],
    ["const [code, setCode] = useState('');", (profileAware ? "const [rhineEnabled, setRhineEnabled] = useState(false);\n  " : "") + "const [doubleRounds, setDoubleRounds] = useState(false);\n  const [extensionsOpen, setExtensionsOpen] = useState(false);\n  const [code, setCode] = useState('');"],
    ["net.request('room.create', { mode: roomMode, difficulty })", profileAware ? "net.request('room.create', { mode: roomMode, difficulty, doubleRounds, rhineEnabled })" : "net.request('room.create', { mode: roomMode, difficulty, doubleRounds })"],
    ['<${GuideButton} class="lobby-guide" variant="secondary" />', '<${Button} variant="secondary" size="sm" class="friend-extensions" onClick=${() => setExtensionsOpen(!extensionsOpen)} aria-expanded=${extensionsOpen}>拓展选项${doubleRounds ? " · +4回合" : ""}<//>\n        <${GuideButton} class="lobby-guide" variant="secondary" />'],
    ['<div class="lobby-body screen__scroll">', `<div class="lobby-body screen__scroll">
      \${extensionsOpen ? html\`<section class="panel brackets friend-extensions-panel" style="grid-column:1/-1;padding:16px" aria-label="拓展选项">
        <div class="section-label">乐勒砳特供 · 拓展选项</div>
        <label style="display:flex;align-items:center;gap:12px;cursor:pointer"><input class="friend-double-rounds" type="checkbox" checked=\${doubleRounds} onChange=\${e => setDoubleRounds(e.target.checked)} />额外 4 回合</label>
        ${profileAware ? '<label style="display:flex;align-items:center;gap:12px;cursor:pointer;margin-top:12px"><input class="friend-rhine-enabled" type="checkbox" checked=${rhineEnabled} onChange=${e => setRhineEnabled(e.target.checked)} />莱茵生命</label><p class="t-lo">加入莱茵生命羁绊、干员与科研装置。可与额外 4 回合组合，等待室中房主仍可调整。</p>' : ''}
        <p class="t-lo">默认使用原版规则。开启后增加 4 回合，Boss 在最后一回合，无额外隐藏关。房主可在等待室切换，全员同步，开局后锁定。</p>
      </section>\` : null}`],
    ['difficulty=${d} selected=${difficulty === d}', 'difficulty=${d} doubleRounds=${doubleRounds} selected=${difficulty === d}']
  ]);
  adapt('public/js/screens/room.js', [
    ...(profileAware ? [
      ['export function RhineToggle', `export function ExtraRoundsToggle({ room, isHost, busy = false, online = true, onPick }) {
  const enabled = room?.doubleRounds === true;
  const disabled = !isHost || !!busy || !online || !!room?.inMatch || (!!room?.phase && room.phase !== PHASE.LOBBY);
  return html\`<div class="rhine-setting" data-testid="extra-rounds-toggle">
    <span class="rhine-setting__label">额外 4 回合</span>
    <div class="rhine-setting__choices" role="group" aria-label="额外 4 回合">
      \${[[true, '开启'], [false, '原版']].map(([value, label]) => html\`<button key=\${label} type="button"
        class=\${\`rhine-setting__option\${enabled === value ? ' is-active' : ''}\`} disabled=\${disabled}
        data-testid=\${value ? 'extra-rounds-enabled' : 'extra-rounds-vanilla'} aria-pressed=\${enabled === value ? 'true' : 'false'}
        onClick=\${() => !disabled && enabled !== value && onPick(value)}>\${label}</button>\`)}
    </div>
    <span class="rhine-setting__desc">\${enabled ? '增加 4 回合 · 最后一关 Boss · 无额外隐藏关' : '原版回合与隐藏关规则'}\${isHost ? '' : ' · 由房主选择'}</span>
  </div>\`;
}

export function RhineToggle`],
      ["const setRhine = (enabled)", "const setRounds = (enabled) => run('rounds', () => net.request('room.setRounds', { enabled }));\n  const setRhine = (enabled)"],
      ['<${RhineToggle} room=${room}', '<${ExtraRoundsToggle} room=${room} isHost=${facts.isHost} busy=${busy} online=${online} onPick=${setRounds} />\n      <${RhineToggle} room=${room}']
    ] : []),
    ['<${DifficultyTag} difficulty=${room.difficulty} size="lg" /></h1>', '<${DifficultyTag} difficulty=${room.difficulty} size="lg" /></h1><span class="t-mint">${room.doubleRounds ? "乐勒砳特供 · +4回合" : "原版规则"}</span>'],
    [profileAware ? 'const info = difficultyInfo(room.mode, room.difficulty, facts.occupied.length);' : 'const info = difficultyInfo(room.mode, room.difficulty);', profileAware ? 'const info = difficultyInfo(room.mode, room.difficulty, facts.occupied.length, room.doubleRounds);' : 'const info = difficultyInfo(room.mode, room.difficulty, room.doubleRounds);'],
    ['<li>共 <b class="num">${info.rounds}</b>', '<li>${room.doubleRounds ? "+4回合 · " : "原版规则 · "}共 <b class="num">${info.rounds}</b>']
  ]);
  fs.mkdirSync(output, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    if (entry.isFile()) fs.copyFileSync(path.join(source, entry.name), path.join(output, entry.name));
  }
  for (const name of ['config', 'choices', 'factions']) fs.writeFileSync(path.join(output, name+'.json'), JSON.stringify(combined[name]));
  fs.writeFileSync(path.join(output, 'factionsDouble.json'), JSON.stringify(result.data.factions));
  fs.writeFileSync(path.join(output, 'trophiesDouble.json'), JSON.stringify(result.data.config.trophies));
  fs.writeFileSync(path.join(output, 'friend-mod.json'), JSON.stringify(result.manifest, null, 2));
  const vanillaSource = path.join(source, 'vanilla');
  if (fs.existsSync(vanillaSource)) {
    const vanillaOutput = path.join(output, 'vanilla');
    fs.mkdirSync(vanillaOutput, {recursive:true});
    for (const entry of fs.readdirSync(vanillaSource, {withFileTypes:true})) if (entry.isFile()) fs.copyFileSync(path.join(vanillaSource, entry.name), path.join(vanillaOutput, entry.name));
    const vanilla = {};
    for (const name of ['config', 'choices', 'factions']) vanilla[name] = JSON.parse(fs.readFileSync(path.join(vanillaSource, name+'.json'), 'utf8'));
    const extended = extendData(vanilla);
    for (const id of extended.manifest.modes) {
      vanilla.config.modes[id+'_double'] = extended.data.config.modes[id];
      if (extended.data.choices.schedule[id]) vanilla.choices.schedule[id+'_double'] = extended.data.choices.schedule[id];
    }
    for (const name of ['config', 'choices', 'factions']) fs.writeFileSync(path.join(vanillaOutput, name+'.json'), JSON.stringify(vanilla[name]));
    fs.writeFileSync(path.join(vanillaOutput, 'factionsDouble.json'), JSON.stringify(extended.data.factions));
    fs.writeFileSync(path.join(vanillaOutput, 'trophiesDouble.json'), JSON.stringify(extended.data.config.trophies));
  }
  const clientDir = path.join(output, '../client');
  fs.mkdirSync(clientDir, { recursive: true });
  for (const [file, text] of adapters) {
    const dest = path.join(output, '../overlay', file);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, text);
  }
  return result.manifest;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.length !== 4) throw new Error('Usage: node build.mjs UPSTREAM_DATA_DIR OUTPUT_DATA_DIR');
  console.log(JSON.stringify(buildOverlay(process.argv[2], process.argv[3])));
}
