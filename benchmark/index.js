var benchmark = require('benchmark');
var fs = require('fs');
var colors = require('colors');
var log = "";

// Start up

var cheddar = (function(cheddar) {
    var f;
    if (process.argv.indexOf('--debug') > -1) {
        f = function(code) {
            return function() {
                cheddar(code, {
                    PRINT: function(value) { log += value }
                });
            }
        };
    } else {
        f = function(code) {
            return function() {
                cheddar(code, {
                    PRINT: function() {}
                });
            }
        }
    }
    f.stdlib = cheddar.stdlib;
    return f;
}(require('../')));

var api = cheddar.stdlib;

function leftPad(string, num) {
    return string + " ".repeat(Math.max(num - string.length, 0));
}

function rightPad(string, num) {
    return " ".repeat(Math.max(num - string.length, 0)) + string;
}

function longestItem(self, key, func) {
    var nameLen = 0;
    for (var i = 0; i < self.length; i++) {
        if (func)
            nameLen = Math.max(func(self[i][key]).length, nameLen)
        else
            nameLen = Math.max(self[i][key].toString().length, nameLen);
    }
    return nameLen;
}

function prettyNum(val, pad) {
    var fast = 4500;
    var slow = 900;
    var color = 'yellow';

    if (val >= fast) color = 'green';
    if (val <= slow) color = 'red';

    return rightPad(benchmark.formatNumber(val)[color], pad);
}

function Bench(name, args) {
    if (typeof args === "string") {

    } else {
        var suite = new benchmark.Suite(name);
        for (var i = 0; i < args.length; i++) {
            if (typeof args[i][1] === 'function') {
                suite.add(args[i][0], args[i][1]);
            } else {
                suite.add(args[i][0], cheddar(args[i][1]));
            }
        }

        suite.on('complete', function() {
            console.log(name.bold);

            var test;
            var indent = '  ';

            // Determine longest name
            var nameLen = longestItem(this, 'name');
            var hzLen = longestItem(this, 'hz', function(item) {
                return benchmark.formatNumber(item | 0);
            });
            var longestError = longestItem(this, 'stats', function(item) {
                return item.moe.toFixed(2);
            });
            var longestTime = longestItem(this, 'stats', function(item) {
                return ( item.mean * 1000 ).toFixed(2);
            });
            var longestCycles = longestItem(this, 'cycles');

            var totalLen = Math.max(longestTime, longestCycles);

            var avgSize = 7;

            for (var i = 0; i < this.length; i++) {
                test = this[i];

                var ops = test.hz | 0;
                
                console.log(
                    indent + "✓".green + " "
                    + leftPad(test.name, nameLen)
                    + " x ".dim + prettyNum(ops, hzLen).bold + " ops/sec "
                    + "± ".dim + leftPad(test.stats.moe.toFixed(2) + "%", longestError + 1 )
                );

                console.log(
                    " " + indent + indent + leftPad("Average", avgSize) + ": ".dim + leftPad((test.stats.mean * 1000).toFixed(2), totalLen) + " ms".dim + '\n' +
                    " " + indent + indent + leftPad("Cycles" , avgSize) + ": ".dim + leftPad(test.cycles, totalLen) + " total".dim
                );
            }

            console.log('');
        }).run();
    }
}

// Bench("Boot Up", "");
Bench("Literal Parsing", [
    [ "Numbers", "1" ],
    [ "String", "'foo'" ],
    [ "Symbol", "@test" ],
    [ "Array", "[1, 2, 3]" ],
]);

Bench("Unwrapped Literal Creation (init)", [
    [ "string", () => api.init(api.string, "Hello, World!") ],
    [ "number", () => api.init(api.number, 10, 0, 1) ],
    [ "array",  () => api.init(api.array, api.init(api.number, 10, 0, 1), api.init(api.number, 10, 0, 2), api.init(api.number, 10, 0, 3)) ]
]);

Bench("Unwrapped Literal Creation (init)", [
    [ "string", () => {
        var o = new api.string(null);
        o.init("Hello, World!");
    }],
    [ "number", () => {
        var o = new api.number(null);
        o.init(10, 0, 10);
    }]
]);

Bench("Call stack cycle time", [
    ["binary", "1 + 1" ]
]);

Bench("Prime Generation", [
    [ ".primes  (< 1000)", "Math.primes(1000);" ],
    [ ".isprime (< 1000)", "let i = 0; for ( let a = []; a.length < 1000; i += 1) { if (Math.isPrime(i)) { a.push(i) } }" ],
    [ "Native   (< 1000)", fs.readFileSync(__dirname + "/prime.cheddar", "utf-8") ],

    [ ".primes  (= 1000)", "Math.primes(1000, true);" ]
]);

process.stdout.write(log);
