import { For } from 'solid-js'

function AppHead() {
    const zhEarlyAccessFonts = [
        'cwtexkai',
        'cwtexyen',
        'cwtexfangsong',
        'notosanstc',
        'cwtexming',
    ] as const;

    return (
        <For each={zhEarlyAccessFonts}>
            {(zhEarlyAccessFont) => (
                <link
                    href={`https://fonts.googleapis.com/earlyaccess/${zhEarlyAccessFont}.css`}
                    rel="stylesheet preload"
                    as="style"
                />
            )}
        </For>
    )
}

export default AppHead;
