/**
 * Module dependencies.
 */

var express = require('express')
  , restrict = require('lib/utils').restrict
  , api = require('lib/db-api')
  , log = require('debug')('democracyos:citizen');

var app = module.exports = express();

app.get('/citizen/all', restrict, function (req, res) {
  log('Request /citizen/all');

  api.citizen.all(function(err, citizens) {
    if (err) return _handleError(err, req, res);

    log('Serving citizens %j', pluck(citizens, 'id'));
    res.json(citizens);
  });
});

app.get('/citizen/me', restrict, function (req, res) {
  log('Request /citizen/me');

  log('Serving citizen %j', req.user.id);
  res.json(req.user);

});

app.get('/citizen/search', restrict, function (req, res) {
  var q = req.param('q');

  log('Request /citizen/search %j', q);

  api.citizen.search(q, function(err, citizens) {
    if (err) return _handleError(err, req, res);

    log('Serving citizens %j', pluck(citizens, 'id'));
    res.json(citizens);
  })
});

app.get('/citizen/lookup', function (req, res) {
  var ids = req.param('ids');

  log('Request /citizen/lookup %j', ids);

  if (!ids) return log('Cannot process without ids'), res.json(500,{});

  api.citizen.lookup(ids.split(','), function(err, citizens) {
    if (err) return _handleError(err, req, res);

    log('Serving citizens %j', pluck(citizens, 'id'));
    res.json(citizens);
  })
});

// This is a temporary hack while lookinf for a better solution to
// this error: 414 Request-URI Too Large
app.post('/citizen/lookup', function (req, res) {
  var ids = req.param('ids');

  log('Request /citizen/lookup %j', ids);

  if (!ids) return log('Cannot process without ids'), res.json(500,{});

  api.citizen.lookup(ids, function(err, citizens) {
    if (err) return _handleError(err, req, res);

    log('Serving citizens %j', pluck(citizens, 'id'));
    res.json(citizens);
  })
});

app.get('/citizen/:id', restrict, function (req, res) {
  log('Request /citizen/%s', req.params.id);

  api.citizen.get(req.params.id, function (err, citizen) {
    if (err) return _handleError(err, req, res);
  
    log('Serving citizen %j', citizen.id);
    res.json(citizen);
  });
});

function _handleError (err, req, res) {
  res.format({
    html: function() {
      // this should be handled better!
      // maybe with flash or even an
      // error page.
      log('Error found with html request %j', err);
      res.redirect('back');
    },
    json: function() {
      log("Error found: %j", err);
      res.json({ error: err });
    }
  })
}

/**
 * Map array of objects by `property`
 *
 * @param {Array} source array of objects to map
 * @param {String} property to map from objects
 * @return {Array} array of listed properties
 * @api private
 */

function pluck (source, property) {
  return source.map(function(item) { return item[property]; });
};