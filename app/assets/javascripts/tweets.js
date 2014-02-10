//dataGrab()
var pageNum = 1;
function dataGrab() {
	$.ajax({
	  url: "/api/retrieveTweets/abcd",
	  data: {
	  	page: pageNum
	  },
	  type: "GET",
	  success: function(tweetData) {
	    insertData(tweetData);
	    insertLightBoxData(tweetData);
	    //insertTopReTweeterData(tweetData);
	    //reTweeters(tweetData);
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

/*
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
*/

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
		pageNum++;
		dataGrab();
		
	}
})


//Post Data

function postTweet() {
  $.ajax({
    type: "post",
    url:"/api/posttweet",
    data: {
      username: "first last",
      message: "hello"
    },
    success: function(){
    }
  })
}

//Backbone Start

var tweetModel = Backbone.Model.extend({});

var fullTweets = Backbone.Collection.extend({
	url: "/api/retrieveTweets/abcd",
	model: tweetModel,
	parse: function(data){
		return data.statuses;
	}
	//TweetCountSort: function(data).sort([])
});



var reTweetView = Backbone.View.extend({

	el: "#topTweeters",

	initialize: function() {
		this.collection.on("reset", this.render, this);
		//this.collection.on("all", function(blue){ debugger });
	},

	render: function() {
		var tweetol = this.collection.toJSON();
		debugger;
		/*upperReTweets.sort ( function (a, b) {
			if (a.retweet_count > b.retweet_count)
				return -1;
			if (a.retweet_count < b.retweet_count)
				return 1;
			return 0;
		});*/

		for (var t = 0; t < tweetol.length; t++) {
			if (tweetol[t].retweet_count > 10) {
				$(this.el).append(JST.topTweeter({ status: tweetol[t]} ))
			}
		}
	}

});

$(document).ready(function() {
	
	window.myCollection = new fullTweets();
	window.myCollection.fetch({ data: { page: 1 } });
	var reTweet_view = new reTweetView({collection: myCollection});
	//debugger;
});



var firstView = Backbone.View.extend({

	tagName: "#mainBody",

	initialize: function() {
		this.render();
	},

	render: function(){
		$(this.tagName).html("Hello World!");
	}

});

$(document).ready(function(){
	var MYmodel = new firstModel();
	new firstView({model:MYmodel});
})

var firstModel = Backbone.Model.extend({
	defaults: {
		name: "Bob",
		skill: "Javascript"
	}
})

