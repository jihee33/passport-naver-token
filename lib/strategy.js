/**
 * Module dependencies.
 */
var util = require('util'),
	OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
	InternalOAuthError = require('passport-oauth').InternalOAuthError;

/**
 * `Strategy` constructor
 */
function Strategy(options, verify) {
	options = options || {};
	options.authorizationURL = options.authorizationURL || 'https://nid.naver.com/oauth2.0/authorize?response_type=code';
	if (options.svcType !== undefined) options.authorizationURL += '&svctype=' + options.svcType;
	if (options.authType !== undefined) options.authorizationURL += '&auth_type=' + options.authType;
	options.tokenURL = options.tokenURL || 'https://nid.naver.com/oauth2.0/token';

    options.scopeSeparator = options.scopeSeparator || ',';
    options.customHeaders = options.customHeaders || {};

    if (!options.customHeaders['User-Agent']) {
        options.customHeaders['User-Agent'] = options.userAgent || 'passport-naver';
    }

	OAuth2Strategy.call(this, options, verify);
	this.name = 'naver-token';
	this._accessTokenField = options.accessTokenField || 'access_token';
	this._refreshTokenField = options.refreshTokenField || 'refresh_token';
	this._passReqToCallback = options.passReqToCallback || false;
	delete this._oauth2._clientSecret;
};
/**
 * Inherit from `OAuthStrategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Inherit from `OAuthStrategy`.
 */
Strategy.prototype.authenticate = function (req, options) {
	var accessToken = req.query[this._accessTokenField];
	var refreshToken = req.query[this._refreshTokenField];
	var self = this;

	if (!accessToken) return this.fail({message: 'You should provide ${this._accessTokenField}'});

	this._loadUserProfile(accessToken, function (error, profile) {
		if (error) return self.error(error);

		var verified = function (error, user, info) {
			if (error) return self.error(error);
			if (!user) return self.fail(info);

			return self.success(user, info);
		};

		if (self._passReqToCallback) {
			self._verify(req, accessToken, refreshToken, profile, verified);
		} else {
			self._verify(accessToken, refreshToken, profile, verified);
		}
	});
};

/**
 * Retrieve user profile from Naver.
 */
Strategy.prototype.userProfile = function(accessToken, done) {
	// Need to use 'Authorization' header to save the access token information
	// If this header is not specified, the access token is passed in GET method.
	this._oauth2.useAuthorizationHeaderforGET(true);

	// User profile API
	var profile_url = 'https://openapi.naver.com/v1/nid/me';
	this._oauth2.get(profile_url, accessToken, function (err, body, res) {
		if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
		try {
			var json = JSON.parse(body);
			var profile = { provider: 'naver' };
			profile.id = json.response.id;
			profile.name = json.response.name;
            profile.email = json.response.email;
			profile.nickName = json.response.nickName;
			profile.enc_id = json.response.enc_id;
			profile.profile_image = json.response.profile_image;
			profile.age = json.response.age;
			profile.birthday = json.response.birthday;
			profile._raw = body;
			profile._json = json;
			done(null, profile);
		} catch(e) {
			done(e);
		}
	});
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;