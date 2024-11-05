# abortPromise
### 简介

`abortPromise` 是一个用于创建带有取消功能的 Promise 的实用工具。通过将 `AbortController` 集成到 Promise 中，这个工具允许开发者在需要时手动取消 `Promise`，提供更灵活的异步任务控制。

使用方法

`abortPromise` 接收两个参数：

1. executor：可以是一个 PromiseLike<T> 对象，或一个 Executor<T> 函数。后者在提供的 resolve 和 reject 参数上执行，来创建一个新的 Promise。
2. controller：一个 AbortController 实例，用于在 Promise 上执行取消操作。

返回值是一个 AbortPromise，该对象是对 Promise 的代理，扩展了控制属性和方法。

代码示例

```typescript
import { abortPromise } from './path-to-abortPromise';
const controller = new AbortController();

const myPromise = abortPromise((resolve, reject) => {
  setTimeout(() => resolve('任务完成'), 5000);
}, controller);

// 调用取消
myPromise.abort();
```

API

-	abort(): 取消 Promise 执行。
-	controller: 访问传入的 AbortController。
-	signal: 访问 AbortController 的信号对象。
-	promise: 访问创建的 Promise 对象，用于链式调用等操作。
-	then: 代理的 then 方法，允许对 Promise 继续链式调用。


## 英文文档:

Introduction

abortPromise is a utility for creating Promises with abort capabilities. Integrating an AbortController with a Promise, this utility lets developers manually cancel the Promise if needed, offering more control over asynchronous operations.

Usage

abortPromise takes two parameters:

1. executor: Can be a PromiseLike<T> object or an Executor<T> function, which executes on provided resolve and reject arguments to create a new Promise.
2. controller: An instance of AbortController, which can cancel the Promise operation.

The return value is an AbortPromise, a proxy of the original Promise with additional control properties and methods.

Example

```typescript
import { abortPromise } from './path-to-abortPromise';
const controller = new AbortController();

const myPromise = abortPromise((resolve, reject) => {
  setTimeout(() => resolve('Task completed'), 5000);
}, controller);

// Call to abort
myPromise.abort();
```

API

-	abort(): Cancels the Promise execution.
-	controller: Accesses the provided AbortController.
-	signal: Accesses the signal from the AbortController.
-	promise: Accesses the underlying Promise for chaining or other operations.
-	then: A proxied then method allowing further chaining.
