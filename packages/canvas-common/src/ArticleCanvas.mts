import SingleParagraphCanvas from "./SingleParagraphCanvas.mjs";
import CanvasConfig from "./CanvasConfig.mjs";
import FontConfig from "./FontConfig.mjs";

class ArticleCanvas extends SingleParagraphCanvas {
    constructor(
        protected readonly fontConfig: FontConfig,
        protected readonly platform: CanvasConfig.SUPPORTED_PLATFORM,
        paragraphs: string,
        protected readonly paragraphSeparator: string,
        titleText?: string,
        options?: Record<string, unknown>,
    ) {
        super(fontConfig, platform, paragraphs, titleText, { paragraphSeparator, ...options });
    }

    protected getContent(_content: string): string {
        const { maxColumn } = this.fontConfig;

        const paragraphs = _content.split(this.paragraphSeparator);

        let usedRowCount = this.titleTextAsNumber;

        let resultSegments: string[] = [];

        for (const rawParagraph of paragraphs) {
            const paragraph = super.getContent(rawParagraph, usedRowCount);

            if (!paragraph) {
                break;
            }

            usedRowCount += Math.ceil((rawParagraph.length + 2) / maxColumn);

            resultSegments.push(paragraph);
        }

        return resultSegments.join(this.paragraphSeparator);
    }

    protected fillContent() {
        const { maxColumn } = this.fontConfig;

        const contentSegments = this.content.split(this.paragraphSeparator);

        let usedRowCount = this.titleTextAsNumber;

        for (const contentSegment of contentSegments) {
            super.fillContent(usedRowCount, contentSegment);
            usedRowCount += Math.ceil((contentSegment.length + 2) / maxColumn);
        }

    }
}

export default ArticleCanvas;
