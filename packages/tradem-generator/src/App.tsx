import './App.css'

import FontFaceObserver from 'fontfaceobserver';
import { Match, Switch, createSignal, For, createResource, JSX } from 'solid-js'

import {
    C,
    PoemCanvas,
    SingleParagraphCanvas,
    type FontConfig,
} from 'canvas-common';

// @ts-ignore
function makeCanvases1(canvases: HTMLCanvasElement[]) {
    for (const fontSize of [20, 25, 32, 40, 50, 80] as const) {
        const fontConfig: FontConfig = {
            fontSize,
            fontFace: { family: 'cwTeXKai' },
        };

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

// @ts-ignore
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
            /* wordPerRow */5,
            /* Row */4,
            /* font */{ family, weight: '300' },
            /* platform */'WEB',
            /* content */contents[54].content,
            /* title */contents[54].title,
        )
        canvases.push(canvas54.htmlCanvas);

        const canvas78 = new PoemCanvas(
            /* wordPerRow */7,
            /* Row */8,
            /* font */{ family, weight: '300' },
            /* platform */'WEB',
            /* content */contents[78].content,
            /* title */contents[78].title,
        );
        canvases.push(canvas78.htmlCanvas);
    }

}

// @ts-ignore
function makeInitialCanvas() {
    return new PoemCanvas(
        /* wordPerRow */7,
        /* Row */8,
        /* font */{ family: 'cwtexkai', weight: '300' },
        /* platform */'WEB',
        /* content */'丞相祠堂何處尋，錦官城外柏森森。映階碧草自春色，隔葉黃鸝空好音。三顧頻煩天下計，兩朝開濟老臣心。出師未捷身先死，長使英雄淚滿襟。',
        /* title */'蜀相',
    );
    // canvases.push(canvas78);
}

function App() {
    const FONT_FAMILY_TO_LABEL_LOOKUP = {
        cwtexkai: '楷體',
        cwtexyen: '圓體',
        cwtexfangsong: '仿宋體',
        cwtexming: '明體',
    } as const;

    const [fontState] = createResource(async () => {
        try {
            await Promise.all((
                Object.keys(FONT_FAMILY_TO_LABEL_LOOKUP).map(async (fontFamily) => (
                    new FontFaceObserver(fontFamily).load('你好世界你真美，你好世界你真美。', 10 * 1000)
                ))
            ));
        }
        catch (error) {
            alert(error);
        }
    });

    const initCanvas = () => {
        C.assert(fontState.state === 'ready', 'Unreachable non-ready font-state');

        return new PoemCanvas(
            /* wordPerRow */7,
            /* Row */8,
            /* font */{ family: 'cwtexkai', weight: '300' },
            /* platform */'WEB',
            /* content */'丞相祠堂何處尋，錦官城外柏森森。映階碧草自春色，隔葉黃鸝空好音。三顧頻煩天下計，兩朝開濟老臣心。出師未捷身先死，長使英雄淚滿襟。',
            /* title */'蜀相',
        );
    };

    return (
        <Switch fallback={<h2>Loading...</h2>}>
            <Match when={fontState.state === 'ready'}>
                <CanvasMaker
                    initedCanvas={initCanvas()}
                    fontFamilyToLabelLookup={FONT_FAMILY_TO_LABEL_LOOKUP}
                />
            </Match>
            <Match when={fontState.state === 'errored'}>
                <h2>Error!!</h2>
            </Match>
        </Switch>
    )
}

