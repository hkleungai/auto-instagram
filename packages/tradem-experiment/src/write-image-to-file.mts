import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import makeHelloWorldBuffer from './make-hello-world-buffer.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputFolderPath = path.resolve(__dirname, '..', 'canvas-image-snapshots');

if (!fs.existsSync(outputFolderPath)) {
    fs.mkdirSync(outputFolderPath, { recursive: true });
}

const buffer = makeHelloWorldBuffer();
fs.writeFileSync(path.resolve(outputFolderPath, 'hello-world.png'), buffer);
