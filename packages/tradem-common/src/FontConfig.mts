interface FontConfig {
    readonly fontSize: number,
    readonly fontFace: FontConfig.FontFace,
    readonly fontFilePath?: string,
}

namespace FontConfig {
    export interface FontFace {
        readonly family: string;
        readonly weight?: string | undefined;
        readonly style?: string | undefined;
    }
}

export default FontConfig;
