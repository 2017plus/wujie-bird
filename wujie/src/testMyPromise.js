
// BEGIN test pomise.then
// const p = new MyPromise((resolve, reject) => {
//     resolve('123')
// })

// let promise2 = p.then(() => {
//     console.log('00000');
//     return promise2
// })


// const pro = new Promise((res, rej) => {
//     setTimeout(() => {
//         rej('pro rejected')
//         res('pro resolved')
//     }, 300);
// })
// console.log('Promise', pro);
// const proThen1 = pro.then((data) => {
//     console.log('----Promise', pro);
//     console.log('----resolve', data);
//     return proThen1;
// }, (reason) => {
//     console.log('====reject', reason);
//     console.log('====Promise', pro);
// })

// const proThen2 = pro.then((data) => {
//     console.log('----Promise', pro);
//     console.log('----resolve', data);

// }, (reason) => {
//     console.log('====reject', reason);
//     console.log('====Promise', pro);
// })

// setTimeout(() => {
//     console.log(proThen1, proThen2);
// }, 1000);

// const mypro = new MyPromise((res, rej) => {
//     setTimeout(() => {
//         res('my pro resolved')
//     }, 300);
// })
// console.log('myPromise', mypro);
// const myproThen1 = mypro.then((data) => {
//     console.log('----myResolve', data);
//     return new MyPromise((res, rej) => {
//         setTimeout(() => {
//             rej('then1 rejected')
//         }, 300);
//     })
// }, (reason) => {
//     console.log('====myReject', reason);
// }).then((data) => {
//     console.log('then1-2----myResolve', data);
// }, (reason) => {
//     console.log('then1-2====myReject', reason);
// })


// setTimeout(() => {
//     console.log('====myproThen1', myproThen1);
// }, 1000);

// END

// BEGIN test finally
const pro = new MyPromise((res, rej) => {
    setTimeout(() => {
        rej('pro return')
    }, 300);
})

const proThen = pro
.then((data) => {
    console.log('then', data);
    return 'proThen success'
})
.catch(err => {
    console.log('catch', err);
})
.finally(() => {
    return MyPromise.reject('finallyReturn')
})
.finally(()=>{
    return MyPromise.reject('finallyReturn2')
})

setTimeout(() => {
    console.log('pro', pro);
    console.log('proThen', proThen);
}, 500);
// END test finally

// BEGIN test catch
// const pro = new MyPromise((res, rej) => {
//     setTimeout(() => {
//         rej('return pro rej')
//     }, 300);
// })

// const proThen = pro.then((data) => {
//     console.log('then', data);
//     return 'proThen success'
// }).catch(err => {
//     console.log('catch', err);
//     return 'catch pro rej, return suceess'
// })

// setTimeout(() => {
//     console.log('pro', pro);
//     console.log('proThen', proThen);
// }, 500);
// END test catch

// BEGIN test static resove reject
// const myThen123 = MyPromise.reject('MyPromise123').then((data) => {
//     console.log(data, 'data======')
//     return data;
// }, (err) => {
//     console.log(err, 'err======')
//     return err;
// });

// console.log('my', myThen123)

// const then123 = Promise.reject('Promise123').then((data) => {
//     console.log(data, 'data!!!!!')
//     return data;
// }, (err) => {
//     console.log(err, 'err!!!!!')
//     return err;
// })

// console.log('--', then123)

// setTimeout(() => {
//     myThen123.then((data) => console.log('myresolve', data), (err) => console.log('myreject', err))
//     then123.then((data) => console.log('resolve', data), (err) => console.log('reject', err))
// }, 500);
// END test static resove reject

// BEGIN test static all
// const alls = Promise.all([
//     new Promise((res) => {
//         setTimeout(() => {
//             res('0-')
//         }, Math.random() * 10000);
//     }),
//     1,
//     new Promise((res) => {
//         setTimeout(() => {
//             res('2b')
//         }, Math.random() * 10000);
//     }),
//     '3',
//     4,
//     Promise.resolve('5'),
//     6,
//     '7',
//     8,
//     new Promise((res) => {
//         setTimeout(() => {
//             res('9i')
//         }, Math.random() * 10000);
//     }),
//     10
// ])

