import {
    type Canvas as NodeCanvas,
    type CanvasRenderingContext2D as NodeCanvasContext,

    createCanvas,
    registerFont,
} from 'canvas';

import CanvasConfig from './CanvasConfig.mjs';
import type FontConfig from './FontConfig.mjs';
import C from './C.mjs';

abstract class CanvasBase {
    /* TO BE IMPLEMENTED */
    protected abstract renderContent(): void;

    /* PUBLIC API */
    public get htmlCanvas(): HTMLCanvasElement {
        C.assert(
            this.platform === 'WEB',
            'html canvas should not appear in non-web enviroment`',
        );

        C.assert(
            this.nodeCanvas instanceof HTMLCanvasElement,
            'canvas in "node-canvas" package is no longer an `HTMLCanvasElement`',
        );

        return this.nodeCanvas;
    }
    public toJpegBuffer(): Buffer {
        C.assert(
            this.platform === 'NODE',
            `Unsupported to-jpeg-buffer operation for platform = ${this.platform}`,
        );

        return this.nodeCanvas.toBuffer('image/jpeg');;
    }

    /* PRIVATE PART THAT NOBODY SHOULD SEE :) */
    private readonly nodeCanvas: NodeCanvas;
    protected readonly nodeCanvasContext: NodeCanvasContext;

    protected constructor(
        protected readonly fontConfig: FontConfig,
        protected readonly platform: CanvasConfig.SUPPORTED_PLATFORM,
        protected readonly content: string,
        protected readonly paddingTop: number,
        protected readonly lineSpacing: number,
        protected readonly titleConfig?: CanvasBase.TitleConfig,
        options?: Record<string, unknown>,
    ) {
        // I probably should not do that, but wfc :)
        Object.assign(this, options);

        this.nodeCanvas = createCanvas(CanvasConfig.SIZE, CanvasConfig.SIZE);

        this.nodeCanvasContext = this.getNodeCanvasContext();

        this.render();
    }

    private getNodeCanvasContext(): NodeCanvasContext {
        if (!!registerFont && this.fontConfig.fontFilePath && this.fontConfig.fontFace) {
            registerFont(this.fontConfig.fontFilePath, this.fontConfig.fontFace);
        }

        const result = this.nodeCanvas.getContext('2d');

        result.fillStyle = '#ffffff';
        result.fillRect(0, 0, CanvasConfig.SIZE, CanvasConfig.SIZE);
        result.font = [
            this.fontConfig.fontFace.style,
            this.fontConfig.fontFace.weight,
            `${this.fontConfig.fontSize}px`,
            this.fontConfig.fontFace.family,
        ]
            .filter(Boolean)
            .join(' ');
        result.textAlign = 'center';
        result.textBaseline = 'top';
        result.fillStyle = '#000000';

        return result;
    }

    private render() {
        this.renderTitle();
        this.renderContent();
    }

    private renderTitle(): void {
        if (!this.titleConfig) {
            return;
        }

        const { fontSize: fontSize } = this.fontConfig;
        const { text, startX } = this.titleConfig;

        const underlineStartX = startX - text.length * fontSize / 2;
        const underlineStartY = this.scaledPaddingTop + fontSize;
        const underlineWidth = fontSize * text.length;
        const underlineHeight = 3;
        this.nodeCanvasContext.fillRect(underlineStartX, underlineStartY, underlineWidth, underlineHeight);

        for (let i = 0; i < text.length; i++) {
            const startXi = underlineStartX + (i + 0.5) * fontSize;
            this.nodeCanvasContext.fillText(text[i], startXi, this.scaledPaddingTop);
        }
    };

    protected get titleTextAsBool() {
        return Boolean(this.titleConfig?.text);
    }

    protected get titleTextAsNumber() {
        return Number(this.titleTextAsBool);
    }

    protected get scaledPaddingTop() {
        return this.paddingTop * this.fontConfig.fontSize;
    }

    protected get maxRow() {
        const {
            fontConfig: { fontSize },
            lineSpacing,
            paddingTop,
        } = this;

        return Math.floor((CanvasConfig.SIZE - fontSize * paddingTop) / (fontSize * lineSpacing));
    }

    protected abstract get maxColumn(): number;
}

namespace CanvasBase {
    export interface TitleConfig {
        readonly text: string;
        readonly startX: number;
    }
}

export default CanvasBase;
