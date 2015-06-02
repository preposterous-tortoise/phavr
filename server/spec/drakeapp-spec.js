var drakeapp = require("../server.js");
var request = require('request');
var frisby = require("frisby");

//test might fail due to expired token, check on that.

var favorr

describe("Authentication!", function () {

	frisby.create('Authentication')
	  .post("http://localhost:3000/auth/facebook/token?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU")
	  .expectStatus(201)
	.toss();
  
}); 

describe("Create A Favor!", function () {

	frisby.create('Make A Favor')
	  .post("http://localhost:3000/api/requests/create?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU",
	    {"topic":"lol4", "tags": "lol4", "description":"lol4","place_name":"Hack Reactor","address":"944 Market Street #8, San Francisco, CA 94102, United States","icon":"http://frit-talk.com/mobile/2/endirect.png","location":{"A": 37.783724, "F": -122.40897799999999}}
	  	)
	  .expectStatus(200)
	  .expectHeader('Content-Type', 'application/json; charset=utf-8')
	  .afterJSON(function (body) {
	          console.log("THIS IS INSIDE BODY DOG! "+JSON.stringify(body));
	          favorr = JSON.stringify(body);
	        })
	.toss();
  
});

describe("Testing an upVote", function () {

	frisby.create('Make A Favor')
	  .post("http://localhost:3000/api/requests/create?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU",
	    {"topic":"lol4", "tags": "lol4", "description":"lol4","place_name":"Hack Reactor","address":"944 Market Street #8, San Francisco, CA 94102, United States","icon":"http://frit-talk.com/mobile/2/endirect.png","location":{"A": 37.783724, "F": -122.40897799999999}}
	  	)
	  .expectStatus(200)
	  .expectHeader('Content-Type', 'application/json; charset=utf-8')
	  .afterJSON(function (body) {
	  		frisby.create('Upvote')
	  		  .post("http://localhost:3000/api/votes/upVote?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU",
	  		  	{ favor: {"_id": body._id}, vote: 1 }
	  		  	)
	  		  .expectStatus(200)
	  		  .expectHeader('Content-Type', 'text/html; charset=utf-8')
	  		  .afterJSON(function (body) {
	  		          //changed values
	  		          expect(body).toMatch(1);
	  		        })
	  		.toss();
	          
	        })
	.toss();

	// frisby.create('Upvote')
	//   .post("http://localhost:3000/api/votes/upVote?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU",
	//   	{ favor: {"_id":"556ca405e30393ac1cc6148f","topic":"yo","description":"yo","place_name":"Hack Reactor","address":"944 Market Street #8, San Francisco, CA 94102, United States","user_id":1,"icon":"http://frit-talk.com/mobile/2/endirect.png","votes":0,"isPrivate":false,"__v":0,"createdAt":"2015-06-01T18:27:17.510Z","loc":{"coordinates":[-122.40897799999999,37.783724],"type":"Point"},"$$hashKey":"object:14"}, vote: 1 }
	//   	)
	//   .expectStatus(200)
	//   .expectHeader('Content-Type', 'text/html; charset=utf-8')
	//   .afterJSON(function (body) {
	//           //changed values
	//           expect(body).toMatch(0);
	//         })
	// .toss();
  
});

