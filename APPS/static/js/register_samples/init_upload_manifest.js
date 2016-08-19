function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$(document).ready(function() {
    var optionValues = {};

    $('#study_id').on('change', function() {
        //alert(this.value); // or $(this).val()
        var study_id = this.value;
        $('#id_study').val(study_id);
        $('#id_study [value="'+study_id+'"]').attr('selected',true);
        $.getJSON("/api/studiesdetails/?format=json&id=" + study_id, function(result) {
            //console.log(result);
            $('#submitter_id').find('option').remove().end();
            optionValues = {};
            $('#study_lead').text("");
            $('#email').text("");
            $('#table_samples').hide();
            var leader = "";
            var optionsub = $("#submitter_id");

            if (result.length > 0) {
                members = result[0].members;
                for (var i = 0; i < members.length; i++) {
                    console.log(members[i]);
                    optionsub.append($("<option />").val(members[i].id).text(members[i].fullname));
                    optionValues[members[i].fullname] = members[i].username;
                    if (members[i].role == 'Leader') {
                        leader = members[i].fullname;
                        $('#study_lead').text(leader)
                    }
                }

            $('#email').text(optionValues[$('#submitter_id option:selected').text()]);
            var collaborator_id = $('#submitter_id').val();
            $('#id_collaborator').val(collaborator_id);
            $('#id_collaborator [value="'+collaborator_id+'"]').attr('selected',true);
            }



        });
     });

    $('#submitter_id').on('change', function() {
        $('#email').text(optionValues[$('#submitter_id option:selected').text()]);
        var collaborator_id = $('#submitter_id').val();
        $('#id_collaborator').val(collaborator_id);
        $('#id_collaborator [value="'+collaborator_id+'"]').attr('selected',true);
    });


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

    $('#uploadcsv').click(function() {
        var fileInput = document.getElementById('my-file-selector');
        var fileInputCSV = document.getElementById('csv_manifest_file');
        var fileManifest = fileInput.files[0];
        var fileCSV = fileInputCSV.files[0];
        var formData = new FormData();
        formData.append('csv_file', fileCSV);
        formData.append('file', fileManifest);

        var csrftoken = $.cookie('csrftoken');
        var study_id = $('#study_id').val()
        var submitter_id = $('#submitter_id').val()
        var newdata = {"study": {"id": study_id,"submitter": submitter_id}};
        var data = JSON.stringify(newdata);
        formData.append("jsondata", data);
        $.ajax({
            type: "POST",
            url: '/register_samples/upload_csv/',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            },
            success: function (data, textStatus, jqXHR) {
                window.location.href = data.redirect;
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
		            $('#results').html("<div class='alert alert-danger alert-dismissible' role='alert'> <button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>Oops! We have encountered an error:"+err_messages_list+"</div>"); // add the error to the dom

		         }
        });
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