import CanvasBase from './CanvasBase.mts';
import CanvasConfig from './CanvasConfig.mjs';
import type FontConfig from './FontConfig.mjs';

class SingleParagraphCanvas extends CanvasBase {
    constructor(
        protected readonly fontConfig: FontConfig,
        protected readonly platform: CanvasConfig.SUPPORTED_PLATFORM,
        content: string,
        titleText?: string,
        options?: Record<string, unknown>,
    ) {
        const paddingTop = 1.375;

        const lineSpacing = 1.25;

        const titleConfig: CanvasBase.TitleConfig | undefined = (
            titleText
                ? {
                    text: titleText,
                    startX: CanvasConfig.SIZE / 2,
                }
                : undefined
        );

        super(fontConfig, platform, content, paddingTop, lineSpacing, titleConfig, options);
    }

    protected fillContent(lineCount = this.titleTextAsNumber, content = this.content) {
        const { PARAGRAPH_PADDING, TRAILING_ELLIPSIS } = SingleParagraphCanvas;

        for (
            let charPointer = 0;
            charPointer < content.length && lineCount < this.maxRow;
            lineCount++
        ) {
            const columnOffset = charPointer == 0 ? PARAGRAPH_PADDING : 0;
            const newCharPointer = charPointer + this.maxColumn - columnOffset;
            const hasLongContentAtLastRow = lineCount + 1 === this.maxRow && newCharPointer < content.length;

            const lineStart = charPointer;
            const lineEnd = newCharPointer - (hasLongContentAtLastRow ? TRAILING_ELLIPSIS.length : 0);
            const lineSuffix = hasLongContentAtLastRow ? TRAILING_ELLIPSIS : '';
            const line = content.slice(lineStart, lineEnd).concat(lineSuffix);

            const scaledLineSpacing = this.fontConfig.fontSize * this.lineSpacing;
            const startY = lineCount * scaledLineSpacing + this.scaledPaddingTop;

            for (let i = 0; i < line.length; i++) {
                const startX = (i + columnOffset) * this.fontConfig.fontSize + scaledLineSpacing;
                this.nodeCanvasContext.fillText(line[i], startX, startY);
            }

            charPointer = newCharPointer;
        }
    }

    protected static get TRAILING_ELLIPSIS() {
        return '。。。';
    }

    protected static get PARAGRAPH_PADDING() {
        return 2;
    }

    protected get maxColumn() {
        return CanvasConfig.SIZE / this.fontConfig.fontSize - SingleParagraphCanvas.PARAGRAPH_PADDING;
    }
}

export default SingleParagraphCanvas;
