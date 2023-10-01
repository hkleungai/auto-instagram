import MaybeLookup from "./MaybeLookup.mts";

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

    // FIXME:
    //      Web and node render the same canvas setup differently.
    //      The most significant difference is on font weights and title underline spacing.
    //      Here just do some temp (or maybe non-temp) hack.
    static readonly TITLE_UNDERLINE_SPACING_LOOKUP = (
        new MaybeLookup<Record<CanvasConfig.SUPPORTED_PLATFORM, number>>(
            /* lookup */{
                WEB: 1.125,
                NODE: 1.3125
            },
            /* scope */'canvas-config-underline-spacing-lookup',
        )
            .get()
    );
}

namespace CanvasConfig {
    export type FontSize = typeof CanvasConfig.FONT_SIZES[number];
    export type SUPPORTED_PLATFORM = 'WEB' | 'NODE';
}

export default CanvasConfig;
