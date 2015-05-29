var  FacebookTokenStrategy = require('passport-facebook-token');
var request = require("request");
var db = require('../db');
var configAuth = require('./auth.js');


/**
 * Passport configuration
 * @method exports
 * @param {} passport
 */
module.exports = function(passport) {

	passport.use(new FacebookTokenStrategy({
		//set clientID and clientSecret (from facebook app settings)
		clientID : process.env.ClientID || configAuth.facebookAuth.clientID,
		clientSecret : process.env.ClientSecret || configAuth.facebookAuth.clientSecret
	}, function(accessToken, refereshToken, profile, done) {

		//find or create user who just logged in
		db.User.findOrCreate({where: {fbID: profile.id, fbName: profile.displayName, fbEmail: profile.emails[0].value, fbPicture: profile.photos[0].value }})
			.then(function(user){

				user[0].updateAttributes({fbToken: accessToken})
				// db.User.update({fbToken: accessToken}, {where:{fbID: profile.id}})
					.then( function(){
						// request("https://graph.facebook.com/me/friends?access_token="+accessToken, function(error, response, body) {
						// 	//after making fb api call, store list of friends fbid in results
						// 	console.log("frineds---------------------------------------");
						// 	console.log(JSON.parse(body).data);
						// 	console.log("frineds---------------------------------------");


						// 	var results = JSON.parse(body).data.map(function(user){

						// 		return user.id;
						// 	});					
						// 	//store friends of user in database
						// 	results.forEach(function(ele){
						// 		db.FriendsList.findOrCreate({where:{friendAiD:profile.id.toString(), friendBiD:ele}});
						// 	});
						// });

						return done(null, user);
					})
			});

	}
	));
}

