var lastIDpulled = 0;
var maxyID = 0;
var c = 0;

//Used for Sorting for List.JS
var options = {
  valueNames: [ 'userName', 'time', 'tweet', 'faved', 'reTweet' ]
}

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

// var commentModel = Backbone.Model.extend({

// 	urlRoot: "/api/postweet",

// 	url: function (){
// 		url = this.urlRoot
// 	}
// });

// var commentView = Backbone.View.extend({

// 	el: "#postBox",

// 	events: {
// 		"click #sendTweet": "commentSave",
// 		//"scroll": "checkScroll"


// 	},

// 	// dataGrab: function(maxyID) {

// 	//   insertData(tweetData);
// 	//   insertLightBoxData(tweetData);
// 	// },

// 	// checkScroll: function (datastuff) {
//  //      var triggerPoint = 100; // 100px from the bottom
//  //        if( !this.isLoading && this.el.scrollTop + this.el.clientHeight + triggerPoint > this.el.scrollHeight ) {
//  //          this.fullTweets.page += 1; // Load next page
//  //          debugger;
//  //          dataGrab(grabthis);
//  //        }
//  //    },

// 	commentSave: function(evt) {

// 		evt.preventDefault();

// 		var userName = $("#userName").val();
// 		var tweetPost = $("#tweetPost").val();

// 		this.model.set({username: userName, comment: tweetPost});
// 		this.model.save();
// 	}

// });


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

// function dataGrab(){
// 	debugger;
// }



//Lightbox
// function insertLightBoxData(boxData) {
// 	$(document).on('click', '.list-group-item', function() {
// 		var x = $(this).attr("ID");
// 		x = Number(x);
// 		$('body').append(JST.lightBoxObject({ status: boxData[x] }));	
//    	})
// }

// $(document).on('click', '#lightbox', function() {
// 		$('#lightbox').remove();
// })


$(document).on('click', '#lightbox', function(){
	$("#lightbox").remove();
});

var singleTweet = Backbone.View.extend({

		events: {
			"click .list-group-item": "clicked",
		},

		render: function (tweetData) {
			//debugger;
			c++;
			var tweetData = this.model.toJSON();
			this.$el.html(JST.tweetObject({counter: c, status: tweetData }));
			return this;
		},

		clicked: function () {
			//debugger;
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
		//var JSONdata = this.collection.toJSON();
		_.bindAll(this, 'checkScroll');
    // bind to window
    $(window).scroll(this.checkScroll);
	},

	render: function (theGreatData) {
		
	//	theGreatData = JSONdata.toJSON();
		for (i = 0; i < this.collection.length; i++) {
			//debugger;
			$("#tweetList").append(
				new singleTweet({ model: this.collection.models[i] }).render().$el
			);

			//$("#tweetList").append(JST.tweetObject({ counter: c, status: theGreatData[i] }));
			if (i === this.collection.length - 1) {
				maxyID = this.collection.models[i].id;
				}
		}

		$('body').removeClass('stopScroll');
		//var userList = new List('myList', options);	 

		// Homework: create a new view for one tweet.  Use Tweet Object template. (Where is says append)
		//Create new view and pass in one tweet as a model. (instead of status: would be model:)
		//In events of new view create a 'click' function - 'OpenLightBox'.
	},

	dataGrab: function () {
    	//debugger;
    	console.log("Grab Data")

    	$('body').addClass('stopScroll');
    	this.collection.fetch({ data: {maxid: maxyID } });

	},

	checkScroll: function (datastuff, JSONdata) {
    //var triggerPoint = 100; // 100px from the bottom
		if (window.scrollY + 500 >= $(document).height() && !$('body').hasClass('stopScroll')) {
				//debugger;
				this.dataGrab();
		//instead of this call a function that is in a view.
			};
    }

   	

});

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
	},

	render: function() {

		var locSorter = this.collection.sort(function(piecesofTweet) {
			return piecesofTweet.get("user").location
		});

		var locOrder = this.collection.locationTweetSort();

		for (var l = 0; l < locOrder.length; l++) {
			$("#topLocations").append(JST.topLocations({location: locOrder[l].location, count: locOrder[l].count}))
		}
	}

})


$(document).ready(function() {
	// dataGrab(maxyID);
	window.myCollection = new fullTweets();
	window.myCollection.fetch({ data: {maxid: lastIDpulled } });
	//commentBlahBlah = new tweetModel();
	var reTweet_View = new reTweetView({collection: myCollection});
	var locationTweets_View = new locationTweets({collection: myCollection});
//	var commentTweet = new commentView({model: commentBlahBlah});
	var theFullTweetList = new mainTweets({collection: myCollection});
});


//Create a tweet container view.  El should be the same el I'm using now (where tweets go). Create another one tweet view.  Then pass the collection
//into there.  this.render (line 215).

//Interview question: Make a Todo List in Backbone.


