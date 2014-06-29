# pull-error-mapper

Map pull-stream errors.

Pull-streams, will automatically send your errors downstream.

Errors should be handled in Sinks or in Through streams.

This module, creates a Through stream that can map errors. You can whether `map` errors or handle them.

## Usage

### errorMapper(mapper)

`mapper` is a function that should map or handle the error. If the function returns something, `errorMapper` will send
the returned error downstream. If it returns `null` or `undefined` (basically nothing), the error would be considered
as handled and the Through stream will read once again.

## Example

```js
var pull = require("pull-stream");
var errorMapper = require("pull-error-mapper");

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
```

## install

With [npm](https://npmjs.org) do:

```
npm install pull-error-mapper
```

## license

MIT