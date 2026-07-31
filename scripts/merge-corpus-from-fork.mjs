import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const sourceArg = process.argv[2];
const sourceRoot = sourceArg ? resolve(sourceArg) : '';
if (!sourceRoot || !existsSync(join(sourceRoot, 'data/laws/laws-manifest.json'))) {
  console.error('Uso: node scripts/merge-corpus-from-fork.mjs <carpeta-extraida-del-fork>');
  process.exit(1);
}

const targetLawsDir = join(root, 'data/laws');
const sourceLawsDir = join(sourceRoot, 'data/laws');
const targetManifestPath = join(targetLawsDir, 'laws-manifest.json');
const sourceManifest = JSON.parse(await readFile(join(sourceLawsDir, 'laws-manifest.json'), 'utf8'));
const targetManifest = JSON.parse(await readFile(targetManifestPath, 'utf8'));
const existingIds = new Set(targetManifest.laws.map(law => law.lawId));

// These entries are already represented in this fork under a different, more
// explicit law_id or filename. They must not be duplicated by the merge.
const semanticDuplicates = new Set([
  'tfue', 'tue', 'ley-9-2017', 'rdleg-2-2015', 'lo-11-1985',
  'orden-cul-2039-2011', 'orden-cul-3355-2010', 'orden-cul-451-2011',
  'orden-cul-3359-2011', 'orden-cul-3065-2010', 'orden-cul-1993-2010',
  'rd-992-2014', 'rd-1028-2025', 'rd-1435-1985', 'rd-607-2026',
  'rd-171-2004'
]);

function meta(html, name) {
  const match = html.match(new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']+)`, 'i'));
  return match?.[1] || null;
}

const imported = [];
for (const sourceLaw of sourceManifest.laws) {
  if (existingIds.has(sourceLaw.lawId) || semanticDuplicates.has(sourceLaw.lawId)) continue;
  const sourceFile = join(sourceLawsDir, sourceLaw.file || '');
  if (!sourceLaw.file || !existsSync(sourceFile)) continue;
  const targetFile = join(targetLawsDir, basename(sourceLaw.file));
  if (existsSync(targetFile)) continue;
  await cp(sourceFile, targetFile);
  const html = await readFile(sourceFile, 'utf8');
  const officialUrl = sourceLaw.officialUrl || meta(html, 'official-url');
  targetManifest.laws.push({
    lawId: sourceLaw.lawId,
    slug: sourceLaw.slug || sourceLaw.lawId,
    title: sourceLaw.title || sourceLaw.shortTitle || sourceLaw.lawId,
    legalReference: sourceLaw.title || sourceLaw.shortTitle || sourceLaw.lawId,
    officialUrl,
    versionDate: sourceLaw.versionDate || meta(html, 'version-date') || null,
    file: basename(sourceLaw.file),
    sourceType: sourceLaw.verification === 'needs-source'
      ? 'external-pending-verification'
      : officialUrl?.includes('boe.es') ? 'boe-consolidado' : 'institutional'
  });
  imported.push(sourceLaw.lawId);
}

const sourceAssetsDir = join(sourceRoot, 'assets/practico');
const targetAssetsDir = join(root, 'assets/practico');
if (existsSync(sourceAssetsDir)) {
  await mkdir(targetAssetsDir, { recursive: true });
  await cp(sourceAssetsDir, targetAssetsDir, { recursive: true, force: false, errorOnExist: false });
}
const sourceBacklog = join(sourceRoot, 'data/laws/laws-backlog.json');
if (existsSync(sourceBacklog)) {
  await cp(sourceBacklog, join(targetLawsDir, 'laws-backlog.json'), { force: true });
}

await writeFile(targetManifestPath, `${JSON.stringify(targetManifest, null, 2)}\n`, 'utf8');
console.log(`Normas nuevas incorporadas: ${imported.length}`);
console.log(imported.join(', ') || '(ninguna)');
console.log('Material práctico fusionado en assets/practico/.');
