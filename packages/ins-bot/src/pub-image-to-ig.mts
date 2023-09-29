import 'dotenv/config';

import IgManager from './IgManager.mjs';
import makeHelloWorldBuffer from './make-hello-world-buffer.mjs';

const { IG_USERNAME, IG_PASSWORD } = process.env;

if (!IG_USERNAME) {
    throw new Error('[IG BOT]: `process.env.IG_USERNAME` is required')
}
if (!IG_PASSWORD) {
    throw new Error('[IG BOT]: `process.env.IG_PASSWORD` is required')
}

const igManager = new IgManager(IG_USERNAME, IG_PASSWORD);

await igManager.login();

await igManager.publishPhoto({
    file: makeHelloWorldBuffer(),
    caption: 'Hello internet! 💖',
});
