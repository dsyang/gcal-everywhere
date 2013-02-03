var oauth = ChromeExOAuth.initBackgroundPage({
  'request_url': 'https://www.google.com/accounts/OAuthGetRequestToken',
  'authorize_url': 'https://www.google.com/accounts/OAuthAuthorizeToken',
  'access_url': 'https://www.google.com/accounts/OAuthGetAccessToken',
  'consumer_key': 'anonymous',
  'consumer_secret': 'anonymous',
  'scope': 'https://www.google.com/calendar/feeds/',
  'app_name': 'gcal-everywhere'
});


function Requests() {
    if(oauth.hasToken()) {
        this.authorized = true;
    } else {
        oauth.authorize(function() {
            this.authorized = true;
        });
    }
    this.editSelection = true;
    this.defaultCalendar = "";
}

Requests.prototype.quickAdd = function (string, callback) {
    var url = 'https://www.google.com/calendar/feeds/default/private/full';
    var data = { 'data' : { 'quickAdd': true, 'details' : string } };
    var request = {
        'method': 'POST',
        'headers': {
            'GData-Version': '2.0',
            'Content-Type': 'application/json'
        },
        'parameters': {'alt': 'jsonc'},
        'body' : JSON.stringify(data)
    };
    oauth.sendSignedRequest(url, callback, request);
};

Requests.prototype.normalAdd = function (info, callback) {
    var url = 'https://www.google.com/calendar/feeds/default/private/full';
    var data = { 'data' : { 'title': info.name, 'location': info.place,
                            'when': [{ 'start': info.start,
                                       'end'  : info.end }]
                            }
               };
    var request = {
        'method': 'POST',
        'headers': {
            'GData-Version': '2.0',
            'Content-Type': 'application/json'
        },
        'parameters': {'alt': 'jsonc'},
        'body' : JSON.stringify(data)
    };
    oauth.sendSignedRequest(url, callback, request);
};


function onClickHandler(info, tab) {
    var text = info.selectionText;
    if(info.selectionText !== "") {
        var callback = function (response, xhr) {
            var result = JSON.parse(response);
            console.log(result)
            chrome.tabs.create({
                "url": result.data.alternateLink
            });
        };

        if(localStorage['confirm'] === "true") {
            text = prompt("Do you want to refine your event before adding it?",
                          info.selectionText);
            console.log(text);
        }
        if(text !== null)
            requests.quickAdd(text, callback);
    }

};

function doAdd(info) {
    if(typeof(info) !== undefined) {
        var callback = function (response, xhr) {
            var result = JSON.parse(response);
            console.log(result)
            chrome.tabs.create({
                "url": result.data.alternateLink
            });
        };
        requests.normalAdd(info, callback);
    }
};

chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.runtime.onInstalled.addListener(function() {

    var contexts = ["selection"];
    var id = chrome.contextMenus.create({"title": "Add to google calendar",
                                         "contexts": contexts,
                                         "id": "selection context"});
    localStorage["reminder"] = true;
    localStorage["confirm"] = true;

    requests = new Requests();


});
//chrome.browserAction.onClicked.addListener(doQuickAdd);
chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.msg === "normalAdd") {
            console.log("doing request", request.data);
            doAdd(request.data);
        }
    }
);
