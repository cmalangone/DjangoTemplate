$(document).ready(function() {
    var optionValues = {};

    $('#sampleform').parsley({ excluded: "input[type=button], input[type=submit], input[type=reset], input[type=hidden], [disabled], :hidden" });

    $("#modal").on('hidden.bs.modal', function () {
       $(this).data('bs.modal', null);
       createLocationComboBox();
       updateExistLocationComboBox();

    });

    function createLocationComboBox() {
         var study_id = $('#study_id option:selected').val();
         $('#location_id0').find('option').remove().end();

         console.log("createLocationComboBox");
         // This ajax call is sync. Otherwise updateExistLocationComboBox has a bug using #location0
         $.ajax({
            url: '/api/locations/?format=json',
            data: { 'study' : study_id},
            async: false,
            success:function(data) {
              var options = $("#location_id0");
              options.append($("<option />").val(0).text(""));
               for (var i = 0, l = data.length; i < l; i++) {
                    // data[i].location_name;
                    options.append($("<option />").val(data[i].id).text(data[i].location_name));
               }
            },
            error: function(errorThrown){
                 console.log(errorThrown);
            }
         });


    }

    function updateExistLocationComboBox() {
         $('tr[id^=master]').each(function() {
              var currentElement = $(this);
              var masterid = currentElement.closest('tr').attr('id');
              var tid = masterid.slice(6); //remove the master string
              var old_selection = $('#location_id'+tid).val();
              $('#location_id'+tid).find('option').remove().end();
              $("#location_id0 > option").each(function() {
                  $("#location_id"+tid).append($("<option />").val(this.value).text(this.text));
              });
              //set the old value
              $('#location_id'+tid).val(old_selection);
          });
    }


     $('#study_id').on('change', function() {
        //alert(this.value); // or $(this).val()
        var study_id = this.value;
        //var location_by_study_id_link = $('#LocbyID')[0].href;
        //location_by_study_id_link = location_by_study_id_link.replace(/[_0-9]+$/, '');
        //if (study_id > 0) {
        //   location_by_study_id_link = location_by_study_id_link + study_id;
        //}
        //$('#LocbyID').attr("href", location_by_study_id_link);

        $('tr[id^="master"]').remove();
        createLocationComboBox();
        $.getJSON("/api/studiesdetails/?format=json&id=" + study_id, function(result) {
            console.log(result);
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
                if ($('#submitter_id option:selected').val() > 0) { $('#table_samples').show(); }
            }
        });
     });

    $('#submitter_id').on('change', function() {
    $('#email').text(optionValues[$('#submitter_id option:selected').text()]);
    });
});


