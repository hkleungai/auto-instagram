class CanvasConfig {
    static get SIZE(): number {
        return 800;
    }

    static get FONT_SIZES() /* Purposely omitting return type declaration. `as const` will help instead.  */ {
        return [1, 2, 4, 5, 8, 10, 16, 20, 25, 32, 40, 50, 80, 100, 160, 200, 400, 800] as const satisfies readonly number[];
    }
}

namespace CanvasConfig {
    export type FontSize = typeof CanvasConfig.FONT_SIZES[number];
}

export default CanvasConfig;
