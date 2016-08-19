function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function removeRow(nrow) {
        var nid = nrow.id.split('remove').pop();
        $('#master'+nid).remove();

}

// Init.js disable button to the action
// $("#....").parsley({ excluded: "input[type=button], input[type=submit], input[type=reset], input[type=hidden], [disabled], :hidden" });


$(document).ready(function () {
    var id = 0;

    $("#add_row").click(function () {
        var new_row = $("#original").clone();

        id++;
        new_row.attr("id", 'master' + id);
        new_row.show();
        new_row.find('input').each(function(){
            item = $(this);
            field = item[0].id.slice(0, -1);
            item[0].id = field+id;
            item[0].name = field+id;
        });
        new_row.find('select').each(function(){
            item = $(this);
            field = item[0].id.slice(0, -1);
            item[0].id = field+id;
            item[0].name = field+id;
        });
        new_row.find('#remove0').attr("id", 'remove' + id);
        new_row.find('#clone0').attr("id", 'clone' + id);
        // Firefox patch
        if (new_row.find('#collection_date'+id)[0].type != 'date' ) new_row.find('#collection_date'+id).datepicker({ dateFormat: 'dd/mm/yy' });
        //$("#original").after(new_row);
        $('#listsamples > tbody').append( new_row);
    });


    $("#clone_row").click(function () {
        var new_row;
        var previous_id = id;
        var location_id = 0;
        while ((new_row == undefined) && (previous_id > 0) ) {
             if ($('#master'+previous_id).length > 0) {
               new_row = $('#master'+previous_id).clone();
               location_id = $('#location_id'+previous_id).val();
             }
             else { previous_id--;}
        }

        if (new_row == undefined) {
          new_row = $("#original").clone();
        }

        id++;
        new_row.attr("id", 'master' + id);
        new_row.show();
        new_row.find('input').each(function(){
            item = $(this);
            field = item[0].id.replace(/[0-9]/g, '');
            item[0].id = field+id;
            item[0].name = field+id;
        });
        new_row.find('select').each(function(){
            item = $(this);
            field = item[0].id.replace(/[0-9]/g, '');
            item[0].id = field+id;
            item[0].name = field+id;
            item.val($('#'+field+previous_id).val())
        });
        new_row.find('#remove'+previous_id).attr("id", 'remove' + id);
        new_row.find('#clone'+previous_id).attr("id", 'clone' + id);
        //clone select + empty external_id
        new_row.find('#external_id'+id).val("");
        // Firefox patch: this line doesn't work properly
        // To DO: find an alternative solution. With Clone from original works.
        //if (new_row.find('#date'+id)[0].type != 'date' ) new_row.find('#date'+id).datepicker({ dateFormat: 'dd/mm/yy' });
        $('#listsamples > tbody').append( new_row);
    });

    $("#reset").click(function () {
        $('tr[id^="master"]').remove();
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
});
