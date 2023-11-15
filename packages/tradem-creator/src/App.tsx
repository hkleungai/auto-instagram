import './App.css'

import FontFaceObserver from 'fontfaceobserver';
import { Match, Switch, createSignal, For, createResource, JSX } from 'solid-js';

import {
    C,
    PoemCanvas,
    type CanvasConfig,
} from 'tradem-common';

type GoogleFontFamily = `cwtex${string}`;
type GoogleFontLabel = `${string}體`;

const FONT_FAMILY_TO_LABEL_LOOKUP = {
    cwtexkai: '楷體',
    cwtexyen: '圓體',
    cwtexfangsong: '仿宋體',
    cwtexming: '明體',
} as const satisfies Record<GoogleFontFamily, GoogleFontLabel>;

const DEFAULT_FONT_WEIGHT = '300';
const DEFAULT_WORD_PER_ROW = 7;
const DEFAULT_ROW = 8;
const DEFAULT_FONT_FAMILY: GoogleFontFamily = 'cwtexkai';
const DEFAULT_PLATFORM: CanvasConfig.SUPPORTED_PLATFORM = 'WEB';

function App() {

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
            /* wordPerRow */DEFAULT_WORD_PER_ROW,
            /* Row */DEFAULT_ROW,
            /* font */{ family: DEFAULT_FONT_FAMILY, weight: DEFAULT_FONT_WEIGHT },
            /* platform */DEFAULT_PLATFORM,
            /* content */'',
            /* title */'',
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
        setCanvas((previous) => previous.move({ content: event.target.value.replace(/\n/g, '') }));
    };

    // @ts-ignore
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

        const newRow = Number(event.target.value);

        C.assert(verifyRow(newRow), 'Invalid value for `row`');

        setCanvas((previous) => previous.move({ row: newRow }));
    };


    const onPoemColumnCountInput: JSX.CustomEventHandlersCamelCase<HTMLSelectElement>['onInput'] = (event) => {
        const verifyColumn = (row: number): row is PoemCanvas.WordPerRow => (
            Number.isSafeInteger(row) && row >= 1 && row <= 7
        );

        const newColumn = Number(event.target.value);

        C.assert(verifyColumn(newColumn), 'Invalid value for `column`');

        setCanvas((previous) => previous.move({ wordPerRow: newColumn }));
    };

    const onPoemFontFamilyInput: JSX.CustomEventHandlersCamelCase<HTMLSelectElement>['onInput'] = (event) => {
        const newFontFamily = event.target.value;

        C.assert(
            Object.hasOwn(props.fontFamilyToLabelLookup, newFontFamily),
            'Invalid value for `font-family`',
        );

        setCanvas((previous) => previous.move({ fontFace: { family: newFontFamily, weight: DEFAULT_FONT_WEIGHT }, }));
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
                            />
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
                                rows={5}
                                cols={16}
                            />
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