describe("Testing a downVote", function () {

	// frisby.create('downVote')
	//   .post("http://localhost:3000/api/votes/upVote?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU",
	//   	{ favor: {"_id":"556ca405e30393ac1cc6148f","topic":"yo","description":"yo","place_name":"Hack Reactor","address":"944 Market Street #8, San Francisco, CA 94102, United States","user_id":1,"icon":"http://frit-talk.com/mobile/2/endirect.png","votes":0,"isPrivate":false,"__v":0,"createdAt":"2015-06-01T18:27:17.510Z","loc":{"coordinates":[-122.40897799999999,37.783724],"type":"Point"},"$$hashKey":"object:14"}, vote: -1 }
	//   	)
	//   .expectStatus(200)
	//   .expectHeader('Content-Type', 'text/html; charset=utf-8')
	//   .afterJSON(function (body) {
	//           //changed values
	//           expect(body).toMatch(0);
	//         })
	// .toss();

	frisby.create('Make A Favor')
	  .post("http://localhost:3000/api/requests/create?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU",
	    {"topic":"lol4", "tags": "lol4", "description":"lol4","place_name":"Hack Reactor","address":"944 Market Street #8, San Francisco, CA 94102, United States","icon":"http://frit-talk.com/mobile/2/endirect.png","location":{"A": 37.783724, "F": -122.40897799999999}}
	  	)
	  .expectStatus(200)
	  .expectHeader('Content-Type', 'application/json; charset=utf-8')
	  .afterJSON(function (body) {
	  		frisby.create('Downvote')
	  		  .post("http://localhost:3000/api/votes/upVote?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU",
	  		  	{ favor: {"_id": body._id}, vote: -1 }
	  		  	)
	  		  .expectStatus(200)
	  		  .expectHeader('Content-Type', 'text/html; charset=utf-8')
	  		  .afterJSON(function (body) {
	  		          //changed values
	  		          expect(body).toMatch(-1);
	  		        })
	  		.toss();
	          
	        })
	.toss();
  
});

describe("Testing Photo", function () {

	frisby.create('Dummy Photo')
	  .post("http://localhost:3000/api/photos/create-dummy?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU",
	  	{"favor_id":"556ca405e30393ac1cc6148f", "url":"www/example.com"}
	  	)
	  .expectStatus(201)
	  .afterJSON(function (body) {
	          //changed values
	          console.log("THIS IS FOR DUMMY PHOTO!!!! "+JSON.stringify(body));
	        })
	.toss();
  
});

describe("Photo Upload", function () {

	frisby.create('Dummy Photo')
	  .get("http://localhost:3000/photoUploads/uploadToS3/",
	  	{ query:{"fileName":"yoyo.jpg"}}
	  	)
	  .expectStatus(500)
	.toss();
  
});

describe("Testing a downVote Photo", function () {

	frisby.create('Dummy Photo')
	  .post("http://localhost:3000/api/photos/create-dummy?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU",
	  	{"favor_id":"556ca405e30393ac1cc6148f", "url":"www/example.com"}
	  	)
	  .expectStatus(201)
	  .afterJSON(function (body) {
	  		frisby.create('Downvote')
	  		  .post("http://localhost:3000/api/votes/upVotePhoto?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU",
	  		  	{ photo: {"_id": body._id}, vote: -1 }
	  		  	)
	  		  .expectStatus(200)
	  		  .afterJSON(function (body) {
	  		          //changed values
	  		          expect(body).toMatch(-1);
	  		        })
	  		.toss();
	          
	        })
	.toss();
  
});

describe("Testing an UpVote Photo", function () {

	frisby.create('Dummy Photo')
	  .post("http://localhost:3000/api/photos/create-dummy?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU",
	  	{"favor_id":"556ca405e30393ac1cc6148f", "url":"www/example.com"}
	  	)
	  .expectStatus(201)
	  .afterJSON(function (body) {
	  		frisby.create('Downvote')
	  		  .post("http://localhost:3000/api/votes/upVotePhoto?access_token=CAAUhHz7c2VoBAHdARERGW4UkcUpCCmUnzf8oDLUyzWGlqZCKklFJa9sfwaqBkirZCsmbozPlpL0271S4NGrd76GpZACFMi6jDtcskXe85Sg46lLuyr6Yj1PtcWMi1q1xt02xGOX3IrZARMSUQaWHKNyWKORQp3u9ucNDSHFHEjHUhr8OcunU",
	  		  	{ photo: {"_id": body._id}, vote: 1 }
	  		  	)
	  		  .expectStatus(200)
	  		  .afterJSON(function (body) {
	  		          //changed values
	  		          expect(body).toMatch(1);
	  		        })
	  		.toss();
	          
	        })
	.toss();
  
});





