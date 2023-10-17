import SingleParagraphCanvas from './SingleParagraphCanvas.mjs';
import CanvasConfig from './CanvasConfig.mjs';
import type FontConfig from './FontConfig.mjs';

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

    protected fillContent() {
        const { PARAGRAPH_PADDING } = SingleParagraphCanvas;

        const contentSegments = this.content.split(this.paragraphSeparator);

        let usedRowCount = this.titleTextAsNumber;

        for (const contentSegment of contentSegments) {
            super.fillContent(usedRowCount, contentSegment);
            usedRowCount += Math.ceil((contentSegment.length + PARAGRAPH_PADDING) / this.maxColumn);
        }
    }
}

export default ArticleCanvas;
