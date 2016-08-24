var https = require('https')
	;

module.exports = {
	getStream: function (req, res) {
		var options = {
			hostname: 'apps.na.collabserv.com',
  			port: 443,
  			path: '/connections/opensocial/oauth/rest/activitystreams/@me/@all',
  			method: 'GET',
  			headers: { 'Authorization': 'Bearer ' + req.oauthConnections.accessToken }
		};

		var req = https.request(options, function(respuesta) {
			var body = '';
		  	respuesta.on('data', (d) => {
		    	body += d;
		  	}).on('end', function(){
		  		if (respuesta.statusCode == 200) {
		  			var parsed = JSON.parse(body);
		  			res.status(200).json(parsed);
			        return;
		  		} else {
					res.status(respuesta.statusCode).send(body);
		  		}
		  	});
		});
		req.end();

		req.on('error', (e) => {
			console.error(e);
		  	res.status(500).json({
	        	"message": "Error buscando información, por favor intente de nuevo!"
	        });
		});
	}
	, getCommunityStream: function (req, res) {
		var basicAuth = new Buffer("<usuario connections>:<contraseña>").toString('base64');
		console.log("REQ:::", req.headers);
		console.log("REQ COOKIES:::", req.cookies);
		//console.log('Token BASE 64:::', basicAuth);
		var options = {
			hostname: 'apps.na.collabserv.com',
  			port: 443,
  			path: '/connections/opensocial/basic/rest/activitystreams/urn:lsid:lconn.ibm.com:communities.community:' + req.params.communityId + '/@all',
  			method: 'GET',
  			headers: { 'Authorization': 'Basic ' + basicAuth }
		};

		var req = https.request(options, function(respuesta) {
			var body = '';
		  	respuesta.on('data', (d) => {
		    	body += d;
		  	}).on('end', function(){
		  		if (respuesta.statusCode == 200) {
		  			var parsed = JSON.parse(body);
		  			res.status(200).json(parsed);
			        return;
		  		} else {
					res.status(respuesta.statusCode).send(body);
		  		}
		  	});
		});
		req.end();

		req.on('error', (e) => {
			console.error(e);
		  	res.status(500).json({
	        	"message": "Error buscando información de stream de comunidad, por favor intente de nuevo!"
	        });
		});
	}
}