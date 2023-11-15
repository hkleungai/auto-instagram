import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig(({ mode, ...args }) => {
    const base = (() => {
        switch (mode) {
            case 'development': {
                return '/';
            }

            case 'production': {
                return '/tradem';
            }

            default: {
                throw new Error(`Nah config.mode="${mode}" is not yet supported.`);
            }
        }
    })();

    return {
        base,
        plugins: [
            legacy(),
            solid({
                extensions: [
                    ['.mts', { typescript: true }],
                ],
            }),
        ],
    }
})
