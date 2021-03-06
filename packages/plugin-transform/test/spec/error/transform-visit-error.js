var expect = require('chai').expect
  , trucks = require('trucks-compiler');

describe('transform:', function() {

  it('should callback with thrown error (visitor)', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
  
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'transform-plugin',
        plugins: [
          trucks.SOURCES, 
          trucks.GENERATE, 
          require('../../../src')
        ],
        transforms: [
          function visit() {
            return {
              'Module': function() {
                throw new Error('mock error');
              }
            }
          }
        ]
      },
      (err) => {
        function fn() {
          throw err;
        }

        expect(fn).throws(/mock error/);
        done();
      }
    );
  });

  it('should callback with callback error (visitor)', function(done) {
    const src = '../../test/fixtures/simple-inline/components.html';
  
    trucks(
      {
        files: [src],
        out: 'target',
        name: 'transform-plugin',
        plugins: [
          trucks.SOURCES, 
          trucks.GENERATE, 
          require('../../../src')
        ],
        transforms: [
          function visit() {
            return {
              'Module': function(node, cb) {
                cb(new Error('mock error'));
              }
            }
          }
        ]
      },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/mock error/);
        done();
      }
    );
  });

});
