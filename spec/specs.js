// shim for PhantomJS
require('es5-shim');

var chai = require('chai');
var sinonChai = require('sinon-chai');

chai.should();
chai.use(sinonChai);

require('./icosahedron-router.spec');