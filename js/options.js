$(document).ready(function() {
//    if(localStorage["reminder"]) $('#reminder').prop('checked', true);
    if(localStorage["confirm"]) $('#confirm').prop('checked', true);

    $('#save_button').click(function() {
//        localStorage["reminder"] = $('#reminder').is(':checked');
        localStorage["confirm"] = $('#confirm').is(':checked');
        $('#status').html("Options saved");
        setTimeout(function() {$('#status').html("");}, 1000);
    });

});
