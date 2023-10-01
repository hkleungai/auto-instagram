class Bug extends Error {
    constructor(
        message?: string,
        options?: ErrorOptions & { __scope?: string }
    ) {
        const scopedMessage = options?.__scope ? `--${options?.__scope}-- ${message}` : message;
        delete options?.__scope;
        super(scopedMessage, options);
    }
}

export default Bug;
