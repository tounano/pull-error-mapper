var pull = require("pull-stream");
var errorMapper = require("../");

var randomErrorStream = pull.Through( function (read) {
  return function (end, cb) {
    read(end, function (end, data) {
      if (end) return cb(end);

      if (Math.round(Math.random()*3) === 0)
        return cb(new Error("Dummy Error"));

      cb(end, data);
    })
  }
})

// Without ErrorMapper
pull(
  pull.values([1,2,3,4,5,6]),
  randomErrorStream(),
  pull.drain(console.log)
)

/*
  Result: (won't continue sinking after an error happened
  1
  2
 */

// With ErrorMapper
console.log("\n=======\n");
pull(
  pull.values([1,2,3,4,5,6]),
  randomErrorStream(),
  errorMapper(console.error),
  pull.drain(console.log)
)

/*
  Result: (kept sinking even 4 generated an error)
 1
 2
 3
 5
 6
 [Error: Dummy Error]
 */
