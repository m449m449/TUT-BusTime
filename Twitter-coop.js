/*monacaドキュメントにあるOnsenUI用のサンプルを編集.*/
/*Twitter連携設定*/
function sProperties()
{
  var property; //various shared variables
  var oauth; //oauth object
  var api_key = '*************************'; //YOUR Twitter API_KEY
  var api_secret = '**************************************************'; //// YOUR Twitter API_SECRET
  var callback = 'http://';  //// YOUR CALLBACK URL
  var options =
  {
      consumerKey: api_key,
      consumerSecret: api_secret,
      callbackUrl: callback
  };
  oauth = jsOAuth(options);

  return {
    getCallback :function()
    {
      return callback;
    },
    getOauth :function ()
    {
      return oauth;
    },
    setOauth :function (oauth_token, oauth_token_secret)
    {
      oauth.setAccessToken([oauth_token, oauth_token_secret]);
    },
    getProperty: function ()
    {
      return property;
    },
    setProperty: function(value)
    {
      property = value;
    }
  };
}
//Connect_Ctrl();
function connect()
{   
console.log("connect_ctr!");
var sharedProperties = sProperties();
    var oauth = sharedProperties.getOauth();
    var callback = sharedProperties.getCallback();
    oauth.get('https://api.twitter.com/oauth/request_token',
      function(data)
      {
        var requestParams = data.text;
        var authorize_url = 'https://api.twitter.com/oauth/authorize?'+ requestParams;
        var ref = window.open(authorize_url, '_blank', 'location=yes');

        ref.addEventListener('loadstart', function(event)
        {
          var loc = event.url;
          if(loc.indexOf(callback + "?") >= 0)
          {
            var params = loc.toString().split("&");
            var verifier = params[1].toString();

            //get access token
            oauth.get('https://api.twitter.com/oauth/access_token?' + verifier+'&'+requestParams,
              function(data)
              {
                params = {};
                var tmp = data.text.split('&');

                for (var i = 0; i < tmp.length; i++) {;
                  var y = tmp[i].split('=');
                  params[y[0]] = decodeURIComponent(y[1]);
                };

                //save access token
                oauth.setAccessToken([params.oauth_token, params.oauth_token_secret]);
                sharedProperties.setOauth(params.oauth_token, params.oauth_token_secret);
                localStorage.setItem('acces_token',params.oauth_token);
                localStorage.setItem('acces_token_secret',params.oauth_token_secret);
                ref.close();
                /*
                //get some info about the authenticated user
                oauth.get('https://api.twitter.com/1.1/users/show.json?screen_name=' + params.screen_name,
                  function(data)
                  {
                    var obj = jQuery.parseJSON(data.text);
                    var info_obj = new Object();
                    info_obj.name = obj.name;
                    info_obj.screen_name = "(@" + params.screen_name + ")";
                    info_obj.profile = obj.profile_image_url;
                    info_obj.oauth = oauth;
                    var info_json = JSON.stringify(info_obj);
                    sharedProperties.setProperty(info_json);

                    ref.close();
                    $scope.ons.navigator.pushPage('profile.html', { title: 'Twitter Profile'});
                    $scope.$apply();
                  },
                    function(data) { alert('Fail to fetch the info of the authenticated user!'); }
                  );
                */
              },
                function(data) { alert('Fail to get the authentication access');  }
              );
            }
          });
        },
        function(data) { alert('Fail to get the request token!'); }
      );
}
/*
function Profile_Ctrl($scope, sharedProperties)
{
  var content = jQuery.parseJSON(sharedProperties.getProperty());
  $scope.user_name = content.name;
  $scope.screen_name = content.screen_name;
  $scope.profile_pic = content.profile;

  $scope.tweet = function()
  {
    var oauth = sharedProperties.getOauth();
    var theTweet = $scope.tweet_text;

    oauth.post('https://api.twitter.com/1.1/statuses/update.json',
      { 'status' : theTweet, 'trim_user' : 'true' },
      function(data)
      {
        alert('Successfully tweeted!');
        $scope.tweet_text = "";
        $scope.$apply();
      },
      function(data) { alert('Fail to submit the tweet!'); }
    );
  };
}
*/


