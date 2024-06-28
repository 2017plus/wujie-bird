const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function isPromiseLike(obj) {
    return Boolean(
        obj && typeof obj === "object" && typeof obj.then === "function"
    );
}

function runMicroTask(func) {
    if (typeof func !== "function") {
        return;
    }
    if (typeof process === 'object' && process.nextTick) {
        // node环境放入微队列
        process.nextTick(func);
    } else if (MutationObserver) {
        const ele = document.createElement("div");
        const observer = new MutationObserver(func);
        observer.observe(ele, {
            childList: true,
        });
        ele.innerHTML = new Date().getTime();
    } else {
        setTimeout(func, 0);
    }
}

class MyPromise {

    #state = PENDING;
    #result = undefined
    #handlers = [];


    constructor(func) {
        try {
            func(this.#resolve, this.#reject);
        } catch (error) {
            this.#reject(error)
        }
    }

    #changeStateValue = (newState, newValue) => {
        switch (newState) {
            case PENDING:
                break;
            case FULFILLED:
            case REJECTED:
                this.#state = newState;
                this.#result = newValue;
                break;

            default:
                break;
        }

        this.#runHandlers();
    }

    #resolve = (data) => {
        this.#changeStateValue(FULFILLED, data);
    }

    #reject = (reason) => {
        this.#changeStateValue(REJECTED, reason);
    }

    #runSingleHandler = (callback, thenPromise, newResolve, newReject) => {
        const newSettle = this.#state === FULFILLED ? newResolve : newReject

        runMicroTask(() => {
            if (typeof callback !== 'function') {
                return newSettle(this.#result);
            } else {

                try {
                    const thenResult = callback(this.#result)

                    if (thenPromise === thenResult) {
                        throw TypeError('Chaining cycle detected for promise #<MyPromise>');
                    }

                    if (isPromiseLike(thenResult)) {
                        thenResult.then(newResolve, newReject)
                    } else {
                        newResolve(thenResult)
                    }
                } catch (error) {

                    if (error.message === 'Chaining cycle detected for promise #<MyPromise>') {
                        throw TypeError('Chaining cycle detected for promise #<MyPromise>');
                    } else {
                        newReject(error)
                    }

                }
            }

        })

    }

    #runHandlers = () => {
        if (this.#state === PENDING) {
            return;
        }

        while (this.#handlers[0]) {
            const { onFulfilled, onRejected, thenPromise, newResolve, newReject } = this.#handlers.shift();
            if (this.#state === FULFILLED) {
                this.#runSingleHandler(onFulfilled, thenPromise, newResolve, newReject);
            } else {
                this.#runSingleHandler(onRejected, thenPromise, newResolve, newReject);
            }
        }
    }

    // then始终返回一个promise，去覆盖（透传）之前的
    then = (onFulfilled, onRejected) => {
        const thenPromise = new MyPromise((newResolve, newReject) => {
            setTimeout(() => {
                // 为什么要用setTimeout：利用eventLoop，宏任务，代码块延迟执行，等new完thenPromise，
                // 不然#runSingleHandler(onRejected, thenPromise, newResolve, newReject)中取不到thenPromise会报错
                this.#handlers.push({ onFulfilled, onRejected, thenPromise, newResolve, newReject })
                this.#runHandlers();
            }, 0);
        })

        return thenPromise;
    }

    // catch始终返回一个Promise，去覆盖（透传）之前的。catch就是只有onRejected回调的then
    catch = (failCallback) => {
        return this.then(undefined, failCallback)
    }

    //finally中rejected的内容可以覆盖（透传）之前的, resolved无法覆盖之前的
    finally = (finalCallback) => {
        return this.then(
            (data) => {
                console.log('data,', data);
                return MyPromise.resolve(finalCallback()).then(() => data);
            },
            (reason) => MyPromise.resolve(finalCallback()).then(() => {
                // 此处finalCallback返回rejected时，就不走then，
                // 而finalCallback返回resolved时，then都将之前的rejected内容抛出，就不会透传resolved内容
                throw reason
            })
        )
    }

    static resolve = (value) => {
        if (isPromiseLike(value)) return value;
        return new MyPromise(res => res(value))
    }

    static reject = (reason) => {
        if (isPromiseLike(reason)) return reason;
        return new MyPromise((res, rej) => rej(reason))
    }

    static all = (arr) => {
        return new MyPromise((res, rej) => {
            if (!Array.isArray(arr) || arr.length === 0) {
                return res([]);
            }

            const allResult = [];
            let count = 0;

            for (let index = 0; index < arr.length; index++) {
                const item = arr[index];

                MyPromise.resolve(item).then(
                    (data) => {
                        allResult[index] = data;
                        count++;

                        console.log(count, index, data);

                        if (count === arr.length) {
                            res(allResult)
                        }
                    },
                    (reason) => {
                        return rej(reason)
                    }
                )

            }

        })
    }

    static race = (arr) => {
        return new MyPromise((res, rej) => {
            if (!Array.isArray(arr) || arr.length === 0) {
                return res([]);
            }

            for (const item of arr) {
                MyPromise.resolve(item).then(
                    (data) => {
                        return res(data);
                    },
                    (reason) => {
                        return rej(reason);
                    }
                )
            }


        })
    }

    static any = (arr) => {
        return new MyPromise((res, rej) => {
            if (!Array.isArray(arr) || arr.length === 0) {
                return res([]);
            }

            let count = 0;

            for (let index = 0; index < arr.length; index++) {
                const item = arr[index];

                MyPromise.resolve(item).then(
                    (data) => {
                        return res(data);
                    },
                    () => {
                        if (count === arr.length - 1) {
                            rej('AggregateError: All promises were rejected')
                        }
                        count++;
                    }
                )

            }

        })
    }

    static allSettled = (arr) => {
        return new MyPromise((res, rej) => {
            if (!Array.isArray(arr) || arr.length === 0) {
                return res([]);
            }

            const allResult = [];
            let count = 0;  // 记录添加数据的个数

            const addData = (i, status, value) => {
                allResult[i] = {
                    status: status,
                    value: value,
                };

                if (count === arr.length - 1) {
                    res(allResult)
                }

                count++;
            }

            for (let index = 0; index < arr.length; index++) {
                const item = arr[index];

                MyPromise.resolve(item).then(
                    (data) => addData(index, FULFILLED, data),
                    (reason) => addData(index, REJECTED, reason)
                )

            }

        })
    }

}
