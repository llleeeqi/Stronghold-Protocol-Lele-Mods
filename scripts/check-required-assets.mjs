// Optional unavailable audio may be omitted; required art must be complete.
import fs from 'node:fs';
import path from 'node:path';
const report = JSON.parse(fs.readFileSync(path.join(process.argv[2], '.cache/assets-report.json'), 'utf8'));
if (!Array.isArray(report.requiredMisses) || report.requiredMisses.length) throw new Error('Required game assets missing: ' + JSON.stringify(report.requiredMisses));
console.log('Required assets complete; optional missing leaves:', report.droppedLeaves?.length || 0);
