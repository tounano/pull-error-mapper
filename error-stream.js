var pull = require("pull-stream");

module.exports = pull.Through( function (read, map) {
  return function next (end, cb) {
    read(end, function (end, data) {
      if (end === true) return cb(end);
      if (end) {
        var mapped = map(end);
        if (!mapped)
          return next(null, cb);

        cb(end);
      }

      return cb(end, data);
    })
  }
})