import {
    type Canvas as NodeCanvas,
    type CanvasRenderingContext2D as NodeCanvasContext,

    createCanvas,
    registerFont,
} from "canvas";

import CanvasConfig from "./CanvasConfig.mjs";
import FontConfig from "./FontConfig.mjs";
import Bug from "./Bug.mjs";

class Canvas {
    readonly nodeCanvas: NodeCanvas;
    private readonly nodeCanvasContext: NodeCanvasContext;
    private readonly title?: string;
    private readonly content: string;

    constructor(
        private readonly fontConfig: FontConfig,
        private readonly platform: CanvasConfig.SUPPORTED_PLATFORM,
        _content: string,
        _title?: string,
    ) {
        this.nodeCanvas = createCanvas(CanvasConfig.SIZE, CanvasConfig.SIZE);
        this.nodeCanvasContext = this.getNodeCanvasContext();
        if (_title) {
            this.title = _title;
        }
        this.content = this.getContent(_content);

        this.fillArticle();
    }

    private getNodeCanvasContext(): NodeCanvasContext {
        if (!!registerFont && this.fontConfig.path && this.fontConfig.fontFace) {
            registerFont(this.fontConfig.path, this.fontConfig.fontFace);
        }

        const result = this.nodeCanvas.getContext('2d');

        result.fillStyle = "#ffffff";
        result.fillRect(0, 0, CanvasConfig.SIZE, CanvasConfig.SIZE);
        result.font = `${this.fontConfig.size}px '${this.fontConfig.fontFace.family}'`;
        result.textAlign = "center";
        result.textBaseline = 'top';
        result.fillStyle = "#000000";

        return result;
    }

    private getContent(_content: string): string {
        const { maxRow, maxColumn } = this.fontConfig;

        const rowOffset = this.title ? -1 : 0

        const capacity = maxColumn * (maxRow + rowOffset) - 2;

        return _content.length <= capacity ? _content : _content.slice(0, capacity - 3) + '。'.repeat(3);
    }

    private fillTitle() {
        if (!this.title) {
            return;
        }

        const { size: fontSize } = this.fontConfig;

        const xStart = CanvasConfig.SIZE / 2;
        const yStart = fontSize * 1.125;
        this.nodeCanvasContext.fillText(this.title, xStart, yStart);

        this.nodeCanvasContext.fillRect(CanvasConfig.SIZE / 2 - fontSize * ((this.title.length) / 2), yStart + fontSize * CanvasConfig.TITLE_UNDERLINE_SPACING_LOOKUP[this.platform], fontSize * this.title.length, 1);
    }

    private fillContent() {
        const { size: fontSize, maxColumn } = this.fontConfig;

        for (
            let characterCount = 0,
                lineCount = +!!this.title;
            characterCount < this.content.length;
            lineCount++
        ) {
            /* A paragraph begins with 2-char-sized spacing */
            const offset = characterCount == 0 ? -2 : 0;

            const line = this.content.slice(characterCount, characterCount + maxColumn + offset);
            const xStart = CanvasConfig.SIZE / 2 - fontSize * ((maxColumn - line.length) / 2 + offset);
            const yStart = lineCount * fontSize * 1.25 + fontSize * 1.125;

            this.nodeCanvasContext.fillText(line, xStart, yStart);

            characterCount += (maxColumn + offset);
        }
    }

    private fillArticle() {
        this.fillTitle();
        this.fillContent();
    }

    toJpegBuffer() {
        if (this.platform !== 'NODE') {
            throw new Bug(
                /* message */`Unsupported operation for platform = ${this.platform}`,
                { __scope: 'canvas-to-jpeg-buffer' }
            )
        }
        return this.nodeCanvas.toBuffer('image/jpeg');
    }
}

export default Canvas;
