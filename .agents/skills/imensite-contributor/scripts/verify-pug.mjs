import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import pug from 'pug';

const projectRoot = process.cwd();
const packageJson = JSON.parse(await readFile(path.join(projectRoot, 'package.json'), 'utf8'));

if (packageJson.name !== 'imensite') {
  throw new Error('Run this script from the ImenSite repository root.');
}

async function findPugFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findPugFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith('.pug')) {
      files.push(entryPath);
    }
  }

  return files;
}

const viewDirectory = path.join(projectRoot, 'app', 'views');
const pugFiles = await findPugFiles(viewDirectory);

for (const file of pugFiles) {
  pug.compileFile(file, { filename: file });
}

console.log(`Compiled ${pugFiles.length} Pug templates successfully.`);
