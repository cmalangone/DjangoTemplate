function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$(document).ready(function() {
    var optionValues = {};
    $('#browsebutton :file').on('fileselect', function(event, numFiles, label) {
        var input = $(this).parents('.input-group').find(':text'),
            log = numFiles > 1 ? numFiles + ' files selected' : label;

        if( input.length ) {
            input.val(log);
        } else {
            if( log ) alert(log);
        }

    });

    $('#browsecsvbutton :file').on('fileselect', function(event, numFiles, label) {
        var input = $(this).parents('.input-group').find(':text'),
            log = numFiles > 1 ? numFiles + ' files selected' : label;

        if( input.length ) {
            input.val(log);
        } else {
            if( log ) alert(log);
        }

    });

    $('#upload_plate').click(function() {
        var fileInputCSV = document.getElementById('my-file-selector');
        var fileCSV = fileInputCSV.files[0];
        var formData = new FormData();
        formData.append('csv_file', fileCSV);

        var csrftoken = $.cookie('csrftoken');
        var note_field = $('#note').val();

        //var newdata = {};
        //var data = JSON.stringify(newdata);
        //formData.append("jsondata", data);
        if ((document.getElementById('high_checkbox').checked)
            && (document.getElementById('low_checkbox').checked)
            && (document.getElementById('neg_checkbox').checked)
            && ($('#note').val() != "")) {

           var note_data = {"note": note_field};
           var add_data = JSON.stringify(note_data);
           formData.append("jsondata", add_data);
        $.ajax({
            type: "POST",
            url: '/samples/plates/new/',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function(xhr, settings) {
                $('#a-error').alert('close');
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            },
            success: function (data, textStatus, jqXHR) {
                //window.location.href = data.redirect;
                var div_plate_name = document.getElementById('plate_name');
                div_plate_name.innerHTML = div_plate_name.innerHTML + '<b>'+data['plate_name']+'</b>';

                var Plate_wells = $.parseJSON(data['wells']);
                for (item in Plate_wells) {
                    var external_id = item;
                    var sample_name = Plate_wells[item]['sample_name'];
                    var map = Plate_wells[item]['position'];
                    var item_to_add = external_id+'<br>'+sample_name+'<br>';
                    plate.changeCell(map, item_to_add);
                }
                 //Hide panel with
                var export_csv =  document.getElementById('plate_export_csv_id');
                export_csv.href = "/samples/plates/export_csv/"+data['plate_id'];
                var export_xls =  document.getElementById('plate_export_xls_id');
                export_xls.href = "/samples/plates/export_xls/"+data['plate_id'];
                var export_csv_sanger =  document.getElementById('plate_export_csv_sanger_id');
                export_csv_sanger.href = "/samples/plates/export_csv_sanger/"+data['plate_id'];

                $('#import-place-div').hide();
                $('#plate_label').show();
                $('#print_label_div').show();
                $('#print_plate_div').show();
                $('#plate_export_csv_div').show();
                $('#plate_export_xls_div').show();
                $('#plate_export_csv_sanger_div').show();

                $('#results').html("<div id='a-success' class='alert alert-success' role='alert'> <button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>The plate saved! <a href='/samples/plates/new'> Click here to create a new plate </a></div>"); // add the error to the dom
            },
            error: function(xhr, textStatus, errorThrown) {
		            var errors = jQuery.parseJSON(xhr.responseText)
		            var err_messages_list = "<p>&nbsp;&nbsp;&nbsp;<b>"+errors.type+"</b>: "+errors.msg+"</p>";
		            if (errors.details != "") {
		               for(var i_err in errors.details) {
		                  err_messages_list = err_messages_list + "<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Line "+i_err+"</b>: "+errors.details[i_err]+"</p>";
		                  //console.log(i_err);
		               }
		            }
		            $('#results').html("<div id='a-error' class='alert alert-danger alert-dismissible' role='alert'> <button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>Oops! We have encountered an error:"+err_messages_list+"</div>"); // add the error to the dom

		         }
        });
     }
     else {
        var err_check_box = "<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>HIGH_POS, NEG, LOW_POS and NOTE must be filled in.</b></p>";

     	$('#results').html("<div id='a-error' class='alert alert-danger alert-dismissible' role='alert'> <button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>Oops! We have encountered an error:"+err_check_box+"</div>"); // add the error to the dom

     }
    });

    $('#print_plate').click(function() {
        PrintElem('#plate');
    });

    $('#print_label').click(function() {
        var label = '<table><tr><td><h1>'+$('#plate_name').text()+'</h1></td></tr></table><br>';
        label = label+label+label+label+label;
        Popup(label);
    });
});

$(document).on('change', '#browsebutton :file', function() {
  var input = $(this),
      numFiles = input.get(0).files ? input.get(0).files.length : 1,
      label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
      input.trigger('fileselect', [numFiles, label]);
});

$(document).on('change', '#browsecsvbutton :file', function() {
  var input = $(this),
      numFiles = input.get(0).files ? input.get(0).files.length : 1,
      label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
      input.trigger('fileselect', [numFiles, label]);
});