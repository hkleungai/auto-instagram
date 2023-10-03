import CanvasBase from "./CanvasBase.mts";
import CanvasConfig from "./CanvasConfig.mjs";
import FontConfig from "./FontConfig.mjs";

class SingleParagraphCanvas extends CanvasBase {
    constructor(
        protected readonly fontConfig: FontConfig,
        protected readonly platform: CanvasConfig.SUPPORTED_PLATFORM,
        content: string,
        titleText?: string,
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

        super(fontConfig, platform, content, titleConfig);
    }

    protected getContent(_content: string): string {
        const { maxRow, maxColumn } = this.fontConfig;

        const rowOffset = this.titleText ? -1 : 0;
        const capacity = maxColumn * (maxRow + rowOffset) - 2;

        return _content.length <= capacity ? _content : _content.slice(0, capacity - 3) + '。'.repeat(3);
    }

    protected fillContent() {
        const { size: fontSize, maxColumn } = this.fontConfig;

        for (
            let characterCount = 0,
                lineCount = +!!this.titleText;
            characterCount < this.content.length;
            lineCount++
        ) {
            /* A paragraph begins with 2-char-sized spacing */
            const offset = characterCount == 0 ? -2 : 0;

            const line = this.content.slice(characterCount, characterCount + maxColumn + offset);
            const startX = CanvasConfig.SIZE / 2 - fontSize * ((maxColumn - line.length) / 2 + offset);
            const startY = lineCount * fontSize * 1.25 + fontSize * 1.125;
            this.nodeCanvasContext.fillText(line, startX, startY);

            characterCount += (maxColumn + offset);
        }
    }
}

export default SingleParagraphCanvas;
