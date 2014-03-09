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

  		}
	})
}

function insertData(JSONdata) {
	
	for (var i = 0; i < JSONdata.statuses.length; i++) {
		
		$("#tweetList").append(JST.tweetObject({ counter: i, status: JSONdata.statuses[i] }));
	};
	var userList = new List('myList', options);	 
}

//Used for Sorting
var options = {
  valueNames: [ 'userName', 'time', 'tweet', 'faved', 'reTweet' ]
}


//Lightbox
function insertLightBoxData(boxData) {
	$(document).on('click', '.list-group-item', function() {
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
/*
BD.Models.UserRegistration = Backbone.Model.extend({
	url: '/users.json',
	paramRoot: 'user',

	defaults: {
		"email": "",
		"password": "",
		"password_confirmation": ""
	}
});

BD.Models.UserSession = Backbone.Model.extend({
	url: '/users/sign-in.json',
	paramRoot: 'user',

	defaults: {
		"email": "",
		"password": ""
	}
});

BD.Models.UserPasswordRecovery = Backbone.Model.extend({
	url: '/users/password.json',
	paramRoot: 'user',

	defaults: {
		"email": ""
	}
});

BD.Views.Unauthenticated = BD.Views.Unauthenticated || {};

BD.Views.Unauthenticated.Login = Back
*/

var commentModel = Backbone.Model.extend({

	urlRoot: "/api/postweet",

	url: function (){
		url = this.urlRoot
	}
});

var commentView = Backbone.View.extend({

	el: "#postBox",

	events: {
		"click #sendTweet": "commentSave"

	},

	commentSave: function(evt) {

		evt.preventDefault();

		var userName = $("#userName").val();
		var tweetPost = $("#tweetPost").val();

		this.model.set({username: userName, comment: tweetPost});
		debugger;
		this.model.save();


	}

});


var tweetModel = Backbone.Model.extend({});

var fullTweets = Backbone.Collection.extend({
	url: "/api/retrieveTweets/abcd",
	model: tweetModel,
	parse: function(data){
		return data.statuses;

		},
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
	
	window.myCollection = new fullTweets();
	window.myCollection.fetch({ data: { page: 1 } });
	commentBlahBlah = new tweetModel();
	var reTweet_View = new reTweetView({collection: myCollection});
	var locationTweets_View = new locationTweets({collection: myCollection});
	var commentTweet = new commentView({model: commentBlahBlah});
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

