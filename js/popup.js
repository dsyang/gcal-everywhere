$('#options_link').click(function () {
    chrome.tabs.create({ "url": "options.html"});
});

$('#save').click(function() {
    var what = $('#what').val();
    var where = $('#where').val();

    var startDate = $('.datepair .date.start').data('datepicker').date;
    var startTime = $('.datepair .time.start').timepicker('getTime');
    var endDate = $('.datepair .date.end').data('datepicker').date;
    var endTime = $('.datepair .time.end').timepicker('getTime');

    var start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(),
                         startTime.getHours(), startTime.getMinutes(), startTime.getSeconds());

    var end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(),
                         endTime.getHours(), endTime.getMinutes(), endTime.getSeconds());

    var info = { 'name': what, 'place': where, 'start': start, 'end': end };
    console.log("sending message", { msg: "normalAdd", data: info});
    chrome.extension.sendMessage({ msg: "normalAdd", data: info});
});
