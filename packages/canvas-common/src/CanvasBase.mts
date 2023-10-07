import {
    type Canvas as NodeCanvas,
    type CanvasRenderingContext2D as NodeCanvasContext,

    createCanvas,
    registerFont,
} from "canvas";

import CanvasConfig from "./CanvasConfig.mjs";
import FontConfig from "./FontConfig.mjs";
import Bug from "./Bug.mjs";

abstract class CanvasBase {
    /* TO BE IMPLEMENTED */
    protected abstract getContent(_content: string): string;
    protected abstract fillContent(): void;

    /* PUBLIC API */
    public readonly nodeCanvas: NodeCanvas;
    public toJpegBuffer(): Buffer {
        switch (this.platform) {
            case 'NODE': {
                return this.nodeCanvas.toBuffer('image/jpeg');
            }
            default: {
                throw new Bug(
                    /* message */`Unsupported operation for platform = ${this.platform}`,
                    { __scope: 'canvas-to-jpeg-buffer' }
                );
            }
        }
    }

    /* PRIVATE PART THAT NOBODY SHOULD SEE :) */
    protected readonly nodeCanvasContext: NodeCanvasContext;
    protected readonly content: string;
    protected readonly titleText?: string;
    protected readonly titleStartX?: number;
    protected readonly titleStartY?: number;

    protected constructor(
        protected readonly fontConfig: FontConfig,
        protected readonly platform: CanvasConfig.SUPPORTED_PLATFORM,
        _content: string,
        titleConfig?: CanvasBase.TitleConfig,
        options?: Record<string, unknown>,
    ) {
        // I probably should not do that, but wfc :)
        Object.assign(this, options);

        this.nodeCanvas = createCanvas(CanvasConfig.SIZE, CanvasConfig.SIZE);

        this.nodeCanvasContext = this.getNodeCanvasContext();

        if (titleConfig) {
            this.titleText = titleConfig.text;
            this.titleStartX = titleConfig.startX;
            this.titleStartY = titleConfig.startY;
        }

        this.content = this.getContent(_content);

        this.fillCanvas();
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

    private fillCanvas() {
        this.fillTitle();
        this.fillContent();
    }

    private fillTitle(): void {
        if (!this.titleText || !this.titleStartX || !this.titleStartY) {
            return;
        }

        const { size: fontSize } = this.fontConfig;

        this.nodeCanvasContext.fillText(this.titleText, this.titleStartX, this.titleStartY);

        const underlineStartX = this.titleStartX - fontSize * this.titleText.length / 2;
        const underlineStartY = this.titleStartY + fontSize * CanvasConfig.TITLE_UNDERLINE_SPACING_LOOKUP[this.platform];
        const underlineWidth = fontSize * this.titleText.length;
        const underlineHeight = 1;
        this.nodeCanvasContext.fillRect(underlineStartX, underlineStartY, underlineWidth, underlineHeight);
    };

    protected get titleTextAsBool() {
        return Boolean(this.titleText);
    }

    protected get titleTextAsNumber() {
        return Number(this.titleTextAsBool);
    }

}

namespace CanvasBase {
    export interface TitleConfig {
        text: string;
        startX: number;
        startY: number;
    }
}

export default CanvasBase;
