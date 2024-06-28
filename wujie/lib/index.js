function f(v) {
    console.log(this);
    return v > this.age;
}

// const f = (v) => {
//     console.log(this)
//     return v > this.age;
// }
let person = { name: 'John', age: 20 };
console.log([10, 12, 26, 15].find(f, person));; // 26

let arr = [1,,];
for (let i of arr) {
    console.log(1);
}
// 1
// 1