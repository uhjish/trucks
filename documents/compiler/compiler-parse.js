var trucks = require('../../packages/trucks-compiler/src/index');

trucks(
  {
    files: ['documents/compiler/components.html'],
    plugins: [trucks.LOAD, trucks.PARSE],
    out: 'target',
    force: true
  },
  (err, state) => {
    if(err) {
      throw err; 
    }

    console.dir(
      state.tree.imports[0].imports[0].modules[0]);
  }
);
