/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */

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

  return _me;
};

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

  require('net').createServer(_conf, function (c) {
    console.log(c);
    _msgs.push({
      'evt' : 'connected',
    });

    c.on('data', function (data) {
      _msgs.push({
        'evt' : 'data',
      });
    });

    c.on('end', function () {
      _msgs.push({
        'evt' : 'end',
      });
    });
  }).listen(port, function () {
    console.log('NetBlackHole listened at "' + port + '"');
  });

  var _me   = {};
  _me.msgs  = function () {
    return _msgs.all();
  };

  return _me;
};

