var drakeapp = require("../server.js");
var request = require('request');
var frisby = require("frisby");

//test might fail due to expired token, check on that.

describe("My First Test!", function () {

	frisby.create('Authentication')
	  .post("http://localhost:3000/auth/facebook/token?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU")
	  .expectStatus(201)
	.toss();
  
}); 

describe("Testing an upVote", function () {

	frisby.create('Upvote')
	  .post("http://localhost:3000/api/votes/upVote?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU",
	  	{ favor: {"_id":"556ca405e30393ac1cc6148f","topic":"yo","description":"yo","place_name":"Hack Reactor","address":"944 Market Street #8, San Francisco, CA 94102, United States","user_id":1,"icon":"http://frit-talk.com/mobile/2/endirect.png","votes":0,"isPrivate":false,"__v":0,"createdAt":"2015-06-01T18:27:17.510Z","loc":{"coordinates":[-122.40897799999999,37.783724],"type":"Point"},"$$hashKey":"object:14"}, vote: 1 }
	  	)
	  .expectStatus(200)
	  .expectHeader('Content-Type', 'text/html; charset=utf-8')
	  .afterJSON(function (body) {
	          //changed values
	          expect(body).toMatch(0);
	        })
	.toss();
  
});

describe("Testing a downVote", function () {

	frisby.create('downVote')
	  .post("http://localhost:3000/api/votes/upVote?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU",
	  	{ favor: {"_id":"556ca405e30393ac1cc6148f","topic":"yo","description":"yo","place_name":"Hack Reactor","address":"944 Market Street #8, San Francisco, CA 94102, United States","user_id":1,"icon":"http://frit-talk.com/mobile/2/endirect.png","votes":0,"isPrivate":false,"__v":0,"createdAt":"2015-06-01T18:27:17.510Z","loc":{"coordinates":[-122.40897799999999,37.783724],"type":"Point"},"$$hashKey":"object:14"}, vote: -1 }
	  	)
	  .expectStatus(200)
	  .expectHeader('Content-Type', 'text/html; charset=utf-8')
	  .afterJSON(function (body) {
	          //changed values
	          expect(body).toMatch(0);
	        })
	.toss();
  
});





