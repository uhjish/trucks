var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('parse:', function() {

  it('should parse external partial', function(done) {
    const src = '../../test/fixtures/external-partial/components.html';

    trucks(
      {
        files: [src],
        plugins: [trucks.LOAD, require('../../src'), trucks.TRANSFORM],
        out: 'target',
        name: 'external-partial'
      },
      (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const file = state.tree.imports[0]
            , mod = file.imports[0].modules[0]
            , component = mod.component;

        // all styles for the module
        expect(mod.stylesheets.length).to.eql(3);

        // global scope module styles
        expect(mod.styles.length).to.eql(1);

        // local component scope styles
        expect(component.styles.length).to.eql(2);

        // list of all templates on the module
        expect(mod.templates).to.be.an('array')
          .to.have.length(2);

        expect(component).to.be.an('object');

        // primary template trait
        expect(component.template).to.be.an('object');

        // list of template partials
        expect(component.partials).to.be.an('array')
          .to.have.length(1);

        expect(component.template).to.equal(mod.templates[0]);
        expect(component.partials[0]).to.equal(mod.templates[1]);

        done();
      }
    );
  });

});
