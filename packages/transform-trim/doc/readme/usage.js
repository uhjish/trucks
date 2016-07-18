const trucks = require('../../../../lib/index');

trucks(
  {
    files: ['example/components.html'],
    transforms: ['trim'],
    conf: {
      transforms: {
        trim: {
          lines: false
        } 
      }
    }
  }, (err, res) => {
    if(err) {
      throw err; 
    }
    console.log(res);
  }
);
