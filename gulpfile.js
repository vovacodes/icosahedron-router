'use strict';

var browserify = require('browserify');
var eos = require('end-of-stream');
var fs = require('fs');
var gulp = require('gulp');
var http = require('http');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var send = require('send');

var SPECS_ENTRY_POINT = './spec/specs.js';
var JS_SPECS_BUNDLE_DEST_FILE = './spec/specs-bundle.js';

var server;

gulp.task('specs:browserify', function() {
  return browserify(SPECS_ENTRY_POINT, { debug: true }).bundle()
      .pipe(fs.createWriteStream(JS_SPECS_BUNDLE_DEST_FILE, 'utf8'));
});

// starts local webserver for serving static
gulp.task('webserver', ['specs:browserify'], function webserver(done) {
  server = http.createServer(function(req, res) {
    send(req, req.url, {
      root: __dirname
    }).pipe(res);
  }).listen(9999, function connected() {
    done();
  });
});

// runs mocha tests on the PhantomJS
gulp.task('specs', ['webserver'], function test() {
  var stream = mochaPhantomJS();

  // shutdown the webserver after finishing tests
  eos(stream, function() {
    server.close();
  });

  stream.write({ path: 'http://0.0.0.0:9999/spec/specRunner.html' });
  stream.end();

  return stream;
});