function CanvasMaker(props: { initedCanvas: PoemCanvas, fontFamilyToLabelLookup: Record<string, string> }) {
    const [canvas, setCanvas] = createSignal(props.initedCanvas);

    const onPoemTitleInput: JSX.CustomEventHandlersCamelCase<HTMLInputElement>['onInput'] = (event) => {
        setCanvas((previous) => previous.move({ titleText: event.target.value }));
    };

    const onPoemContentInput: JSX.CustomEventHandlersCamelCase<HTMLTextAreaElement>['onInput'] = (event) => {
        setCanvas((previous) => previous.move({ content: event.target.value }));
    };

    const poemContentDisplay = () => {
        const { content, wordPerRow } = canvas();
        const column = wordPerRow + 1;

        const chunks: string[] = [];

        for (let i = 0; i < content.length; i += column * 2) {
            chunks.push(content.slice(i, i + column * 2));
        }

        return chunks.join('\n');
    };


    const onPoemRowCountInput: JSX.CustomEventHandlersCamelCase<HTMLSelectElement>['onInput'] = (event) => {
        const verifyRow = (row: number): row is PoemCanvas.Row => (
            Number.isSafeInteger(row) && row >= 1 && row <= 8
        );

        setCanvas((previous) => {
            const newRow = Number(event.target.value);

            C.assert(verifyRow(newRow), 'Invalid value for `row`');

            return previous.move({ row: newRow });
        });
    };


    const onPoemColumnCountInput: JSX.CustomEventHandlersCamelCase<HTMLSelectElement>['onInput'] = (event) => {
        const verifyColumn = (row: number): row is PoemCanvas.WordPerRow => (
            Number.isSafeInteger(row) && row >= 1 && row <= 7
        );

        setCanvas((previous) => {
            const newColumn = Number(event.target.value);

            C.assert(verifyColumn(newColumn), 'Invalid value for `column`');

            return previous.move({ wordPerRow: newColumn });
        });
    };

    const onPoemFontFamilyInput: JSX.CustomEventHandlersCamelCase<HTMLSelectElement>['onInput'] = (event) => {
        setCanvas((previous) => {
            const newFontFamily = event.target.value;

            C.assert(
                Object.prototype.hasOwnProperty.call(props.fontFamilyToLabelLookup, newFontFamily),
                'Invalid value for `font-family`',
            );

            return previous.move({ fontFace: { family: newFontFamily, weight: '300' }, });
        });
    };

    return (
        <>
            <div class="creator-rows">
                <h3>古詩創作家／TradEM Creator</h3>
            </div>
            <div class="creator-rows">
                <div class="creator-row creator-poem-image">
                    <img
                        src={canvas()?.htmlCanvas?.toDataURL()}
                        width={350}
                        height={350}
                        title="poem-canvas"
                    />
                </div>

                <form class="creator-row creator-form-container" onSubmit={(event) => { event.preventDefault() }}>
                    <div class="creator-form-rows">
                        <div class="creator-form-group">
                            <div class="creator-form-row">
                                <label for="poemTitle">
                                    標題
                                </label>
                                <input
                                    type="text"
                                    id="poemTitle"
                                    name="firstname"
                                    placeholder="標題。。。"
                                    onInput={onPoemTitleInput}
                                    value={canvas().titleText}
                                />
                            </div>
                            <div class="creator-form-row">
                                <label for="poemFontFamily">
                                    字體
                                </label>
                                <select
                                    id="poemFontFamily"
                                    name="poemFontFamily"
                                    onInput={onPoemFontFamilyInput}
                                    value={canvas().fontFace.family}
                                >
                                    <For each={Object.keys(props.fontFamilyToLabelLookup)}>
                                        {(fontFamily) => (
                                            <option value={fontFamily}>
                                                {props.fontFamilyToLabelLookup[fontFamily]}
                                            </option>
                                        )}
                                    </For>
                                </select>
                            </div>
                        </div>
                        <div class="creator-form-group">
                            <div class="creator-form-row">
                                <label for="poemRowCount">
                                    橫行行數
                                </label>
                                <select
                                    id="poemRowCount"
                                    name="poemRowCount"
                                    onInput={onPoemRowCountInput}
                                    value={canvas().row}
                                >
                                    <For each={Array(8).fill(0).map((_, i) => i + 1)}>
                                        {(value) => (
                                            <option value={value}>{value}</option>
                                        )}
                                    </For>
                                </select>
                            </div>
                            <div class="creator-form-row">
                                <label for="poemColumnCount">
                                    直行字數
                                </label>
                                <select
                                    id="poemColumnCount"
                                    name="poemColumnCount"
                                    onInput={onPoemColumnCountInput}
                                    value={canvas().wordPerRow}
                                >
                                    <For each={Array(7).fill(0).map((_, i) => i + 1)}>
                                        {(value) => (
                                            <option value={value}>{value}</option>
                                        )}
                                    </For>
                                </select>
                            </div>
                        </div>

                        <div class="creator-form-row">
                            <label for="poemContent">
                                內文
                            </label>
                            <textarea
                                id="poemContent"
                                name="poemContent"
                                placeholder="內文。。。"
                                onInput={onPoemContentInput}
                                value={canvas().content}
                                rows={5}
                                cols={16}
                            />
                        </div>

                        <div class="creator-form-row creator-form-buttons">
                            <input type="submit" value="下載" data-disabled={true} />
                            <input type="submit" value="分享" data-disabled={true} />
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default App;
