# passport-naver-token
[Passport](http://passportjs.org/) strategy for authenticating with [Naver](http://www.naver.com/) access tokens using the OAuth 2.0 API.

This module lets you authenticate using Naver in your Node.js applications.
By plugging into Passport, Naver authentication can be easily and unobtrusively integrated into any application or framework that supports Connect-style middleware, including [Express](http://expressjs.com/).

It forked from [passport-naver](https://github.com/naver/passport-naver) and refered from [passport-facebook-token](https://github.com/drudge/passport-facebook-token).

##Install
```sh
 $ npm install passport-naver-token
```

## How to Use

#### Sending access_token as a Query parameter
```
GET /auth/naver/token?access_token=[ACCESS_TOKEN]
```

####Authenticate Requests
```js
app.get("/auth/naver/token", passport.authenticate('naver-token', null),
function(req, res, next){
	// do something with req.user 
    res.send(req.user ? 200 : 401);
});
```
