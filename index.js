var sleep = function (time, i) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('WANGHT' + i);
        }, time);
    })
};

var start = async function () {
    // 在这里使用起来就像同步代码那样直观
    console.log('start');
    var x4 = await sleep(3000, '4');
    console.log(x4);
    var x3 = await sleep(3000, '3');
    console.log(x3);
    var x2 = await sleep(3000, '2');
    console.log(x2);
    var x1 = await sleep(3000, '1');
    console.log(x1);
};

start();

console.log('end');