// const myalls = MyPromise.all([
//     new MyPromise((res) => {
//         setTimeout(() => {
//             res('0-')
//         }, Math.random() * 4000);
//     }),
//     1,
// new MyPromise((res, rej) => {
//     setTimeout(() => {
//         res('2b')
//     }, Math.random() * 10000);
// }),
// '3',
// 4,
// MyPromise.resolve('5'),
// 6,
// '7',
// 8,
// new MyPromise((res) => {
//     setTimeout(() => {
//         res('9i')
//     }, Math.random() * 7000);
// }),
10
// ])

// console.log('-----alls', alls.then(
//     (data) => console.log('resolve   alls', data),
//     (err) => console.log('reject', err))
// );

// console.log('-----myalls', myalls.then(
//     (data) => console.log('resolve Myalls', data),
//     (err) => console.log('reject Myalls', err)
// ));
// END test static all

//BEGIN test static race
// const proRace = Promise.race([
//     new Promise((res) => {
//         setTimeout(() => {
//             res('1a')
//         }, Math.random() * 5000);
//     }),
//     new Promise((res) => {
//         setTimeout(() => {
//             res('2b')
//         }, Math.random() * 5000);
//     }),
//     new Promise((res) => {
//         setTimeout(() => {
//             res('3c')
//         }, Math.random() * 5000);
//     }),
// ])
// console.log('-----race', proRace.then(
//     (data) => console.log('resolve', data),
//     (err) => console.log('reject', err)));

// const myproRace = MyPromise.race([
//     new MyPromise((res) => {
//         setTimeout(() => {
//             res('1a')
//         }, 5000);
//     }),
//     new MyPromise((res) => {
//         setTimeout(() => {
//             res('2b')
//         }, 1600);
//     }),
//     new MyPromise((res) => {
//         setTimeout(() => {
//             res('3c')
//         }, 600);
//     }),
// ])
// console.log('-----race', myproRace.then(
//     (data) => console.log('myresolve', data),
//     (err) => console.log('myreject', err)));

// setTimeout(() => {
//     console.log(proRace, myproRace);
// }, 3000);
// END test static race

//BEGIN test static allSettled
// const proAllSettled = Promise.allSettled([
//     new Promise((res) => {
//         setTimeout(() => {
//             res('0a')
//         }, 3000);
//     }),
//     new Promise((res, rej) => {
//         setTimeout(() => {
//             rej('1b')
//         }, 1600);
//     }),
//     new Promise((res) => {
//         setTimeout(() => {
//             res('2c')
//         }, 4000);
//     }),
//     new Promise((res) => {
//         setTimeout(() => {
//             res('3d')
//         }, 2000);
//     }),
// ])
// console.log('-----allSettled', proAllSettled.then(
//     (data) => console.log('resolve', JSON.stringify(data)),
//     (err) => console.log('reject', err)));

// const myProAllSettled = MyPromise.allSettled([
//     new MyPromise((res) => {
//         setTimeout(() => {
//             res('0a')
//         }, 3000);
//     }),
//     new MyPromise((res, rej) => {
//         setTimeout(() => {
//             rej('1b')
//         }, 1600);
//     }),
//     new MyPromise((res) => {
//         setTimeout(() => {
//             res('2c')
//         }, 4000);
//     }),
//     new MyPromise((res) => {
//         setTimeout(() => {
//             res('3d')
//         }, 2000);
//     }),
// ])
// console.log('-----myallSettled', myProAllSettled.then(
//     (data) => console.log('myresolve', JSON.stringify(data)),
//     (err) => console.log('myreject', err)));
// END test static allSettled

// BEGIN test static any
// const alls = MyPromise.any([
//     new MyPromise((res,rej) => {
//         setTimeout(() => {
//             rej('0-')
//         }, Math.random() * 5000);
//     }),
//     new MyPromise((res,rej) => {
//         setTimeout(() => {
//             rej('2b')
//         }, Math.random() * 5000);
//     }),
//     MyPromise.reject('5'),
//     new MyPromise((res,rej) => {
//         setTimeout(() => {
//             rej('9i')
//         }, Math.random() * 5000);
//     }),
// ])

// console.log('-----alls', alls.then(
//     (data) => console.log('resolve   alls', data),
//     (err) => console.log('reject', err))
// );

// END test static any