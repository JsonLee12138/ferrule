export type PropertyKey = string | number | symbol;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject<T extends PropertyKey = PropertyKey> = Record<T, any>;

export type BaseType = string | number | boolean | null | undefined;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FunctionType = (...args: any[]) => void;
