import {
    type Canvas as NodeCanvas,
    type CanvasRenderingContext2D as NodeCanvasContext,

    createCanvas,
    registerFont,
} from "canvas";

import CanvasConfig from "./CanvasConfig.mjs";
import FontConfig from "./FontConfig.mjs";

class Canvas {
    private readonly nodeCanvas: NodeCanvas;
    private readonly nodeCanvasContext: NodeCanvasContext;
    private readonly content: string;

    constructor(
        private readonly fontConfig: FontConfig,
        _content: string,
    ) {
        this.nodeCanvas = createCanvas(CanvasConfig.SIZE, CanvasConfig.SIZE);
        this.nodeCanvasContext = this.getNodeCanvasContext();
        this.content = this.getContent(_content);
    }

    private getNodeCanvasContext(): NodeCanvasContext {
        registerFont('src/BiauKai.ttc', { family: 'BiauKai' })

        const result = this.nodeCanvas.getContext('2d');

        result.fillStyle = "#ffffff";
        result.fillRect(0, 0, CanvasConfig.SIZE, CanvasConfig.SIZE);
        result.font = `${this.fontConfig.size}px 'BiauKai'`;
        result.textAlign = "center";
        result.textBaseline = 'top';
        result.fillStyle = "#000000";

        return result;
    }

    private getContent(_content: string): string {
        const { maxRow, maxColumn } = this.fontConfig;

        const capacity = maxColumn * maxRow - 2;

        return _content.length <= capacity ? _content : _content.slice(0, capacity - 3) + '。'.repeat(3);
    }

    drawToBuffer(): Buffer {
        const { size: fontSize, maxColumn } = this.fontConfig;

        for (
            let characterCount = 0,
                lineCount = 0;
            characterCount < this.content.length;
            lineCount++
        ) {
            let line: string;
            let xStart: number;
            let yStart: number;

            if (characterCount == 0) {
                line = this.content.slice(characterCount, characterCount + maxColumn - 2);

                characterCount += maxColumn - 2;

                if (characterCount >= this.content.length) {
                    xStart = CanvasConfig.SIZE / 2 - fontSize * ((maxColumn - line.length) / 2 - 2);
                    yStart = lineCount * fontSize * 1.25 + fontSize * 1.125;
                }
                else {
                    xStart = CanvasConfig.SIZE / 2 + fontSize;
                    yStart = lineCount * fontSize * 1.25 + fontSize * 1.125;
                }
            } else {
                line = this.content.slice(characterCount, characterCount + maxColumn);

                characterCount += maxColumn;

                if (characterCount >= this.content.length) {
                    xStart = CanvasConfig.SIZE / 2 - fontSize * (maxColumn - line.length) / 2;
                    yStart = lineCount * fontSize * 1.25 + fontSize * 1.125;
                }
                else {
                    xStart = CanvasConfig.SIZE / 2;
                    yStart = lineCount * fontSize * 1.25 + fontSize * 1.125;
                }
            }

            this.nodeCanvasContext.fillText(line, xStart, yStart);

        }

        return this.nodeCanvas.toBuffer('image/jpeg');
    }
}

export default Canvas;
