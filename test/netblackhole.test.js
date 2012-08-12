/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */

var should = require('should');
var urllib = require('urllib');

describe('net blackhole', function () {

  /**
   * @ a fake http server
   */
  var _http = require('../').create(10241, {
    'maxQueuedMsgs' : 20,
  });

  beforeEach(function () {
    _http.clean();
  });

  /* {{{ should_blackhole_does_not_reply_any_time() */
  it('should_blackhole_does_not_reply_any_time', function (done) {
    urllib.request('http:/' + '/localhost:10241', {'timeout' : 100}, function (error, data, res) {
      error.should.have.property('code', 'ECONNRESET');
      error.stack.should.include('RequestTimeoutError: socket hang up, request timeout for');

      var _msgs = _http.msgs();
      _msgs.should.have.property('length', 2);
      _msgs.shift().should.have.property('evt', 'connected');

      var _body = _msgs.shift();
      _body.should.have.property('evt', 'data');
      _body.arg.toString().should.include('GET / HTTP/1.1');
      _body.arg.toString().should.include('Host: localhost:10241');

      done();
    });
  });
  /* }}} */

  after(function () {
    _http.close();
  });
});

