import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
    base: 'tradem-creator',
    plugins: [
        solid({
            extensions: [
                ['.mts', { typescript: true }],
            ]
        }),
    ],
})
