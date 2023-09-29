import { Canvas, FontConfig } from "canvas-common";
import { setupCounter } from './counter.js'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

async function main() {
    for (const fontSize of [20, 25, 32, 40, 50, 80] as const) {
        const fontConfig = new FontConfig(
            /* size */fontSize,
            /* fontFace */{ family: 'BK' },
        );

        const contents: Record<string, { title: string; content: string; }> = {
            short: {
                title: '你好',
                content: '你好世界'
            },
            medium: {
                title: '你好嗎',
                content: '你好世界你真美，你好世界你真美。'
            },
            long: {
                title: '心經－原文',
                content: '觀自在菩薩，行深般若波羅蜜多時，照見五蘊皆空，度一切苦厄。舍利子！色不異空，空不異色；色即是空，空即是色，受想行識亦復如是。舍利子！是諸法空相，不生不滅，不垢不淨，不增不減。是故，空中無色，無受想行識；無眼耳鼻舌身意；無色聲香味觸法；無眼界，乃至無意識界；無無明，亦無無明盡，乃至無老死，亦無老死盡；無苦集滅道；無智亦無得。以無所得故，菩提薩埵。依般若波羅蜜多故，心無罣礙；無罣礙故，無有恐怖，遠離顛倒夢想，究竟涅槃。三世諸佛，依般若波羅蜜多故，得阿耨多羅三藐三菩提。故知：般若波羅蜜多是大神咒，是大明咒，是無上咒，是無等等咒，能除一切苦，真實不虛。故說般若波羅蜜多咒，即說咒曰：揭諦揭諦，波羅揭諦，波羅僧揭諦，菩提薩婆訶。'
            },
        };

        for (const type in contents) {
            const fileNames = [
                { withTitle: false },
                { withTitle: true },
            ]

            for (const { withTitle } of fileNames) {
                // const fullOutputFileName = path.resolve(outputFolderPath, fileName);
                const canvas = new Canvas(
                    /* fontConfig */fontConfig,
                    /* platform */'WEB',
                    /* _content */contents[type].content,
                    /* _title */withTitle ? contents[type].title : undefined,
                )
                document.querySelector<HTMLDivElement>('#app')!.appendChild(canvas.nodeCanvas as unknown as HTMLCanvasElement);
            }
        }
    }
}

main();
