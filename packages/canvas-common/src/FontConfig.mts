import CanvasConfig from './CanvasConfig.mjs';
import MaybeLookup from './MaybeLookup.mjs';

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

    private static readonly MAX_ROW_LOOKUP = (
        new MaybeLookup<Record<CanvasConfig.FontSize, number>>(
            /* lookup */{
                20: 30,
                25: 24,
                32: 18,
                40: 14,
                50: 11,
                80: 6,
            },
            /* scope */'font-config-max-row-lookup',
        )
            .get()
    );
}

export default FontConfig;
