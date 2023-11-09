class CanvasConfig {
    static get SIZE(): number {
        return 800;
    }
}

namespace CanvasConfig {
    export type SUPPORTED_PLATFORM = 'WEB' | 'NODE';
}

export default CanvasConfig;
