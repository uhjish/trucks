var expect = require('chai').expect
  , fs = require('fs')
  , trucks = require('../../../../src');

describe('less:', function() {

  it('should process inline styles', function(done) {
    const src = 'test/fixtures/less-inline/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'less-inline',
        transforms: [require('../../src')]
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const expected = fs.readFileSync(
          'test/expect/simple-component.css')
            .toString().trim();

        const css = 'target/less-inline.css';
        expect(fs.readFileSync(css).toString().trim())
          .to.eql(expected);

        done();
      }
    );
  });

});