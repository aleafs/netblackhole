/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */

//var should = require('should');

describe('net blackhole', function () {

  var Blackhole = require('../').create(10241, {
    'maxQueuedMsgs' : 20,
  });

  it('should_blackhole_does_not_reply_any_time', function (done) {
    done();
  });

});

