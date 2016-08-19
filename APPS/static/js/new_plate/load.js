$(document).ready(function() {
  var plate_id = $('#plate_id').text();
  console.log(plate_id);
  $.getJSON("/api/plates/?format=json&id="+plate_id, function(result) {

   var div_plate_name = document.getElementById('plate_name');
   div_plate_name.innerHTML = div_plate_name.innerHTML + '<b>'+result[0]['name']+'</b>';
   var export_csv =  document.getElementById('plate_export_csv_id');
   export_csv.href = "/samples/plates/export_csv/"+result[0].id;
   var export_xls =  document.getElementById('plate_export_xls_id');
   export_xls.href = "/samples/plates/export_xls/"+result[0].id;
   var export_csv_sanger =  document.getElementById('plate_export_csv_sanger_id');
   export_csv_sanger.href = "/samples/plates/export_csv_sanger/"+result[0].id;


   var plate_wells = result[0]['plate_wells'];
   for (item in plate_wells) {
       console.log(item);
       console.log(plate_wells[item]);
       //  var external_id = item;
       var sample_name = plate_wells[item]['sample'];
       var map = plate_wells[item]['position'];
       var item_to_add = sample_name+'<br>';
       plate.changeCell(map, item_to_add);
   }
   var plate_controls = result[0]['platecontrol_set'];
   for (item in plate_controls) {
       console.log(item);
       console.log(plate_controls[item]);
       //  var external_id = item;
       var control_name = plate_controls[item]['name'];
       var map = plate_controls[item]['position'];
       var item_to_add = control_name+'<br>';
       plate.changeCellControl(map, item_to_add);
   }
   $('#plate_label').show();
   $('#print_label_div').show();
   $('#plate_export_csv_div').show();
   $('#plate_export_xls_div').show();
   $('#plate_export_csv_sanger_div').show();

   $('#print_plate_div').show();
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