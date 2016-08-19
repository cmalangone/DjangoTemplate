/* Table initialisation */ 
var oTable = null;

$(document).ready(function() {
	
var oTable = $('#tableUploded').dataTable( {
    //"sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
    "sDom": "<'row-fluid'<'span6'<'toolbar'>><'span6'fl>r>t<'row-fluid'<'span6'i><'span6'p>>",
    "sPaginationType": "bootstrap",
    "pagingType": "full_numbers",
    "oLanguage": {
        "sLengthMenu": "_MENU_ records per page"
    },
    "aLengthMenu": [
    [ -1],
    [ "All"]
    ],
    "iDisplayLength" : -1,
    "bFilter": false,
    "bProcessing": true,
    //"bDeferRender": true,
    "columns": [
                { "data": "Unique Aliquot ID" },
                { "data": "Specimen Date" },
                { "data": "Location" }
            ]
    } );

    //$("div.toolbar").html(' <p> <div class="button pulsante" id="b_submit_manual_qc"><a href="#">Change Manual QC</a></div></p>');
    //$('#b_submit_manual_qc').css('opacity', 0);
    var oSettings = oTable.fnSettings();
    $('#tableUploded').dataTable().fnClearTable(this);
    oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
    $('#tableUploded').dataTable().fnDraw();

    $("#upload_button").click(function(){
        var $alert = $('#alert-upload');
        var formData = new FormData($('#form')[0]);
        $.ajax({
            type: "POST",
            //url: "registers/upload",  //where u want to send the data.
            url:"",
            //Ajax events
            error: errorHandler,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function(){
                //$('.pulsante').css('opacity', 0);
                //$("#loading").show();
            },
            complete: function(){
                //$("#loading").hide();
                //$('#submit_btn').css('opacity', 1);
            },
            success: function(json)
            {
                //console.log(json);
                
                if (json.result == "ko") {
                    //alert(json.descr);
                    var oSettings = oTable.fnSettings();
                    $('#tableUploded').dataTable().fnClearTable(this);
                    oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
                    $('#tableUploded').dataTable().fnDraw();
                    $("#modtitle").html("Upload Action: Error");
                    $("#modbody").html(json.descr);
                    $('#myModal').modal();
                    //$('input#filename').val("");
                    //$('#submit_update').css('opacity', 0);
                }
                else
                {
                    var myData = JSON.parse(json.aaData);
                    var oSettings = $('#tableUploded').dataTable().fnSettings();
                    $('#tableUploded').dataTable().fnClearTable(this);
                    //var count=1;
                    for (var key in myData) 
                    { 
                        //console.log(key,myData[key]);
                        var row = myData[key];
                        //row[0] = '<input type="hidden" name="sample_id['+count+']" value="'+row[0]+'">'+row[0];
                        //console.log(row);
                        $('#tableUploded').dataTable().oApi._fnAddData(oSettings, row);
                        //count=count+1;

                    }

                    oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
                    $('#tableUploded').dataTable().fnDraw();
                }
            }
        });
        return false;
    });


    function errorHandler(e){
        //var oSettings = oTable.fnSettings();
        //$('#example').dataTable().fnClearTable(this);
        //oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
        //$('#example').dataTable().fnDraw();
        alert("Something Went Wrong. TODO");
        $("#modtitle").html("Upload Action: Error");
        $("#modbody").html("Something went wrong.");
        $('#myModal').modal();
        $('input#filename').val("");
        //$('#submit_update').css('opacity', 0);    
    }

    // This function gets cookie with a given name
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    var csrftoken = getCookie('csrftoken');

    /*
    The functions below will create a header with csrftoken
    */

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

} );