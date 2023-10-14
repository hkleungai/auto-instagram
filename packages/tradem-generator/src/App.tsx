import './App.css'

import { For, Match, Switch, createEffect, createSignal, onMount } from 'solid-js'
import FontFaceObserver from 'fontfaceobserver';

import solidLogo from './assets/solid.svg'
import viteLogo from '/vite.svg'

import { PoemCanvas, SingleParagraphCanvas, FontConfig } from 'canvas-common';

function makeCanvases1(canvases: HTMLCanvasElement[]) {
    for (const fontSize of [20, 25, 32, 40, 50, 80] as const) {
        const fontConfig = new FontConfig(
            /* size */fontSize,
            /* fontFace */{ family: 'cwTeXKai' },
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
                const canvas = new SingleParagraphCanvas(
                    /* fontConfig */fontConfig,
                    /* platform */'WEB',
                    /* content */contents[type].content,
                    /* title */withTitle ? contents[type].title : undefined,
                )
                canvases.push(canvas.htmlCanvas);
            }
        }
    }

}

function makeCanvases2(canvases: HTMLCanvasElement[]) {
    const contents = {
        54: {
            title: '靜夜思',
            content: '床前明月光，疑是地上霜。舉頭望明月，低頭思故鄉。'
        },
        78: {
            title: '蜀相',
            content: '丞相祠堂何處尋，錦官城外柏森森。映階碧草自春色，隔葉黃鸝空好音。三顧頻煩天下計，兩朝開濟老臣心。出師未捷身先死，長使英雄淚滿襟。'
        },
    } as const satisfies Record<string, { title: string; content: string; }>;

    for (const family of [
        'cwtexkai',
        'cwtexyen',
        'cwtexfangsong',
        // 'Noto Sans SC',
        'cwtexming',
    ] as const) {
        const canvas54 = new PoemCanvas(
            /* wordCountPerRow */5,
            /* Row */4,
            /* font */{ family, weight: '500' },
            /* platform */'WEB',
            /* content */contents[54].content,
            /* title */contents[54].title,
        )
        canvases.push(canvas54.htmlCanvas);

        const canvas78 = new PoemCanvas(
            /* wordCountPerRow */7,
            /* Row */8,
            /* font */{ family, weight: '500' },
            /* platform */'WEB',
            /* content */contents[78].content,
            /* title */contents[78].title,
        );
        canvases.push(canvas78.htmlCanvas);
    }

}

function App() {
    const [count, setCount] = createSignal(0);
    const [isPageReady, setIsPageReady] = createSignal(false);

    const canvases: HTMLCanvasElement[] = [];

    onMount(async () => {
        await Promise.all([
            new FontFaceObserver('cwtexkai').load('你好世界你真美，你好世界你真美。'),
            new FontFaceObserver('cwtexyen').load('你好世界你真美，你好世界你真美。'),
            new FontFaceObserver('cwtexfangsong').load('你好世界你真美，你好世界你真美。'),
            new FontFaceObserver('cwtexming').load('你好世界你真美，你好世界你真美。'),
        ]);

        makeCanvases2(canvases);

        setIsPageReady(true);
    });

    createEffect(() => {
        console.log('isPageReady', isPageReady());
    })

    return (
        <Switch fallback={<h2>Loading...</h2>}>
            <Match when={isPageReady()}>
                <div>
                    <a href='https://vitejs.dev' target='_blank'>
                        <img src={viteLogo} class='logo' alt='Vite logo' />
                    </a>
                    <a href='https://solidjs.com' target='_blank'>
                        <img src={solidLogo} class='logo solid' alt='Solid logo' />
                    </a>
                </div>
                <h1>Vite + Solid</h1>
                <div class='card'>
                    <button onClick={() => setCount((count) => count + 1)}>
                        count is {count()}
                    </button>
                    <p>
                        Edit <code>src/App.tsx</code> and save to test HMR
                    </p>
                </div>
                <p class='read-the-docs'>
                    Click on the Vite and Solid logos to learn more
                </p>

                <For each={canvases}>
                    {(canvas) => canvas}
                </For>
            </Match>
            <Match when={!isPageReady()}>
                <h2>Loading...</h2>
            </Match>
        </Switch>
    )
}

export default App
