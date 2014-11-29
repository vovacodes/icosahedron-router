// setup dependencies
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

var sinon = require('sinon');
var sandbox = sinon.sandbox.create();

var IcosahedronRouter = require('../icosahedron-router');

function generateRandomNumericString() {
  return Math.floor(Math.random() * 1000).toString();
}

describe('IcosahedronRouter', function() {

  after(function() {
    window.location.hash = '';
  });

  afterEach(function() {
    Backbone.history.stop();
  });

  describe('when a route is configured with a function', function() {

    it('should call this function and pass params to it', function() {
      // given
      var routeHandler = sandbox.stub();
      var router = new IcosahedronRouter({
        routes: {
          'foo/:param': routeHandler
        }
      });
      var param = generateRandomNumericString();
      Backbone.history.start();

      // when
      router.navigate('foo/' + param, true);

      // then
      routeHandler.should.has.been.calledWith(param);
    });

  });

  describe('when a route is configured with an own property name', function() {

    it('should call router\'s own method that has this name and pass params to it', function() {
      // given
      var routeHandler = sandbox.stub();
      var Router = IcosahedronRouter.extend({
        routes: {
          'foo/:param': 'bar'
        },
        bar: routeHandler
      });
      var param = generateRandomNumericString();
      var router = new Router();
      Backbone.history.start();

      // when
      router.navigate('foo/' + param, true);

      // then
      routeHandler.should.has.been.calledWith(param);
    });

  });

  describe('when a router\'s controller set and a route is configured with a controller\'s method name', function() {

    it('should call controller\'s method with the context of controller and pass route params to it', function() {
      // given
      var routeHandler = sandbox.stub();
      var controller = {
        qux: routeHandler
      }
      var Router = IcosahedronRouter.extend({
        controller: controller,
        routes: {
          'foo/:param': 'qux'
        }
      });
      var param = generateRandomNumericString();
      var router = new Router();
      Backbone.history.start();

      // when
      router.navigate('foo/' + param, true);

      // then
      routeHandler.should.has.been.calledOn(controller);
      routeHandler.should.has.been.calledWith(param);
    });

  });

  describe('when a "beforeRoute" is overridden', function() {

    it('should call route handler after "beforeRoute" logic is "done"', function() {
      // given
      var routeHandler = sandbox.stub();
      var beforeRouteLogic = sandbox.stub();
      var Router = IcosahedronRouter.extend({
        routes: {
          'foo/:param': routeHandler
        },
        beforeRoute: function(done) {
          beforeRouteLogic();
          done();
        }
      });
      var param = generateRandomNumericString();
      var router = new Router();
      Backbone.history.start();

      // when
      router.navigate('foo/' + param, true);

      // then
      beforeRouteLogic.should.has.been.calledBefore(routeHandler);
      routeHandler.should.has.been.calledWith(param);
    });

    it('should not call route handler if "done" callback is not called', function() {
      // given
      var routeHandler = sandbox.stub();
      var beforeRouteLogic = sandbox.stub();
      var Router = IcosahedronRouter.extend({
        routes: {
          'foo': routeHandler
        },
        beforeRoute: function(done) {
          beforeRouteLogic();
          // done() is not called
        }
      });
      var router = new Router();
      Backbone.history.start();

      // when
      router.navigate('foo', true);

      // then
      beforeRouteLogic.should.have.been.calledOnce;
      routeHandler.should.not.have.been.called;
    });

  });

});
