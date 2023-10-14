import CanvasBase from './CanvasBase.mts';
import CanvasConfig from './CanvasConfig.mjs';
import FontConfig from './FontConfig.mjs';

class SingleParagraphCanvas extends CanvasBase {
    constructor(
        protected readonly fontConfig: FontConfig,
        protected readonly platform: CanvasConfig.SUPPORTED_PLATFORM,
        content: string,
        titleText?: string,
        options?: Record<string, unknown>,
    ) {
        const paddingTop = 1.375;

        const titleConfig: CanvasBase.TitleConfig | undefined = (
            titleText
                ? {
                    text: titleText,
                    startX: CanvasConfig.SIZE / 2,
                }
                : undefined
        );

        super(fontConfig, platform, content, paddingTop, titleConfig, options);
    }

    protected fillContent(lineCount = this.titleTextAsNumber, content = this.content) {
        const { BEGIN_PADDING_SIZE, LINE_SPACING, TRAILING_ELLIPSIS } = SingleParagraphCanvas;
        const { size: fontSize, maxRow, maxColumn } = this.fontConfig;

        for (
            let charPointer = 0;
            charPointer < content.length && lineCount < maxRow;
            lineCount++
        ) {
            const columnOffset = charPointer == 0 ? BEGIN_PADDING_SIZE : 0;
            const newCharPointer = charPointer + maxColumn - columnOffset;
            const hasLongContentAtLastRow = lineCount + 1 === maxRow && newCharPointer < content.length;

            const lineStart = charPointer;
            const lineEnd = newCharPointer - (hasLongContentAtLastRow ? TRAILING_ELLIPSIS.length : 0);
            const lineSuffix = hasLongContentAtLastRow ? TRAILING_ELLIPSIS : '';
            const line = content.slice(lineStart, lineEnd).concat(lineSuffix);

            const scaledLineSpacing = fontSize * LINE_SPACING;
            const startY = lineCount * scaledLineSpacing + this.scaledPaddingTop;

            for (let i = 0; i < line.length; i++) {
                const startX = (i + columnOffset) * fontSize + scaledLineSpacing;
                this.nodeCanvasContext.fillText(line[i], startX, startY);
            }

            charPointer = newCharPointer;
        }
    }

    protected static get TRAILING_ELLIPSIS() {
        return '。。。';
    }

    protected static get BEGIN_PADDING_SIZE() {
        return 2;
    }

    protected static get LINE_SPACING() {
        return 1.25;
    }
}

export default SingleParagraphCanvas;
