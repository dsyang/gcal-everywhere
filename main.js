var oauth = ChromeExOAuth.initBackgroundPage({
  'request_url': 'https://www.google.com/accounts/OAuthGetRequestToken',
  'authorize_url': 'https://www.google.com/accounts/OAuthAuthorizeToken',
  'access_url': 'https://www.google.com/accounts/OAuthGetAccessToken',
  'consumer_key': 'anonymous',
  'consumer_secret': 'anonymous',
  'scope': 'https://www.google.com/calendar/feeds/',
  'app_name': 'gcal-everywhere'
});

console.log(oauth);


function doStuff () {
    oauth.authorize(function() {
        console.log("authorized");
    });
};

chrome.browserAction.onClicked.addListener(doStuff);
