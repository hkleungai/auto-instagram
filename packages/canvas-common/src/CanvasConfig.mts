class CanvasConfig {
    static get SIZE(): number {
        return 800;
    }

    /* Purposely omitting return type declaration. `as const` will help instead. */
    static readonly FONT_SIZES = [
        1,
        2,
        4,
        5,
        8,
        10,
        16,
        20,
        25,
        32,
        40,
        50,
        80,
        100,
        160,
        200,
        400,
        800,
    ] as const satisfies readonly number[];
}

namespace CanvasConfig {
    export type FontSize = typeof CanvasConfig.FONT_SIZES[number];
    export type SUPPORTED_PLATFORM = 'WEB' | 'NODE';
}

export default CanvasConfig;
