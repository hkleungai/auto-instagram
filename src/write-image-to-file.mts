import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import makeHelloWorldBuffer from './make-hello-world-buffer.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!fs.existsSync(path.resolve(__dirname, 'assets'))) {
    fs.mkdirSync(path.resolve(__dirname, 'assets'));
}

const buffer = makeHelloWorldBuffer();
fs.writeFileSync(path.resolve(__dirname, 'assets', 'test.png'), buffer);
