$(document).ready(function() {

//$.getJSON("/api/people/?format=json", function(result) {
	//var options = $("#coll0");
	//options.append($("<option />").val(0).text("-"));
	//$.each(result, function() {
	//    options.append($("<option />").val(this.id).text(this.text));
	//});
//});

$('members-form-container').reconformset({
            prefix: 'members',
            formCssClass: 'memberItemForm',
            addbuttonid: 'add-members-button',
});

$('locations-form-container').reconformset({
            prefix: 'locations',
            formCssClass: 'locationItemForm',
            addbuttonid: 'add-locations-button',
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


});

$(document).on('change', '#browsebutton :file', function() {
  var input = $(this),
      numFiles = input.get(0).files ? input.get(0).files.length : 1,
      label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
      input.trigger('fileselect', [numFiles, label]);
      //console.log(numFiles);
      $("#files_list").empty();
      for (i=0;i<numFiles;i++){
                    fileSize = parseInt(input.get(0).files[i].size, 10)/1024;
                    filesize = Math.round(fileSize);
                    $('<li />').text(input.get(0).files[i].name).appendTo($('#files_list'));
                    $('<span />').addClass('filesize').text('(' + filesize + 'kb)').appendTo($('#files_list li:last'));
                }

});
