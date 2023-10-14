import CanvasBase from './CanvasBase.mts';
import CanvasConfig from './CanvasConfig.mjs';
import FontConfig from './FontConfig.mjs';

class PoemCanvas extends CanvasBase {
    constructor(
        public readonly wordCountPerRow: 1 | 2 | 3 | 4 | 5 | 6 | 7,
        public readonly row: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
        fontFace: FontConfig.FontFace,
        protected readonly platform: CanvasConfig.SUPPORTED_PLATFORM,
        content: string,
        titleText?: string,
        options?: Record<string, unknown>,
    ) {
        const { LINE_SPACING } = PoemCanvas;

        const paddingTopOffset = (row <= 4 ? 4 : 8) - row + Number(!titleText);
        const scaledPaddingTopOffset = (LINE_SPACING / 2) * paddingTopOffset;
        const paddingTop = 1.375 + scaledPaddingTopOffset;

        const fontSize = row <= 4 ? 80 : 50;
        const fontConfig = new FontConfig(fontSize, fontFace);

        const titleConfig: CanvasBase.TitleConfig | undefined = (
            titleText
                ? {
                    text: titleText,
                    startX: CanvasConfig.SIZE / 2,
                }
                : undefined
        );

        super(fontConfig, platform, content, paddingTop, titleConfig, { ...options, wordCountPerRow, row });
    }

    protected fillContent(lineCount = this.titleTextAsNumber, content = this.content) {
        const { LINE_SPACING } = PoemCanvas;
        const { size: fontSize } = this.fontConfig;

        for (
            let charPointer = 0;
            lineCount - this.titleTextAsNumber < this.row;
            lineCount++
        ) {
            const newCharPointer = charPointer + this.wordCountPerRow + 1;
            const line = content.slice(charPointer, newCharPointer);

            const scaledLineSpacing = fontSize * LINE_SPACING;
            const startY = lineCount * scaledLineSpacing + this.scaledPaddingTop;

            for (let i = 0; i < line.length; i++) {
                const startX = (i + this.columnPadding) * fontSize + scaledLineSpacing;
                this.nodeCanvasContext.fillText(line[i], startX, startY);
            }

            charPointer = newCharPointer;
        }
    }

    protected static get LINE_SPACING() {
        return 1.5;
    }

    private get columnPadding() {
        return (-this.wordCountPerRow + 7) / 2 + (80 - this.fontConfig.size) / 10;
    }
}

export default PoemCanvas;
