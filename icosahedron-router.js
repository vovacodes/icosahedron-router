'use strict';

var result = require('amp-result');
var ampHistory = require('ampersand-router/ampersand-history');
var Router = require('ampersand-router');

var IcosahedronRouter = Router.extend({

  initialize: function() {},

  constructor: function constructor(options) {
    options || (options = {});

    if (options.controller) this.controller = options.controller;
    if (options.routes) this.routes = options.routes;

    this.history = options.history || ampHistory;
    this.routes = result(this, 'routes');
    this._bindRoutes();

    this.initialize.apply(this, arguments);
  },

  execute: function execute(callback, args) {
    this.beforeRoute(function done() {
      callback && callback.apply(this, args);
    }.bind(this));
  },

  /**
   *  Override in subclasses to have a custom pre-route logic.
   *  Support async implementations, just call a <code>done</code> callback when you are done.
   *  Warning! Route handler won't be executed until <code>beforeRoute</code> is done.
   *
   *  @param {Function} done signals that logic is done.
   */
  beforeRoute: function beforeRoute(done) {
    done && done();
  },

  _bindRoutes: function _bindRoutes() {
    if (!this.routes) return;

    Object.keys(this.routes).forEach(function(route) {
      var callback = this.routes[route];

      if (!callback) return;

      if ((typeof callback === 'function') || (typeof this[callback] === 'function')) {
        // standard Backbone.Router behavior
        this.route(route, callback);
      } else {
        // handle a situation with mapping of routes to the controller's methods names
        this.route(route, callback, function() {
          if (this.controller && (typeof this.controller[callback] === 'function')) {
            this.controller[callback].apply(this.controller, arguments);
          }
        }.bind(this));
      }

    }.bind(this));
  }

});

module.exports = IcosahedronRouter;
