var express = require('express')
	, router = express.Router()
	, resetTokenCtrl = require('../controllers/resetToken')
	, jwt = require('jsonwebtoken')
	;

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){
	
	router
	.get('/', passport.authenticate('ibm-connections-cloud', {
	    session: false
	}))
	.get('/callback', passport.authenticate('ibm-connections-cloud', {
	    failureRedirect: '/account/login',
	    session: false
	}), function(req, res, next){
		res.status(200).json(req.user);
	    //console.log('Cliente autenticado con datos: ', req.user);
	    //res.render('home', { user: req.user });
	})
	.get('/resettoken', isLoggedIn, function(req, res){
		console.log('Entro a la ruta para pedir nuevo token');
		resetTokenCtrl.reset(req, res);
	});

	return router;
}

function isLoggedIn(req, res, next) {
    
    var token = req.body.token || req.headers['x-access-token'];

    // decode token
 	if (token) {
 		// verifies secret and checks exp
 		jwt.verify(token, 'IBMConnectionsCloud.01012016', function(err, decoded) {
 			if (err) {
				return res.status(403).send({
					success: false,
					message: 'Failed to authenticate token.'
				});
		 	} else {
		 		// if everything is good, save to request for use in other routes
		 		req.user = decoded;
		 		return next();

		 	}
 		});

 	} else {

		// if there is no token
		// return an HTTP response of 403 (access forbidden) and an error message
		return res.status(401).send({
			success: false,
			message: 'No token provided.'
		});
	}
}