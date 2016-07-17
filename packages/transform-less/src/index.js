const MIME = 'text/less';

/**
 *  @private
 */
module.exports = function less(/*state*/) {
  const processor = require('less');

  function style(node, cb) {
    if(node.type === MIME) {

      processor.render(
        node.contents,
        { filename: node.file || node.parent.file },
        (err, res) => {
          if(err) {
            return cb(err); 
          }
          node.contents = res.css;
          cb()
        }
      );
    
    }else{
      cb();
    }
  }

  return {
    'Style': style
  }
}