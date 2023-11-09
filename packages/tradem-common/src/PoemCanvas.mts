import CanvasBase from './CanvasBase.mts';
import CanvasConfig from './CanvasConfig.mjs';
import type FontConfig from './FontConfig.mjs';

class PoemCanvas extends CanvasBase {
    constructor(
        public readonly wordPerRow: PoemCanvas.WordPerRow,
        public readonly row: PoemCanvas.Row,
        public readonly fontFace: FontConfig.FontFace,
        protected readonly platform: CanvasConfig.SUPPORTED_PLATFORM,
        public readonly content: string,
        public readonly titleText?: string,
        private options?: Record<string, unknown>,
    ) {
        const fontConfig: FontConfig = {
            fontSize: row <= 4 ? CanvasConfig.SIZE / 10 : CanvasConfig.SIZE / 16,
            fontFace,
        };

        const paddingTopOffset = (row <= 4 ? 4 : 8) - row + Number(!titleText);
        const scaledPaddingTopOffset = (1.5 / 2) * paddingTopOffset;
        const paddingTop = 1.375 + scaledPaddingTopOffset;

        const lineSpacing = 1.5;

        const titleConfig: CanvasBase.TitleConfig | undefined = (
            titleText
                ? {
                    text: titleText,
                    startX: CanvasConfig.SIZE / 2,
                }
                : undefined
        );

        super(fontConfig, platform, content, paddingTop, lineSpacing, titleConfig, { ...options, wordPerRow, row });
    }

    protected renderContent() {
        for (
            let charPointer = 0, lineCount = this.titleTextAsNumber;
            lineCount - this.titleTextAsNumber < this.row;
            lineCount++
        ) {
            const newCharPointer = charPointer + this.wordPerRow + 1;
            const line = this.content.slice(charPointer, newCharPointer);

            const scaledLineSpacing = this.fontConfig.fontSize * this.lineSpacing;
            const startY = lineCount * scaledLineSpacing + this.scaledPaddingTop;

            for (let i = 0; i < line.length; i++) {
                const startX = (i + this.columnPadding) * this.fontConfig.fontSize + scaledLineSpacing;
                this.nodeCanvasContext.fillText(line[i], startX, startY);
            }

            charPointer = newCharPointer;
        }
    }

    private get columnPadding() {
        return (-this.wordPerRow + 7) / 2 + (CanvasConfig.SIZE / 10 - this.fontConfig.fontSize) / (CanvasConfig.SIZE / 80);
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
            args.wordPerRow ?? this.wordPerRow,
            args.row ?? this.row,
            args.fontFace ?? this.fontFace,
            args.platform ?? this.platform,
            args.content ?? this.content,
            args.titleText ?? this.titleConfig?.text,
            {
                ...this.options,
                ...args.options,
                wordPerRow: args.wordPerRow ?? this.wordPerRow,
                row: args.row ?? this.row,
             }
        );
    }

    protected get maxColumn() {
        return CanvasConfig.SIZE / this.fontConfig.fontSize;
    }
}

namespace PoemCanvas {
    export type WordPerRow = 1 | 2 | 3 | 4 | 5 | 6 | 7;
    export type Row = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}

export default PoemCanvas;
