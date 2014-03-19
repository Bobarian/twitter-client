class ApiController < ApplicationController
before_filter :authenticate_user!
require 'twitter'

  def retrieveTweets
   # file = File.join(Rails.root, 'app', 'assets', 'javascripts', 'stanford1.json')
   #  if Integer(params[:page]) <= 6
   #    file = File.join(Rails.root, 'app', 'assets', 'javascripts', 'stanford' + params[:page] + '.json')
   #  end

   #  tweets = JSON.parse(File.read(file))
    client = Twitter::REST::Client.new do |config|
      config.consumer_key        = "XAnUHRqnPfS77sLQBXPtSw"
      config.consumer_secret     = "tGQfxPe5bWhbUSSq18hZxi26kbtUyjwtQ0ZGjZwGLA"
      config.access_token        = "12264892-h1ZokJ8AoDqtjnxRSCJLeVnDYfjrLBXXQTu20hc2Q"
      config.access_token_secret = "ZiHL1TmZPNMHXNgIYad7VVcOwfgc5Fp3Ar2M3zOm6hGpz"
    end

    if params[:max_id] == 0
      stanfordTweets = client.search("stanford", :result_type => "recent").take(10)
    else  
      stanfordTweets = client.search("stanford", :result_type => "recent", :max_id => params[:max_id]).take(10)
    end
    # tweets = client.search('#Stanford', :max_id => params["max_id"]).take(40)

    render :json => stanfordTweets, :status => 200
    # render :json => tweets, :status => 200
  end

#   def nextTweetBatch

#     tweets = client.search('#Stanford', :max_id => params["max_id"]).take(40)
#       config.consumer_key        = "XAnUHRqnPfS77sLQBXPtSw"
#       config.consumer_secret     = "tGQfxPe5bWhbUSSq18hZxi26kbtUyjwtQ0ZGjZwGLA"
#       config.access_token        = "12264892-h1ZokJ8AoDqtjnxRSCJLeVnDYfjrLBXXQTu20hc2Q"
#       config.access_token_secret = "ZiHL1TmZPNMHXNgIYad7VVcOwfgc5Fp3Ar2M3zOm6hGpz"
#     end

#     render :json => tweets, :status => 200
# end

  def postTweet
    if params.has_key?(:message) && params.has_key?(:username)
      message = { :message => "Your response has been successfully posted."}
      render :json => message
    else
      message = 'There was an error with your response.'
      render :json => {:error => message}.to_json, :status => 500
    end
  end

end
