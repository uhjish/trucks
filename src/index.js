const load = require('./load')
  , parse = require('./parse')
  , transform = require('./transform');

/**
 *  Compile component HTML files to CSS and Javascript.
 *
 *  @function trucks
 *  @param (Object) opts processing options.
 *  @param {Function} cb callback function.
 *
 *  @option {Array} files list of HTML files to compile.
 */
function trucks(opts, cb) {
  opts = opts || {};

  load(opts, (err, contents) => {
    if(err) {
      return cb(err); 
    } 
    parse(contents, (err, result) => {
      if(err) {
        return cb(err); 
      }
      transform(result, (err, compiled) => {
        cb(null, compiled);
      });
    });
  })
}

trucks.load = load;
trucks.parse = parse;
trucks.transform = transform;

module.exports = trucks;
