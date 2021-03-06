/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Token = mongoose.model('Token')
  , log = require('debug')('democracyos:db-api:token');


/**
 * Get single token from ObjectId or HexString
 *
 * @param {Mixed} id ObjectId or HexString for token
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'token' single token object found or `undefined`
 * @return {Module} `token` module
 * @api public
 */

exports.get = function get (id, fn) {
  log('Looking for token %j', id)
  Token.findById(id, function (err, token) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    }

    log('Delivering token %j', token);
    fn(null, token);
  })
  return this;
};

/**
 * Create password reset Token for a citizen
 *
 * @param {Object} citizen object for which the
 * password reset Token is created.
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'token' single token object created or `undefined`
 * @return {Module} `token` module
 * @api public
 */

exports.createPasswordResetToken = function createPasswordResetToken(citizen, meta, fn) {
  log('Creating new password reset token for citizen %j', citizen);
  return createToken(citizen, meta, 'password-reset', fn);
};


/**
 * Create email validation Token for a citizen
 *
 * @param {Object} citizen object for which the
 * email validation Token is created.
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'token' single token object created or `undefined`
 * @return {Module} `token` module
 * @api public
 */

exports.createEmailValidationToken = function createEmailValidationToken(citizen, meta, fn) {
  log('Creating new email validation token for citizen %j', citizen);
  return createToken(citizen, meta, 'email-validation', fn);
};


function createToken(citizen, meta, scope, fn) {
  log('Removing all tokens for citizen %j', citizen);
  Token.remove({user : citizen._id}, function(err){
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };
    log('Creating new token for citizen %j, meta %j, scope %s', citizen, meta, scope);
    var token = new Token({
      user : citizen,
      scope : scope,
      meta: meta
    });

    token.save(function (err, saved) {
      if (err) {
        return log('Found error %j', err), fn(err);
      };

      log('Delivering token %j', saved);
      fn(null, saved);
    });
  });
  return this;
};


/**
 * Map array of objects by `property`
 *
 * @param {Array} source array of objects to map
 * @param {String} property to map from objects
 * @return {Array} array of listed properties
 * @api private
 */

function mapByProperty (source, property) {
  return source.map(function(item) { return item[prop]; });
}