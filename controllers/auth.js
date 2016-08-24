var https = require('https')
	, querystring = require('querystring')
	, jwt = require('jsonwebtoken')
	;

module.exports = {
	reset: function (req, res) {

		var post_data = querystring.stringify({
			'grant_type' : 'refresh_token',
			'client_id': 'app_20051314_1464998684769',
			'client_secret': 'b6f926dc282a27c3431fd3d6733417a3981429b054a7d960a7d123085a291da1da9d4c6fdb3fb07ebbd83ca220e482bf1d6bef3fb782de9c8ce18021cf3c9657c5c9eaaa9cdbb16b5e00ab062a178983ee28eb5b780a4dad35e07282a83ff81776dc122f1659b6d5d7cbc8e474708401067bbe8e26c71afe3668a70fb79771d',
			'refresh_token' : req.user.oauthConnections.refreshToken
		});

		var options = {
			hostname: 'apps.na.collabserv.com',
  			port: 443,
  			path: '/manage/oauth2/token',
  			method: 'POST',
  			headers: {
  				'Content-Type': 'application/x-www-form-urlencoded'
  				, 'Content-Length': Buffer.byteLength(post_data)
  			}
		};

		var req = https.request(options, function(respuesta) {
			var body = '';
		  	respuesta.on('data', (d) => {
		    	body += d;
		  	}).on('end', function(){
		  		if (respuesta.statusCode == 200) {
		  			var parsed = JSON.parse(body);

		  			req.user.oauthConnections = {
		                accessToken: parsed.accessToken,
		                refreshToken: parsed.refreshToken,
		                params: {
		                	'issued_on': parsed.issued_on,
		                	'expires_in': parsed.expires_in,
		                	'token_type': parsed.token_type
		                }
		            };

		            var token = jwt.sign(profile, 'IBMConnectionsCloud.01012016', {
		                expiresIn: '12h' // expires in 2 hours
		            });

		            var user = {
		                displayName : req.user.displayName,
		                email: req.user.emails[0].value,
		                token: token
		            };
		  			
			        res.status(200).json(user);
			        return;
		  		} else {
		  			console.log('status message', respuesta.statusMessage);
		  			res.status(respuesta.statusCode).send(body);
		  		}
	  			
		  	});
		});
		req.write(post_data);
		req.end();

		req.on('error', (e) => {
			console.error(e);
		  	res.status(500).json({
	        	"message": "Error buscando información, por favor intente de nuevo!"
	        });
		});

	}
	, getToken: function (req, res) {

		var post_data = querystring.stringify({
			'code' : req.body.code,
			'grant_type': 'authorization_code',
			//'client_id': 'app_20051314_1467062050771',
			//'client_secret': 'f6750e520ca3c8bad241c7ad72f1e65cbe8c2517a37b8a76d672a1a7b0aaeb1238c64a6e2c695065fa1cffb2e9390a797a880670cec24ede74c9e9605fc65cbbac1b53e53485af112d45a4d1779311907a2bb2fc21c17d87484c5b7749dfec73e55dc3daf3c0a149a44c5657a755940d434f7a1933543873f491081402de2c1',
			//'callback_uri' : 'https://connectionsapp.mybluemix.net/#/auth/ibm-connections-cloud/callback'
			'client_id': 'app_20051314_1464998684769',
			'client_secret': 'b6f926dc282a27c3431fd3d6733417a3981429b054a7d960a7d123085a291da1da9d4c6fdb3fb07ebbd83ca220e482bf1d6bef3fb782de9c8ce18021cf3c9657c5c9eaaa9cdbb16b5e00ab062a178983ee28eb5b780a4dad35e07282a83ff81776dc122f1659b6d5d7cbc8e474708401067bbe8e26c71afe3668a70fb79771d',
			'callback_uri' : 'https://localhost:3000/#/auth/ibm-connections-cloud/callback'
		});

		var options = {
			hostname: 'apps.na.collabserv.com',
  			port: 443,
  			path: '/manage/oauth2/token',
  			method: 'POST',
  			headers: {
  				'Content-Type': 'application/x-www-form-urlencoded'
  				, 'Content-Length': Buffer.byteLength(post_data)
  			}
		};

		var req = https.request(options, function(respuesta) {
			
			var body = '';
		  	respuesta.on('data', (d) => {
		    	body += d;
		  	}).on('end', function(){
		  		if (respuesta.statusCode == 200) {
		  			
		  			var partido = body.split("&");

		  			console.log("BODY::::",body);

		  			req.oauthConnections = {
		                accessToken: partido[0].split("=")[1],
		                refreshToken: partido[1].split("=")[1],
		                params: {
		                	'issued_on': partido[2].split("=")[1],
		                	'expires_in': partido[3].split("=")[1],
		                	'token_type': partido[4].split("=")[1]
		                }
		            };

		            var token = jwt.sign(req.oauthConnections, 'IBMConnectionsCloud.01012016', {
		                expiresIn: '12h' // expires in 2 hours
		            });

			        res.status(200).json(token);
			        return;
		  		} else {
		  			console.log('status message', respuesta.statusMessage);
		  			res.status(respuesta.statusCode).send(body);
		  		}
	  			
		  	});
		});
		req.write(post_data);
		req.end();

		req.on('error', (e) => {
			console.error(e);
		  	res.status(500).json({
	        	"message": "Error buscando información, por favor intente de nuevo!"
	        });
		});

	}
}