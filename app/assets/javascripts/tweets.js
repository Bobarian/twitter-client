$.ajax({
  url: "/api/retrieveTweets/abcd",
  type: "GET",
  success: function(bob) {
    insertData(bob)
  }
})

function insertData(JSONdata) {
	debugger;
	$(".tweets").html(JSONdata.statuses[4].text  +  " " + JSONdata.statuses[4].favorite_count);
}