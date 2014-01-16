$.ajax({
  url: "/api/retrieveTweets/abcd",
  type: "GET",
  success: function(bob) {
    insertData(bob)
  }
})

function insertData(JSONdata) {
	debugger;
	for (var i = 0; i < JSONdata.statuses.length; i++) {
		
		$("#tweetList").append("<li class='list-group-item'><div class='Htitle'><h2 class='userName'>" + JSONdata.statuses[i].user.screen_name + "</h2><h4 class='UserLoc'>From: " + JSONdata.statuses[i].user.location + "</h4></div><p class='tweet'>" + JSONdata.statuses[i].text + "</p><h5 class='time'>" + JSONdata.statuses[i].created_at + "</h5>" + "</li>")






	};
	$(".tweets").html(JSONdata.statuses[4].text  +  " " + JSONdata.statuses[4].favorite_count);
	 
} 