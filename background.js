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

chrome.runtime.onInstalled.addListener(function() {

    var contexts = ["selection"];
    var id = chrome.contextMenus.create({"title": "QuickAdd to google calendar",
                                         "contexts": contexts,
                                         "id": "selection context"});
    console.log("context menu created");

});


function onClickHandler(info, tab) {
    if(info.selectionText !== "") {
        var url = 'https://www.google.com/calendar/feeds/default/private/full';
        var request = {
            'method': 'POST',
            'headers' : {
                'Content-Type': 'application/atom+xml'
            },
            'parameters': {'alt': 'json'},
            'body': '{ "data": { "details": "Dinner at the melting pot tomorrow at 7:00pm", '
                    + '  "quickadd": true } }'
        };

        // Send: GET https://docs.google.com/feeds/default/private/full?alt=json
        var callback = function (response, xhr) {
            console.log(response);
        };
        oauth.sendSignedRequest(url, callback, request);
    }

};

chrome.contextMenus.onClicked.addListener(onClickHandler);
