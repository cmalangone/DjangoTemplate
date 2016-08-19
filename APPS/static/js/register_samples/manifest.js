function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$(document).ready(function () {

    $("#savemanifest").click(function () {
        console.log("saveManifest with Upload")
        if ( $('#sampleform').parsley().isValid() == false) {
             $('#sampleform').parsley().validate();
        }
        else {
        var myRows = [];
        var count = 0;
        var headersText = [];
        //var $headers = $("th");

        // Loop through grabbing everything
        var $rows = $("tbody tr").each(function (index) {
            $cells = $(this).find("td");
            if (index > 0) {
                myRows[count] = {};
                myRows[count]["row"] = index;
                $cells.each(function (cellIndex) {
                    // Set the header text
                   if (headersText[cellIndex] != 'remove') {

	                   // Update the row object with the header/cell combo
	                   var rval = '-';
	                   var is_metadata = $cells[cellIndex].className;
	                   if ($cells[cellIndex].className =="metadata") {
	                   $(this).children(('input')).each(function () {
	                       rval = this.value;
	                   });
	                   	$(this).children(('select')).each(function () {
	                       rval = this.selectedOptions[0].text;
	                   });
	                   }
	                   else {
	                   $(this).children(('input,select')).each(function () {
	                       rval = this.value;
	                   });
	                   }
	                   myRows[count][headersText[cellIndex]] = rval;
	               }
                });
                count++;
            }
            else {
                console.log($cells);
                $cells.each(function (cellIndex) {
                   db_field = $(this).children(('input,select'))[0].id.slice(0, -1);
                   headersText[cellIndex] = db_field;
                });
            }

        });
        // Upload the file
        var fileInput = document.getElementById('my-file-selector');
        var file = fileInput.files[0];
        var formData = new FormData();
        formData.append('file', file);

        var csrftoken = $.cookie('csrftoken');
        var study_id = $('#study_id').val()
        var submitter_id = $('#submitter_id').val()
        var newdata = { "samples": myRows, "study": {"id": study_id,"submitter": submitter_id}};
        var data = JSON.stringify(newdata);
        formData.append("jsondata", data);
        $.ajax({
            type: "POST",
            url: '/register_samples/new',
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
		            $('#results').html("<div class='alert alert-danger alert-dismissible' role='alert'> <button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>Oops! We have encountered an error:"+err_messages_list+"</div>"); // add the error to the dom

		         }
        });
        }
    });



});

