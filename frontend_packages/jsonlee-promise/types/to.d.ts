/**
 * Wraps a promise to handle errors, returning a tuple with the error or result.
 * 用于包装一个 Promise 以处理错误，返回一个包含错误或结果的元组。
 *
 * @template T - The type of the resolved value of the promise.
 * @template T - Promise 的解析值的类型。
 *
 * @param {Promise<[Error | null, T | null]>} p - The promise to handle.
 * @param {Promise<[Error | null, T | null]>} p - 要处理的 Promise。
 *
 * @returns {Promise<[Error | null, T | null]>} - A promise that resolves with a tuple containing either the error or the result.
 * @returns {Promise<[Error | null, T | null]>} - 解析为包含错误或结果的元组的 Promise。
 *
 * @example
 * const [error, result] = await to(someAsyncFunction());
 * if (error) {
 *   // handle error
 * } else {
 *   // use result
 * }
 */
declare const to: <T>(p: Promise<[Error | null, T | null]>) => Promise<unknown[]>;
export default to;
