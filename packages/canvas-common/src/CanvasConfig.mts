import InsBotError from "./InsBotError.mjs";

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
    static readonly TITLE_UNDERLINE_SPACING_LOOKUP: Readonly<Record<CanvasConfig.SUPPORTED_PLATFORM, number>> = (
        new Proxy(
            {
                WEB: 1.125,
                NODE: 1.3125
            } as Readonly<Record<CanvasConfig.SUPPORTED_PLATFORM, number>>,
            {
                get(target, platform: CanvasConfig.SUPPORTED_PLATFORM) {
                    if (Object.hasOwn(target, platform)) {
                        return target[platform];
                    }

                    throw new InsBotError(
                        `Undetermined title-underline spacing for platform = ${platform}`,
                        { __scope: 'canvas-config' },
                    )
                }
            }
        )
    );
}

namespace CanvasConfig {
    export type FontSize = typeof CanvasConfig.FONT_SIZES[number];
    export type SUPPORTED_PLATFORM = 'WEB' | 'NODE';
}

export default CanvasConfig;
