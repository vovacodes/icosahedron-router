var chai = require('chai');
var sinonChai = require('sinon-chai');

chai.should();
chai.use(sinonChai);

mocha.setup('bdd');

require('./icosahedron-router.spec');

if (window.mochaPhantomJS) {
  window.mochaPhantomJS.run();
} else {
  mocha.run();
}