import CanvasConfig from "./CanvasConfig.mjs";
import InsBotError from "./InsBotError.mjs";

class FontConfig {
    readonly maxRow: number;

    readonly maxColumn: number;

    constructor(
        readonly size: CanvasConfig.FontSize,
        readonly fontFace: { family: string, weight?: string, style?: string },
        readonly path?: string,
    ) {
        this.maxRow = FontConfig.MAX_ROW_LOOKUP[this.size];
        this.maxColumn = CanvasConfig.SIZE / this.size - /* spacing */2;
    }

    private static readonly MAX_ROW_LOOKUP: Readonly<Record<CanvasConfig.FontSize, number>> = (
        new Proxy(
            {
                20: 30,
                25: 24,
                32: 18,
                40: 14,
                50: 11,
                80: 6,
            } as Readonly<Record<CanvasConfig.FontSize, number>>,
            {
                get(target, _prop) {
                    const prop = _prop as unknown as CanvasConfig.FontSize;

                    if (Object.hasOwn(target, prop)) {
                        return target[prop];
                    }

                    throw new InsBotError(
                        `Undetermined max line number for font size = ${prop}`,
                        { __scope: 'canvas-font-config' },
                    )
                }
            }
        )
    );
}

export default FontConfig;
