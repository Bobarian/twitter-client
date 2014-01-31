dataGrab()

function dataGrab() {
	$.ajax({
	  url: "/api/retrieveTweets/abcd",
	  data: {
	  	page: 3
	  },
	  type: "GET",
	  success: function(tweetData) {
	    insertData(tweetData);
	    insertLightBoxData(tweetData);
	    //insertTopReTweeterData(tweetData);
	    reTweeters(tweetData);
	    locationTracker(tweetData);
  		}
	})
}

function insertData(JSONdata) {
	
	for (var i = 0; i < JSONdata.statuses.length; i++) {
		
		$("#tweetList").append(JST.tweetObject({ counter: i, status: JSONdata.statuses[i] }));
	};
	var userList = new List('myList', options);	 
}


function reTweeters(allTweets) {
	var upperReTweets = allTweets.statuses;
	
	upperReTweets.sort(function (a, b) {
		if (a.retweet_count > b.retweet_count)
			return -1;
		if (a.retweet_count < b.retweet_count)
			return 1;
		//a must be equal to b
		return 0;
	});

	for (var t = 0; t < upperReTweets.length; t++) {
		if (upperReTweets[t].retweet_count > 10) {
			$("#topTweeters").append(JST.topTweeter({ status: upperReTweets[t] }))
		}
	}
}

function locationTracker(allTweets) {
	var locTrack = {};
	for (var t = 0; t < allTweets.statuses.length; t++) {
			//debugger;
			var locCheck = allTweets.statuses[t].user.location
				if (locTrack.hasOwnProperty(locCheck) == true) {
					locTrack[locCheck]++
				}
				else {
					locTrack[allTweets.statuses[t].user.location] = 1
				}
	}

	locOrder = []
	for (key in locTrack) {
		locOrder.push({location: key, count: locTrack[key]});
	}

	locOrder.sort(function (first, second) {
		if (first.count > second.count) {
			return -1;
		}
		else if (first.count < second.count) {
			return 1;
		}
		else {
			return 0;
		}

	})
	//debugger;


	for (var l = 0; l < locOrder.length; l++) {
		$("#topLocations").append(JST.topLocations({location: locOrder[l].location, count: locOrder[l].count}))
	}
	//debugger;
}

/*
function insertTopReTweeterData(topReTweets) {
	
	for (var t = 0; t < topReTweets.statuses.length; t++) {
		if (topReTweets.statuses[t].retweet_count > 10) {
			$("#topTweeters").append(JST.topTweeter({ status: topReTweets.statuses[t] }))
			//debugger;
		}

		else {
			console.log("Skipped");
		}
	}
} */

//Used for Sorting
var options = {
  valueNames: [ 'userName', 'time', 'tweet', 'faved', 'reTweet' ]
}


//Lightbox
function insertLightBoxData(boxData) {
	$(document).on('click', '.list-group-item', function() {
		//debugger;
		var x = $(this).attr("ID");
		x = Number(x);
		$('body').append(JST.lightBoxObject({ status: boxData.statuses[x] }));	
   	})
}

$(document).on('click', '#lightbox', function() {
		$('#lightbox').remove();
})

$(document).on('scroll', function() {
	if (window.scrollY + 1000 >= $(document).height()) {
		dataGrab();
		
	}
		console.log("ScrollY:" + window.scrollY)
		console.log("Document Height" + $(document).height())
})


