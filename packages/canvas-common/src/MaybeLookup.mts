import Bug from "./Bug.mts";

class MaybeLookup<T> {
    readonly proxy: T;

    constructor(
        lookup: Partial<T>,
        private scope?: string,
    ) {
        this.proxy = new Proxy(lookup as Readonly<T>, { get: this.getOrThrow.bind(this) });
    }

    private getOrThrow(target: Readonly<T>, _prop: string | symbol) {
        const prop = _prop as unknown as keyof T;

        if (Object.hasOwn(target, prop)) {
            return target[prop] as any;
        }

        try {
            throw new Bug(`Invalid key: ${String(prop)}`, { __scope: this.scope })
        }
        catch (error) {
            if (error instanceof Bug) {
                throw error;
            }
            else {
                throw new Bug(`Invalid key`, { __scope: this.scope })
            }
        }
    }

    public get() {
        return this.proxy;
    }
}

export default MaybeLookup;
