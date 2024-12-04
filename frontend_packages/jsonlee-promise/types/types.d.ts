export interface AbortPromise<T> extends Promise<T> {
    abort: () => void;
    controller: AbortController;
    signal: AbortSignal;
    promise: Promise<T>;
}
export type Executor<T> = (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void;
