import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { ArticleCanvas, SingleParagraphCanvas, FontConfig, PoemCanvas } from "canvas-common";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputFolderPath = path.resolve(__dirname, '..', 'canvas-image-snapshots', 'chinese-articles');

if (!fs.existsSync(outputFolderPath)) {
    fs.mkdirSync(outputFolderPath, { recursive: true });
}

const fontSizes = [20, 25, 32, 40, 50, 80] as const;
type CanvasArg = (
    | {
        title: string;
        content: string;
        kind: 'sentence' | 'paragraph' | 'article',
    }
    | Pick<PoemCanvas, 'wordPerRow' | 'row'> & {
        title: string;
        content: string;
        kind: `poem${string}`
    }
);

const canvasArgs: CanvasArg[] = [
    {
        title: '短句',
        content: '燕雀焉知鴻鵠志，壯懷如我更何人。',
        kind: 'sentence'
    },
    {
        title: '心經－原文',
        content: '觀自在菩薩，行深般若波羅蜜多時，照見五蘊皆空，度一切苦厄。舍利子！色不異空，空不異色；色即是空，空即是色，受想行識亦復如是。舍利子！是諸法空相，不生不滅，不垢不淨，不增不減。是故，空中無色，無受想行識；無眼耳鼻舌身意；無色聲香味觸法；無眼界，乃至無意識界；無無明，亦無無明盡，乃至無老死，亦無老死盡；無苦集滅道；無智亦無得。以無所得故，菩提薩埵。依般若波羅蜜多故，心無罣礙；無罣礙故，無有恐怖，遠離顛倒夢想，究竟涅槃。三世諸佛，依般若波羅蜜多故，得阿耨多羅三藐三菩提。故知：般若波羅蜜多是大神咒，是大明咒，是無上咒，是無等等咒，能除一切苦，真實不虛。故說般若波羅蜜多咒，即說咒曰：揭諦揭諦，波羅揭諦，波羅僧揭諦，菩提薩婆訶。',
        kind: 'paragraph'
    },
    {
        title: '將進酒',
        content: `
君不見黃河之水天上來，奔流到海不復回。君不見高堂明鏡悲白髮，朝如青絲暮成雪。
人生得意須盡歡，莫使金樽空對月。天生我材必有用，千金散盡還復來。烹羊宰牛且爲樂，會須一飲三百杯。
岑夫子，丹丘生。將進酒，杯莫停。與君歌一曲，請君爲我傾耳聽。鐘鼓饌玉不足貴，但願長醉不願醒。古來聖賢皆寂寞，惟有飲者留其名。
陳王昔時宴平樂，斗酒十千恣歡謔。主人何為言少錢？徑須沽取對君酌。五花馬，千金裘。呼兒將出換美酒，與爾同銷萬古愁。
                 `.trim(),
        kind: 'article',
    },
    {
        title: '靜夜思',
        content: '床前明月光，疑是地上霜。舉頭望明月，低頭思故鄉。',
        wordPerRow: 5,
        row: 4,
        kind: 'poem-ng5-jin4',
    },
    {
        title: '蜀相',
        content: '丞相祠堂何處尋，錦官城外柏森森。映階碧草自春色，隔葉黃鸝空好音。三顧頻煩天下計，兩朝開濟老臣心。出師未捷身先死，長使英雄淚滿襟。',
        wordPerRow: 7,
        row: 8,
        kind: 'poem-cat1-leot6',
    },
];

for (const fontSize of fontSizes) {
    const fontConfig = new FontConfig(
        /* size */fontSize,
        /* fontFace */{ family: 'cwtexkai' },
        /* path */'../../assets/cwTeXKai-zhonly.ttf',
    );

    for (const canvasArg of canvasArgs) {
        const fileNames = [
            { withTitle: false, fileName: `test-${canvasArg.kind}-${fontSize}px.jpg` },
            { withTitle: true, fileName: `test-${canvasArg.kind}-${fontSize}px-with-title.jpg` },
        ]

        for (const { withTitle, fileName } of fileNames) {
            const fullOutputFileName = path.resolve(outputFolderPath, fileName);

            const canvas = (() => {
                switch (canvasArg.kind) {
                    case 'article':
                        return new ArticleCanvas(
                            /* fontConfig */fontConfig,
                            /* platform */'NODE',
                            /* paragraphs */canvasArg.content,
                            /* paragraphSeparator */'\n',
                            /* titleText */withTitle ? canvasArg.title : undefined,
                        );
                    case 'sentence':
                    case 'paragraph':
                        return new SingleParagraphCanvas(
                            /* fontConfig */fontConfig,
                            /* platform */'NODE',
                            /* content */canvasArg.content,
                            /* titleText */withTitle ? canvasArg.title : undefined,
                        );
                    default:
                        return null;
                }
            })();

            if (canvas) {
                const buffer = canvas.toJpegBuffer()

                fs.writeFileSync(fullOutputFileName, buffer);
            }
        }
    }
}

const fontFace: FontConfig.FontFace = { family: 'cwtexkai'};

for (const canvasArg of canvasArgs) {
    const fileNames = [
        { withTitle: false, fileName: `test-${canvasArg.kind}.jpg` },
        { withTitle: true, fileName: `test-${canvasArg.kind}-with-title.jpg` },
    ]

    for (const { withTitle, fileName } of fileNames) {
        const fullOutputFileName = path.resolve(outputFolderPath, fileName);

        const canvas = (() => {
            switch (canvasArg.kind) {
                case 'poem-ng5-jin4':
                case 'poem-cat1-leot6':
                    return new PoemCanvas(
                        /* wordPerRow */canvasArg.wordPerRow,
                        /* row */canvasArg.row,
                        /* fontFace */fontFace,
                        /* platform */'NODE',
                        /* paragraphs */canvasArg.content,
                        /* titleText */withTitle ? canvasArg.title : undefined,
                    );
                default:
                    return null;
            }
        })();

        if (canvas) {
            const buffer = canvas.toJpegBuffer()

            fs.writeFileSync(fullOutputFileName, buffer);
        }
    }
}
