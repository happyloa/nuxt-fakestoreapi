import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export function verifyPatchedDependencies() {
  const root = new URL('../', import.meta.url);
  const patches = JSON.parse(readFileSync(new URL('scripts/security-patches.json', root), 'utf8'));
  const lock = JSON.parse(readFileSync(new URL('package-lock.json', root), 'utf8'));
  for (const [name, patch] of Object.entries(patches)) {
    const locations = Object.entries(lock.packages).filter(([path]) => path.endsWith(`node_modules/${name}`));
    if (!locations.length) throw new Error(`Missing patched dependency: ${name}`);
    for (const [path, entry] of locations) {
      const installed = JSON.parse(readFileSync(new URL(`${path}/package.json`, root), 'utf8'));
      if (entry.version !== patch.version || installed.version !== patch.version) {
        throw new Error(`Review the patch for ${path}@${entry.version}`);
      }
      for (const [file, expected] of Object.entries(patch.files)) {
        const hash = createHash('sha256').update(readFileSync(new URL(`${path}/${file}`, root))).digest('hex');
        if (hash !== expected) throw new Error(`Missing or changed security patch: ${path}/${file}`);
      }
    }
  }
  return patches;
}

export function reviewAudit(report, patches) {
  if (!report.metadata?.vulnerabilities || !report.vulnerabilities || report.error) {
    throw new Error('npm audit did not return a complete report');
  }
  const findings = Object.values(report.vulnerabilities).flatMap(item => item.via.filter(via => typeof via === 'object'));
  const inspect = name => {
    const pending = [name];
    const seen = new Set();
    let advisoryFound = false;
    while (pending.length) {
      const dependency = pending.pop();
      if (seen.has(dependency)) continue;
      seen.add(dependency);
      const item = report.vulnerabilities[dependency];
      if (!item?.via?.length) throw new Error(`Unresolved audit finding: ${dependency}`);
      for (const via of item.via) {
        if (typeof via === 'string') pending.push(via);
        else advisoryFound = true;
      }
    }
    if (!advisoryFound) throw new Error(`Unresolved audit finding: ${name}`);
  };
  for (const name of Object.keys(report.vulnerabilities)) inspect(name);
  const unexpected = findings.filter(finding => patches[finding.name]?.advisory !== finding.url.split('/').pop());
  if (unexpected.length) throw new Error(`Unmitigated advisories: ${unexpected.map(item => item.url).join(', ')}`);
  return findings;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const patches = verifyPatchedDependencies();
    const result = process.platform === 'win32'
      ? spawnSync(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', 'npm.cmd audit --json'], { encoding: 'utf8' })
      : spawnSync('npm', ['audit', '--json'], { encoding: 'utf8' });
    if (result.error || ![0, 1].includes(result.status)) throw result.error || new Error(result.stderr);
    const report = JSON.parse(result.stdout);
    const findings = reviewAudit(report, patches);
    console.log(`Raw npm audit: ${JSON.stringify(report.metadata.vulnerabilities)}`);
    for (const finding of findings) console.log(`Verified local patch: ${finding.name} (${finding.url})`);
    console.log('Security audit passed: no unmitigated advisories. npm still reports the patched upstream versions.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
