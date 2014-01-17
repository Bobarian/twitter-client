$.ajax({
  url: "/api/retrieveTweets/abcd",
  type: "GET",
  success: function(bob) {
    insertData(bob)
  }
})

function insertData(JSONdata) {
	
	for (var i = 0; i < JSONdata.statuses.length; i++) {
		
		$("#tweetList").append("<li class='list-group-item'><div class='Htitle'><h2 class='userName'>" + JSONdata.statuses[i].user.screen_name + "</h2><p class='UserLoc'>From: " + JSONdata.statuses[i].user.location + "</p></div><p class='tweet'>" + JSONdata.statuses[i].text + "</p><div class='footer'><h5 class='time'>Status Date: " + JSONdata.statuses[i].created_at + "</h5><h3 class='faved'>Favorite Count: " + JSONdata.statuses[i].favorite_count + "</h3></div></li>")
	};
	var userList = new List('myList', options);	 
	debugger;
}

var options = {
  valueNames: [ 'userName', 'time' ]
};
