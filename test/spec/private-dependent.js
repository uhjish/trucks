var expect = require('chai').expect
  , fs = require('fs')
  , trucks = require('../../lib');

describe('trucks:', function() {

  it('should compile component with private dependency', function(done) {
    const src = 'test/fixtures/private-dependent/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'private-dependent'
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const generated = state.result.generate;

        expect(state.result.templates).to.be.an('array').to.have.length(2);
        expect(state.result.styles).to.be.an('array').to.have.length(2);
        expect(state.result.scripts).to.be.an('array').to.have.length(2);

        // NOTE: assert that dependency is declared first

        expect(state.result.templates[0].contents).to.eql(
          '<template id="x-icon"></template>');
        expect(state.result.templates[1].contents).to.eql(
          '<template id="x-button"></template>');

        expect(state.result.styles[0].contents).to.eql('x-icon {}');
        expect(state.result.styles[1].contents).to.eql('x-button {}');

        expect(state.result.scripts[0].contents).to.eql(
          'skate.define(\'x-icon\', {});');
        expect(state.result.scripts[1].contents).to.eql(
          'skate.define(\'x-button\', {});');

        expect(generated.javascript)
          .to.eql(
            fs.readFileSync(
              'test/expect/private-dependent-javascript.js')
                .toString().trim());

        expect(generated.stylesheet)
          .to.eql(
            fs.readFileSync(
              'test/expect/private-dependent-stylesheet.css')
                .toString().trim());

        done();
      }
    );
  });

});
