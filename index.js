/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */

"use strict";

/* {{{ private sizedqueue() */

var sizedqueue = function (size) {

  var _data = [];
  var _maxn = 1.6 * (size || 1000);

  var _me   = {};
  _me.push  = function (o) {
    var p = _data.push(o);
    if (p > _maxn) {
      _data = _data.slice(_data.length - (size || 1000));
    }

    return _data.length - 1;
  };

  _me.all   = function () {
    return _data;
  };

  _me.clean = function () {
    _data   = [];
  };

  return _me;
};

/* }}} */

exports.create = function (port, options) {

  var _options = {
    'allowHalfOpen' : false,
    'maxQueuedMsgs' : 1000,
  };
  for (var i in options) {
    _options[i] = options[i];
  }

  var _msgs = sizedqueue(_options.maxQueuedMsgs);
  var _conf = {
    'allowHalfOpen' : _options.allowHalfOpen,
  };

  var _evts = {};

  /**
   * @ private server s
   */
  /* {{{ */
  var s = require('net').createServer(_conf, function (c) {
    _evts.conn && (_evts.conn)(c);
    _msgs.push({
      'evt' : 'connected',
    });

    c.on('data', function (data) {
      _evts.data && (_evts.data)(data);
      _msgs.push({
        'evt' : 'data',
        'arg' : data,
      });
    });

    c.on('end', function () {
      _evts.end && (_evts.end)();
      _msgs.push({
        'evt' : 'end',
      });
    });
  });
  s.listen(port, function () {
    console.log('NetBlackHole listened at "' + port + '"');
  });
  /* }}} */

  var _me   = {};

  _me.clean = function () {
    _msgs.clean();
  };

  _me.msgs  = function () {
    return _msgs.all();
  };

  _me.close = function () {
    s.close();
  };

  _me.never_response = function () {
    _evts.conn = function (c) {};
  };

  _me.close_when_connect = function (data) {
    _evts.conn = function (c) {
      c.end(data);
    };
  };

  return _me;
};

