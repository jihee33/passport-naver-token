var express = require('express');
var passport = require('passport');
var session = require('express-session');
var NaverTokenStrategy = require('../lib/index.js').Strategy;

var client_id = '************ your app client id ************';
var client_secret = '************ your app client secret ************';
var callback_url = '************ your app callback url ************';

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

passport.use(new NaverTokenStrategy({
    clientID: client_id,
    clientSecret: client_secret,
    callbackURL: callback_url
}, function(accessToken, refreshToken, profile, done) {
		user = {
			provider: 'naver',
			id : profile.id,
			name: profile.name,
			email: profile.email,
			nickName : profile.nickName,
			enc_id : profile.enc_id,
			profile_image : profile.profile_image,
			age : profile.age,
			birthday : profile.birthday,
			naver: profile._json
		};
		return done(null, user);
}));

var app = express();
app.use(passport.initialize());

app.get("/auth/naver/token", passport.authenticate('naver-token', null), function(req, res){
// do something with req.user
	res.send(req.user ? 200 : 401);
});

app.listen(3000);

