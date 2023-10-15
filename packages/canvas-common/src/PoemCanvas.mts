import CanvasBase from './CanvasBase.mts';
import CanvasConfig from './CanvasConfig.mjs';
import FontConfig from './FontConfig.mjs';

class PoemCanvas extends CanvasBase {
    constructor(
        public readonly wordPerRow: PoemCanvas.WordPerRow,
        public readonly row: PoemCanvas.Row,
        private fontFace: FontConfig.FontFace,
        protected readonly platform: CanvasConfig.SUPPORTED_PLATFORM,
        content: string,
        titleText?: string,
        private options?: Record<string, unknown>,
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

        super(fontConfig, platform, content, paddingTop, titleConfig, { ...options, wordPerRow, row });
    }

    protected fillContent() {
        const { LINE_SPACING } = PoemCanvas;
        const { size: fontSize } = this.fontConfig;

        for (
            let charPointer = 0, lineCount = this.titleTextAsNumber;
            lineCount - this.titleTextAsNumber < this.row;
            lineCount++
        ) {
            const newCharPointer = charPointer + this.wordPerRow + 1;
            const line = this.content.slice(charPointer, newCharPointer);

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
        return (-this.wordPerRow + 7) / 2 + (80 - this.fontConfig.size) / 10;
    }

    move(args: Partial<{
        wordPerRow: PoemCanvas.WordPerRow,
        row: PoemCanvas.Row,
        fontFace: FontConfig.FontFace,
        platform: CanvasConfig.SUPPORTED_PLATFORM,
        content: string,
        titleText?: string,
        options?: Record<string, unknown>,
    }>): PoemCanvas {
        Object.assign(this, args);

        return new PoemCanvas(
            args.wordPerRow || this.wordPerRow,
            args.row || this.row,
            args.fontFace || this.fontFace,
            args.platform || this.platform,
            args.content || this.content,
            args.titleText || this.titleConfig?.text,
            {
                ...this.options,
                ...args.options,
                wordPerRow: args.wordPerRow || this.wordPerRow,
                row: args.row || this.row,
             }
        );
    }
}

namespace PoemCanvas {
    export type WordPerRow = 1 | 2 | 3 | 4 | 5 | 6 | 7;
    export type Row = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}

export default PoemCanvas;
