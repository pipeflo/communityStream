var https = require('https')
	, removeMd = require('remove-markdown')
	, watson = require('watson-developer-cloud')
	;

module.exports = {
	personalidad: function (req, res) {

		var textoPlano = removeMd(req.body.texto);

		var personality_insights = watson.personality_insights({
			username: '40579161-202d-4dca-b436-eaa6e41cc674',
			password: 'a8w5ABMrAJCk',
			version: 'v2'
		});

		console.log("Texto plano::", textoPlano);

		personality_insights.profile({
  			text: textoPlano,
  			language: 'es' },
  			function (err, response) {
			    if (err)
			      console.log('error en personalidad:', err);
			    else {
			      console.log("PERSONALIDAD:::", JSON.stringify(response, null, 2));
			      res.status(200).json(JSON.stringify(response, null, 2));
			    }
			}
		);
	}
}