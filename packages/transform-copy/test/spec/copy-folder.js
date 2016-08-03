var expect = require('chai').expect
  , trucks = require('../../../../src');

describe('copy:', function() {

  it('should copy folder', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'copy-folder',
        transforms: [require('../../src')],
        copy: {
          files: {
            'test/fixtures/assets': 'assets'
          }
        }
      }, (err, state) => {
        expect(err).to.eql(null);
        expect(state).to.be.an('object');

        const file = state.getFile('assets/css/styles.css', 'target');
        expect(file).to.be.an('object');
        expect(file.getContents()).to.be.an('array').to.have.length(1);
        done();
      }
    );
  });

});