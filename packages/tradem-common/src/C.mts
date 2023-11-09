namespace C { // Utilitiy idea from C lang deserves an namespace :)
    class AssertionError extends Error {
        constructor(message?: string, options?: ErrorOptions) {
            super(message, options);
            this.name = 'AssertionError';
        }
    }

    export function assert(condition: false, message: string, options?: ErrorOptions): never;
    export function assert(condition: any, message: string, options?: ErrorOptions): asserts condition;
    export function assert(condition: any, message: string, options?: ErrorOptions) {
        if (!condition) {
            throw new AssertionError(message, options);
        }
    }
};

export default C;
