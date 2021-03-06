var trucks = require('../../packages/trucks-compiler/src/index');

trucks(
  {
    files: ['documents/compiler/components.html'],
    plugins: [
      trucks.LOAD,
      trucks.PARSE,
      trucks.TRANSFORM,
      trucks.GENERATE
    ],
    transforms: ['trim', 'skate/src'],
    out: 'target',
    force: true
  }, 
  (err, state) => {
    if(err) {
      throw err; 
    }

    console.dir(state.output);
  }
);
