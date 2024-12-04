import type { AbortPromise, Executor } from "./types";

/**
 * Wraps a promise with abort functionality, allowing it to be canceled through an `AbortController`.
 * 用于包装一个带有中止功能的 Promise，使其可以通过 `AbortController` 进行取消。
 *
 * @template T - The type of the resolved value of the promise.
 * @template T - Promise 的解析值的类型。
 *
 * @param {Executor<T> | PromiseLike<T>} executor - The promise executor or a promise-like object to be wrapped.
 * @param {Executor<T> | PromiseLike<T>} executor - 要包装的 Promise 执行器或类似 Promise 的对象。
 *
 * @param {AbortController} controller - The `AbortController` to manage the abort signal for the promise.
 * @param {AbortController} controller - 用于管理 Promise 中止信号的 `AbortController`。
 *
 * @returns {AbortPromise<T>} - A proxy promise with additional abort functionality.
 * @returns {AbortPromise<T>} - 带有额外中止功能的代理 Promise。
 *
 * @property {function} abort - Aborts the promise by triggering the `AbortController`.
 * @property {function} abort - 通过触发 `AbortController` 中止 Promise。
 *
 * @property {AbortController} controller - The controller associated with the promise.
 * @property {AbortController} controller - 与 Promise 关联的控制器。
 *
 * @property {AbortSignal} signal - The abort signal from the controller.
 * @property {AbortSignal} signal - 来自控制器的中止信号。
 *
 * @property {Promise} promise - The original wrapped promise.
 * @property {Promise} promise - 原始包装的 Promise。
 *
 * @property {function} then - Allows chaining `then` calls on the promise.
 * @property {function} then - 允许对 Promise 链式调用 `then` 方法。
 */
export const abortPromise = <T>(executor:
  Executor<T> | PromiseLike<T>,
  controller: AbortController): AbortPromise<T> => {
  const promise = (executor instanceof Promise) ? executor : new Promise<T>((resolve, reject) => {
    (executor as Executor<T>)(resolve, reject);
  });
  return new Proxy(promise, {
    get: (target, prop) => {
      switch (prop) {
        case 'abort':
          return () => {
            controller.abort();
          };
        case 'controller':
          return controller;
        case 'signal':
          return controller.signal;
        case 'promise':
          return promise;
        case 'then':
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          return (...args: any[]) => {
            return target.then(...args);
          }
        default:
          return Reflect.get(target, prop);
      }
    }
  }) as AbortPromise<T>;
}
