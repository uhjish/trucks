var expect = require('chai').expect
  , path = require('path')
  , trucks = require('trucks-compiler');

describe('write:', function() {

  it('should write output files', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html'
      , css = 'target/simple.css'
      , js = 'target/simple.js'
      , html = 'target/simple.html';
    trucks(
      {
        files: [src],
        plugins: [
          trucks.SOURCES,
          trucks.TRANSFORM,
          trucks.GENERATE, 
          require('../../src')
        ],
        css: css,
        js: js,
        html: html,
        manifest: true
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        expect(state.output).to.be.an('object');

        const manifest = state.manifest;

        const htmlFile = path.join(process.cwd(), html)
            , cssFile = path.join(process.cwd(), css)
            , jsFile = path.join(process.cwd(), js);

        expect(manifest[htmlFile].checksum).to.be.a('string');
        expect(manifest[cssFile].checksum).to.be.a('string');
        expect(manifest[jsFile].checksum).to.be.a('string');

        done();
      }
    );
  });

});
