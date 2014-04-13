var lastIDpulled = 0;
var maxyID = 0;
var c = 0;

//Post Data

// function postTweet() {
//   $.ajax({
//     type: "post",
//     url:"/api/posttweet",
//     data: {
//       username: "first last",
//       message: "hello"
//     },
//     success: function(){
//     }
//   })
// }

//Backbone Start



var tweetModel = Backbone.Model.extend({});

var fullTweets = Backbone.Collection.extend({
	url: "/api/retrieveTweets/abcd",
	model: tweetModel,
	
	comparator: function(dataForSorting){
		return -dataForSorting.get("retweet_count")
	},

	locationTweetSort: function() {
		
		var locTweets = this.toJSON();
		var locTrack = {};

		for (var t = 0; t < locTweets.length; t++) {
			var locCheck = locTweets[t].user.location
			if ((locCheck in locTrack) == true) {
				locTrack[locTweets[t].user.location]++
			}
			else {
				locTrack[locTweets[t].user.location] = 1
			}
		};

		locOrder = []
		for (key in locTrack) {
			locOrder.push({location: key, count: locTrack[key]});
		};
		
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
		});
		return locOrder;
	},

});

$(document).on('click', '#lightbox', function(){
	$("#lightbox").remove();
});

var singleTweet = Backbone.View.extend({

		events: {
			"click .list-group-item": "clicked",
		},

		render: function (tweetData) {
			c++;
			var tweetData = this.model.toJSON();
			this.$el.html(JST.tweetObject({counter: c, status: tweetData }));
			return this;
		},

		clicked: function () {
			$('body').append(JST.lightBoxObject({ status: this.model.toJSON() }));
		}
	  
});

var mainTweets = Backbone.View.extend({

	el: "#tweetList",

	events: {
		"scroll": "checkScroll"
	},

	initialize: function () {
		this.collection.on("reset", this.render, this);
		_.bindAll(this, 'checkScroll');
    // bind to window
    $(window).scroll(this.checkScroll);
	},

	render: function (theGreatData) {
		
		for (i = 0; i < this.collection.length; i++) {
			$("#tweetList").append(
				new singleTweet({ model: this.collection.models[i] }).render().$el
			);

			if (i === this.collection.length - 1) {
				maxyID = this.collection.models[i].id;
				}
		}
		
		$('body').removeClass('stopScroll'); 

	},

	dataGrab: function () {
    	console.log("Grab Data")

    	$('body').addClass('stopScroll');
    	this.collection.fetch({ data: {maxid: maxyID } });

	},

	checkScroll: function (datastuff, JSONdata) {
		if (window.scrollY + 500 >= $(document).height() && !$('body').hasClass('stopScroll')) {
			console.log("The data grabbed called on scroll")
				this.dataGrab();
			};
    }
});

//Used for Sorting for List.JS
var options = {
  valueNames: [ 'userName', 'time', 'tweet', 'faved', 'reTweet' ]
}

var reTweetView = Backbone.View.extend({

	el: "#topTweeters",

	initialize: function() {
		this.collection.on("reset", this.render, this);
	},
              
	render: function() {

		var tweetol = this.collection.toJSON();

		for (var t = 0; t < tweetol.length; t++) {
			if (tweetol[t].retweet_count > 10) {
				$(this.el).append(JST.topTweeter({ status: tweetol[t]} ))
			}
		}
	}

});


var locationTweets = Backbone.View.extend({

	el: "#topLocations",

	initialize: function() {
		this.collection.on("reset", this.render, this);
		//this.listenTo(tweetModel, "change", this.render, this);
		this.morethan3 = false;
	},

	render: function() {
		console.log("render is logged")
		var locSorter = this.collection.sort(function(piecesofTweet) {
			return piecesofTweet.get("user").location
		});

		var locOrder = this.collection.locationTweetSort();
		debugger;
		for (var l = 0; l < locOrder.length; l++) {
			if (locOrder[l].location != "" && locOrder[l].count > 1){
				$("#topLocations").append(JST.topLocations({location: locOrder[l].location, count: locOrder[l].count}))
				this.morethan3 = true;
			}	
		}

		if (this.morethan3 == false) {
				$("#locationTweetList").append("<li class='locError'>No locations with more than 3 tweets. </li>");
				this.morethan3 = true;
		}
		
	}

})


$(document).ready(function() {
	window.myCollection = new fullTweets();
	console.log("Other grabbed data")
	window.myCollection.fetch({ data: {maxid: lastIDpulled } });
	var reTweet_View = new reTweetView({collection: myCollection});
	var locationTweets_View = new locationTweets({collection: myCollection});
	var theFullTweetList = new mainTweets({collection: myCollection});
});
