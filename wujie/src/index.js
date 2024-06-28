// const fs = require('fs')
const co =  require('co');

// function* doStuff() {
//   yield fs.readFile( 'E:\\codes\\wujie-bird\\wujie\\src\\hello.txt', (err,data)=>{console.log(data.toString(), err);return data || err});
//   yield fs.readFile( 'E:\\codes\\wujie-bird\\wujie\\src\\world.txt', (err,data)=>{console.log(data.toLocaleString(), err);return data || err});
//   yield fs.readFile( 'E:\\codes\\wujie-bird\\wujie\\src\\and-such.txt', (err,data)=>{console.log(data, err);return data || err});
// }

// const read = doStuff();
// console.log(read.next());
// console.log(read.next());
// console.log(read.next());
// console.log(read.next());

// var thunkify = require('thunkify');

// var readThunk = thunkify(fs.readFile);
// readThunk('E:\\codes\\wujie-bird\\wujie\\package.json')(function(err, str){
//   // ...
//   console.log(str.toString())
// });

// var readFileThunk = thunkify(fs.readFile);

// var gen = function* (){
//   var r1 = yield readFileThunk('E:\\codes\\wujie-bird\\wujie\\package.json');
//   console.log(r1.toString());
//   var r2 = yield readFileThunk('E:\\codes\\wujie-bird\\wujie\\src\\world.txt');
//   console.log(r2.toString());
// };

// var g = gen();

// var r1 = g.next();
// console.log(r1);
// r1.value(function (err, data) {
//   if (err) throw err;
//   var r2 = g.next(data);
//   console.log(r2);
//   r2.value(function (err, data) {
//     if (err) throw err;
//     g.next(data);
//   });
// });

// function run(fn) {
//   var gen = fn();

//   function next(err, data) {
//     var result = gen.next(data);
//     if (result.done) return;
//     result.value(next);
//   }

//   next();
// }

// var g = function* (){
//   var f1 = yield readFileThunk('E:\\codes\\wujie-bird\\wujie\\babel.config.json');
//   console.log(f1.toString());
//   var f2 = yield readFileThunk('E:\\codes\\wujie-bird\\wujie\\package.json');
//   console.log(f1.toString());

//   var fn = yield readFileThunk('E:\\codes\\wujie-bird\\wujie\\src\\hello.txt');
//   console.log(fn.toString());

// };

// run(g);




// var g = gen();

// g.next().value.then(function(data){
//   g.next('123').value.then(function(data){
//     console.log(g.next('456'));
//   });
// });

const fs = require('fs')

var readFile = function (fileName){
  return new Promise(function (resolve, reject){
    fs.readFile(fileName, function(error, data){
      if (error) return reject(error);
      resolve(data);
    });
  });
};

var gen = function* (){
  var f1 = yield readFile('E:\\codes\\wujie-bird\\wujie\\babel.config.json');
  var f2 = yield readFile('E:\\codes\\wujie-bird\\wujie\\package.json');
  console.log(f1.toString());
  console.log(f2.toString());
};


co(gen).then(()=>{
  console.log('流程全部跑完了')
})

function comock(gen) {
  var ctx = this;

  function isPromise(pro) {
    return typeof pro ==='object' && pro && typeof pro.then === 'function'
  }

  function toPromise(pro) {
    if(isPromise(pro)){
      return pro
    }
    return Promise.resolve(pro);
  }

  

  return new Promise(function(resolve, reject) {
    if (typeof gen === 'function') gen = gen.call(ctx);
    if (!gen || typeof gen.next !== 'function') return resolve(gen);

    onFulfilled();

    function next(ret) {
      if (ret.done) return resolve(ret.value);
      var value = toPromise.call(ctx, ret.value);
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
      return onRejected(
        new TypeError(
          'You may only yield a function, promise, generator, array, or object, '
          + 'but the following object was passed: "'
          + String(ret.value)
          + '"'
        )
      );
    }

    function onFulfilled(res) {
      console.log('-000,',res);
      var ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }

    function onRejected(e) {
        return reject(e);
    }
  });
}


// 数组的写法
comock(function* () {
  var res = yield [
    new Promise((resolve)=>{
      setTimeout(() => {
        resolve(1)
      }, 1000);
    }),
    new Promise((resolve)=>{
      setTimeout(() => {
        resolve(2)
      }, 2000);
    }),
  ];
  console.log('====res====',res);
}).catch(console.log);