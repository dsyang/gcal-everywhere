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

Requests.prototype.getCalendars = function(callback) {
    var url = "https://www.google.com/calendar/feeds/default/owncalendars/full"
    var request = {
        'method': 'GET',
        'headers': {
            'GData-Version': '2.0',
            'Content-Type': 'application/json'
        },
        'parameters': {'alt': 'jsonc'},
    };
    oauth.sendSignedRequest(url, callback, request);
};

function onClickHandler(info, tab) {
    if(info.selectionText !== "") {
        var callback = function (response, xhr) {
            var result = JSON.parse(response);
            console.log(result)
            chrome.tabs.create({
                "url": result.data.alternateLink
            });
        };
        requests.quickAdd(info.selectionText, callback);
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
    var id = chrome.contextMenus.create({"title": "QuickAdd to google calendar",
                                         "contexts": contexts,
                                         "id": "selection context"});
    localStorage["editSelection"] = true;

    requests = new Requests();
    requests.getCalendars( function (response, xhr) {
        console.log(JSON.parse(response));
    });


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
