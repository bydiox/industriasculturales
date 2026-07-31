import fs from 'node:fs';

const files = ['package.json', 'data/syllabus.json'];
const versionPattern = /"version"\s*:\s*"(\d+)\.(\d+)\.(\d+)"/;

const readVersion = file => {
  const text = fs.readFileSync(file, 'utf8');
  const match = text.match(versionPattern);
  if (!match) throw new Error(`No semantic version found in ${file}`);
  return { text, match, version: [Number(match[1]), Number(match[2]), Number(match[3])] };
};

const packageData = readVersion(files[0]);
const syllabusData = readVersion(files[1]);
if (packageData.match[0] !== syllabusData.match[0]) {
  throw new Error(`Versions do not match: ${packageData.match[0]} vs ${syllabusData.match[0]}`);
}

const [major, minor, patch] = packageData.version;
const previousVersion = `${major}.${minor}.${patch}`;
const nextVersion = `${major}.${minor}.${patch + 1}`;
for (const { file, text } of [{ file: files[0], text: packageData.text }, { file: files[1], text: syllabusData.text }]) {
  fs.writeFileSync(file, text.replace(versionPattern, `"version": "${nextVersion}"`), 'utf8');
}
console.log(`Version incremented: ${previousVersion} -> ${nextVersion}`);
