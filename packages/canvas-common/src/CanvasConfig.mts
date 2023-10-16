class CanvasConfig {
    static get SIZE(): number {
        return 800;
    }
}

namespace CanvasConfig {
    export type FontSize = 1 | 2 | 4 | 5 | 8 | 10 | 16 | 20 | 25 | 32 | 40 | 50 | 80 | 100 | 160 | 200 | 400 | 800;
    export type SUPPORTED_PLATFORM = 'WEB' | 'NODE';
}

export default CanvasConfig;
