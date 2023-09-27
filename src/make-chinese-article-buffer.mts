import type CanvasConfig from "./CanvasConfig.mjs";
import Canvas from "./Canvas.mjs";
import FontConfig from "./FontConfig.mjs";

export default (fontSize: CanvasConfig.FontSize) => {
    const fontConfig = new FontConfig(fontSize);
    const content = '你好世界你真美，你好世界你真美。'.repeat(1000);

    return new Canvas(/* fontConfig */fontConfig, /* _content */content).drawToBuffer();
}
