var  IBMConnectionsCloudStrategy = require('passport-ibm-connections-cloud').Strategy
    , IbmConnectionsProfilesService = require('ibm-connections-profiles-service')
    , profiles = new IbmConnectionsProfilesService('http://apps.na.collabserv.com/profiles')
    , jwt = require('jsonwebtoken')
    ;

module.exports = function(passport){

    // setup passport to use this strategy 
    /*passport.use('ibm-connections-cloud', new IBMConnectionsCloudStrategy({
            hostname: 'apps.na.collabserv.com',
            clientID: 'app_20051314_1458026159982',
            clientSecret: 'e899a4421f8f978f837772cbf2a89bb5274bf642781a0a436687cace4877eee19bc0071e61bf2dff9269173e57f2b7c8098f205b306f73395e9b39b4167589ef02a7a27ff6ff3fa88c21e9cca2ef8f76ec14f1d2320a0ec64a6963815b8913358741788140acf5e5d3470bc31f59327cb085d5fbaf83316b26a1fa565eb66',
            callbackURL: 'https://connectionsApp.mybluemix.net/auth/ibm-connections-cloud/callback'
        },*/
    passport.use('ibm-connections-cloud', new IBMConnectionsCloudStrategy({
            hostname: 'apps.na.collabserv.com',
            clientID: 'app_20051314_1464998684769',
            clientSecret: 'b6f926dc282a27c3431fd3d6733417a3981429b054a7d960a7d123085a291da1da9d4c6fdb3fb07ebbd83ca220e482bf1d6bef3fb782de9c8ce18021cf3c9657c5c9eaaa9cdbb16b5e00ab062a178983ee28eb5b780a4dad35e07282a83ff81776dc122f1659b6d5d7cbc8e474708401067bbe8e26c71afe3668a70fb79771d',
            callbackURL: 'https://connectionsapp.mybluemix.net/auth/ibm-connections-cloud/callback'
            //callbackURL: 'https://localhost:3000/auth/ibm-connections-cloud/callback'
        },
        function(accessToken, refreshToken, params, profile, done) {

            profile.oauthConnections = {
                accessToken: accessToken,
                refreshToken: refreshToken,
                params: params
            };

            var token = jwt.sign(profile, 'IBMConnectionsCloud.01012016', {
                expiresIn: '12h' // expires in 12 hours
            });

            var user = {
                displayName : profile.displayName,
                email: profile.emails[0].value,
                token: token
            };

            //console.log("USUARIO",user);

            /*request.get('https://apps.na.collabserv.com/connections/opensocial/rest/activitystreams/@me/@all', function(error, response, body){
                if (!error && response.statusCode == 200) {
                    console.log("Respuesta llamado a APIIII", body) // Show the HTML for the Google homepage. 
                } else {
                    console.log("Error:::", error);
                }
            }).auth(null, null, true, accessToken);*/

            return done(null, user);
        }
    ));    
}