const path = require('path')
    , fs = require('fs')
    , cli = require('mkcli')
    , pkg = require('../package.json')
    , prg = cli.load(require('../doc/json/trucks.json'))
    , trucks = require('trucks');

// override package name
pkg.name = 'trucks';

/**
 *  @name trucks
 *  @cli doc/cli/trucks.md
 */
function main(argv, conf, cb) {

  /* istanbul ignore if: always pass argv in test env */
  if(typeof argv === 'function') {
    cb = argv;
    argv = null;
  }

  /* istanbul ignore next: never pass conf in test env */
  if(typeof conf === 'function') {
    cb = conf;
    conf = null;
  }

  /* istanbul ignore next: always pass conf in test env */
  conf = conf || {};
  /* istanbul ignore next: never print to stdout in test env */
  conf.output = conf.output || process.stdout;
  /* istanbul ignore next: never read from stdin in test env */
  conf.input = conf.input || process.stdin;

  var opts = {}
    , help = require('mkcli/plugin/help')
    , runtime = {
        base: path.normalize(path.join(__dirname, '..')),
        target: opts,
        hints: prg,
        multiple: prg,
        help: {
          file: 'doc/help/trucks.txt',
          output: conf.output
        },
        version: {
          name: pkg.name,
          version: pkg.version,
          output: conf.output
        },
        plugins: [
          require('mkcli/plugin/hints'),
          require('mkcli/plugin/argv'),
          require('mkcli/plugin/multiple'),
          help,
          require('mkcli/plugin/version')
        ]
      };

  cli.run(prg, argv, runtime, function parsed(err, req) {
    if(err || req.aborted) {
      return cb(err); 
    }

    let plugins = [];

    if((this.printImports || this.printTree) && this.printManifest) {
      return cb(
        new Error(
          'incompatible printers for tree and manifest, check arguments')); 
    }

    if(this.printImports || this.printTree) {
      plugins = [
        this.printTree ? trucks.SOURCES : trucks.LOAD, trucks.TRANSFORM];
      this.transforms = ['tree'];
    }

    if(plugins.length) {
      this.plugins = plugins;
    }

    this.files = req.unparsed;

    this.transforms = this.transforms.reduce((prev, next) => {
      if(~next.indexOf(',')) {
        next = next.split(/\s*,\s*/); 
      }
      return prev.concat(next); 
    }, [])

    if(this.printManifest && !this.manifest) {
      this.manifest = true; 
    }

    /* istanbul ignore next: don't want to write to cwd in test env */
    if(!this.out) {
      this.out = process.cwd();
    }

    trucks(this, (err, state) => {
      if(err) {
        return cb(err); 
      }

      if(this.printImports || this.printTree) {
        conf.output.write(state.result.tree.toString()); 
      }

      if(state.manifest) {
        var contents = JSON.stringify(state.manifest, undefined, 2) + '\n';
        if(this.printManifest) {
          conf.output.write(contents);
        }

        if(this.manifest === String(this.manifest)) {
          var filepath = state.absolute(this.manifest, this.out);
          fs.writeFile(filepath, contents, function(err) {
            if(err) {
              return cb(err); 
            }

            cb(null, state);
          });
        }else{
          cb(null, state);
        }
      }else{
        cb(null, state);
      }

    });
  })
}

main.pkg = pkg;

module.exports = main;
