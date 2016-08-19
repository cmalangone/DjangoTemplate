//http://raphaeljs.com/icons/#location
//https://developers.arcgis.com/javascript/jssamples/graphics_svg_path.html
$(document).ready(function() {

  var map;

      require([
        "esri/map", "esri/geometry/Point",
        "esri/symbols/SimpleMarkerSymbol", "esri/graphic",
        "dojo/_base/array", "dojo/dom-style", "dojox/widget/ColorPicker",
        "dojo/domReady!"
      ], function(
        Map, Point,
        SimpleMarkerSymbol, Graphic,
        arrayUtils, domStyle, ColorPicker
      ) {

        map = new Map("map",{
          basemap: "oceans", //gray or oceans
          center: [101, 15.900419],
          zoom: 5,
          minZoom: 2
        });

        map.on("load", mapLoaded);
        //Eg.
        //var points = [[103.9167, 12.5333],[104.9667, 13.7833],[107, 13.7833]];

        function mapLoaded(){
          var points = [];
          var url = '/api/locations/?format=json';
          var iconPath = "M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z"
          var initColor = "#c2350a";

          if ($('#study_id').val() != "0" ) {
             url = url + '?study='+$('#study_id').val();
             initColor = "#0a3bc2";
          }
          map.graphics.clear();
          //Ajax syncro
          $.ajax({
            url: url,
            //data: { 'study' : 0},
            data: {},
            async: false,
            success:function(data) {
              for (var i = 0, l = data.length; i < l; i++) {
                  points.push([data[i].longitude, data[i].latitude]);
              }
            },
            error: function(errorThrown){
              console.log(errorThrown);
            }
         });
          //console.log(points);

          arrayUtils.forEach(points, function(point) {
            var graphic = new Graphic(new Point(point), createSymbol(iconPath, initColor));
            map.graphics.add(graphic);
          });

        }

        function createSymbol(path, color){
          var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
          markerSymbol.setPath(path);
          markerSymbol.setColor(new dojo.Color(color));
          markerSymbol.setOutline(null);
          return markerSymbol;
        }

        map_study = function() {
           mapLoaded();
        };


      });

      $.getJSON("/api/studies/?format=json", function(result) {
   	     var options = $("#study_id");
	     options.append($("<option />").val(0).text("All Studies"));
	     $.each(result, function() {
	       options.append($("<option />").val(this.id).text(this.project_code+":"+this.title));
         });
      });

    $('#study_id').on('change', function() {
        map_study();
    });
});