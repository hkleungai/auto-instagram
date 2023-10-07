import CanvasBase from "./CanvasBase.mts";
import CanvasConfig from "./CanvasConfig.mjs";
import FontConfig from "./FontConfig.mjs";

class SingleParagraphCanvas extends CanvasBase {
    constructor(
        protected readonly fontConfig: FontConfig,
        protected readonly platform: CanvasConfig.SUPPORTED_PLATFORM,
        _content: string,
        titleText?: string,
        options?: Record<string, unknown>,
    ) {
        const titleConfig: CanvasBase.TitleConfig | undefined = (
            titleText
                ? {
                    text: titleText,
                    startX: CanvasConfig.SIZE / 2,
                    startY: fontConfig.size * 1.125,
                }
                : undefined
        );

        super(fontConfig, platform, _content, titleConfig, options);
    }

    protected getContent(_content: string, usedRowCount = this.titleTextAsNumber): string {
        const { BEGIN_PADDING_SIZE, TRAILING_ELLIPSIS } = SingleParagraphCanvas;
        const { maxRow, maxColumn } = this.fontConfig;

        const capacity = maxColumn * (maxRow - usedRowCount) - BEGIN_PADDING_SIZE;

        if (capacity <= 0) {
            return "";
        }

        if (_content.length <= capacity) {
            return _content;
        }

        return _content.slice(0, capacity - TRAILING_ELLIPSIS.length) + TRAILING_ELLIPSIS;
    }

    protected fillContent(usedRowCount = this.titleTextAsNumber, content = this.content) {
        const { size: fontSize, maxColumn } = this.fontConfig;

        for (
            let characterCount = 0,
                lineCount = usedRowCount;
            characterCount < content.length;
            lineCount++
        ) {
            const columnOffset = characterCount == 0 ? -SingleParagraphCanvas.BEGIN_PADDING_SIZE : 0;

            const line = content.slice(characterCount, characterCount + maxColumn + columnOffset);
            const startX = CanvasConfig.SIZE / 2 - fontSize * ((maxColumn - line.length) / 2 + columnOffset);
            const startY = lineCount * fontSize * 1.25 + fontSize * 1.125;
            this.nodeCanvasContext.fillText(line, startX, startY);

            characterCount += (maxColumn + columnOffset);
        }
    }

    protected static get TRAILING_ELLIPSIS() {
        return '。。。';
    }

    protected static get BEGIN_PADDING_SIZE() {
        return 2;
    }
}

export default SingleParagraphCanvas;
