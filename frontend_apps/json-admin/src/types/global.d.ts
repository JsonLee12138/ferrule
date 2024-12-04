export type PropertyKey = string | number | symbol;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type AnyObject<T extends PropertyKey = PropertyKey> = Record<T, any>;

export type BaseType = string | number | boolean | null | undefined;
