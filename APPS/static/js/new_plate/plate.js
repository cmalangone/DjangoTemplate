var plate = {
    createBoard: function (ncol,nrow) {
        if (!ncol || isNaN(ncol) || !parseInt(ncol, 10)) {
            return false;
        } else {
	        var chr;
            ncol = typeof ncol === 'string' ? parseInt(ncol, 10) : ncol;
            var table = document.createElement('table'),
                tbody = document.createElement('tbody'),
                row = document.createElement('tr'),
                cell = document.createElement('td'),
                span = document.createElement('span'),
                rowClone,
                cellClone,
                spanClone;
            table.appendChild(tbody);
            for (var r = 0; r < nrow; r++) {
                if (r == 0) {
                    rowClone = row.cloneNode(true);
                    tbody.appendChild(rowClone);
                    for (var c = 0; c <= ncol; c++) {
                       ch = "";
                       spanClone = span.cloneNode(true);
                       if (c > 0) {
                          spanClone.innerHTML = ch.concat(c);
                       }
                       spanClone.className = 'spanplate';
                       cellClone = cell.cloneNode(true);
                       cellClone.style.backgroundColor = '#004466';
                       cellClone.style.color = '#ffffff';
                       cellClone.appendChild(spanClone);
                       rowClone.appendChild(cellClone);

                    }
                }
                rowClone = row.cloneNode(true);
                tbody.appendChild(rowClone);
                for (var c = 0; c < ncol; c++) {
                    chr = String.fromCharCode(65+r);
                    //spanClone.innerHTML = chr.concat(c+1);
                    if (c == 0) {

                       spanClone = span.cloneNode(true);
                       spanClone.innerHTML = chr;
                       spanClone.className = 'spanplate';
                       cellClone = cell.cloneNode(true);
                       cellClone.style.backgroundColor = '#004466';
                       cellClone.style.color = '#ffffff';
                       cellClone.appendChild(spanClone);
                       rowClone.appendChild(cellClone);

                    }
                    spanClone = span.cloneNode(true);
                    spanClone.innerHTML = '&nbsp;';
	                spanClone.id = chr.concat(c+1);
	                spanClone.className = 'spanplate';
                    cellClone = cell.cloneNode(true);
                    cellClone.appendChild(spanClone);
                    rowClone.appendChild(cellClone);
                }
            }
            //position

            //low_pos.css('background-color', '#d3d3d3');
            //neg.css('background-color', '#d3d3d3');
            document.getElementById('plate').appendChild(table);
            var high_pos = document.getElementById("D12");
            high_pos.innerHTML = 'HIGH_POS';
		    high_pos.parentNode.style.backgroundColor = '#d3d3d3';
            var low_pos = document.getElementById("E12");
            low_pos.innerHTML = 'NEG';
		    low_pos.parentNode.style.backgroundColor = '#d3d3d3';
            var neg = document.getElementById("F12");
            neg.innerHTML = 'LOW_POS';
		    neg.parentNode.style.backgroundColor = '#d3d3d3';
		    var reserved = document.getElementById("G12");
            reserved.innerHTML = '<i><b>For Assay Only</b></i>';
		    reserved.parentNode.style.backgroundColor = '#d9d9d9';
		    reserved = document.getElementById("H12");
            reserved.innerHTML = '<i><b>For Assay Only</b></i>';
		    reserved.parentNode.style.backgroundColor = '#d9d9d9';

            //Build the external graphics

        }
    },
    changeCell : function (map,text_to_add) {
         var plate_index = map;
	     if (map.charAt(1) == '0')  {
	        plate_index = map.charAt(0)+map.charAt(2);
	     }

	     plate_index = plate_index.toUpperCase();
	     var dmap = document.getElementById(plate_index);
	     //dmap.innerHTML = text_to_add+'<br><br>'+plate_index;
		 dmap.innerHTML = text_to_add;
		 dmap.parentNode.style.backgroundColor = '#BCF5A9';

	},
	changeCellControl : function (map,text_to_add) {
         var plate_index = map;
	     if (map.charAt(1) == '0')  {
	        plate_index = map.charAt(0)+map.charAt(2);
	     }

	     plate_index = plate_index.toUpperCase();
	     var dmap = document.getElementById(plate_index);
	     //dmap.innerHTML = text_to_add+'<br><br>'+plate_index;
		 dmap.innerHTML = '<b>'+text_to_add+'</b>';
		 dmap.parentNode.style.backgroundColor = '#d3d3d3';

	},
	changeCellPrinter : function (map,text_to_add) {
	     var dmap = document.getElementById(map);
	     //dmap.innerHTML = "<b>"+data["oxford_code"]+"</b><br>"+data["seqscape_sample_name"]+'<br><br>'+map;
  	     dmap.innerHTML = text_to_add+'<br><br>'+map;
		 if (data["status"] == "Not Defined") {
			dmap.parentNode.style.backgroundColor = '#F6CED8';
		 }
		 else  {
			dmap.parentNode.style.backgroundColor = '#BCF5A9';
		}
	},
	empty: function () {
		$('.spanplate').html('Water');
        $('.spanplate').parents().css('background-color', 'white');
	},
	reset: function() {
		$('.spanplate').html('&nbsp;');
        $('.spanplate').parents().css('background-color', '#E0EEEE');
	}

};


function PrintElem(elem)
{
    Popup($(elem).html());
}

function Popup(data)
{
    var mywindow = window.open('', 'my div', 'height=400,width=600');
    mywindow.document.write('<html><head><title>Plate</title>');
    mywindow.document.write('<style type="text/css"> table {empty-cells: show;}td { line-height: 1em; padding-right: 20px;padding-left: 20px;padding: 20px;text-align: center;border: 1px solid #000;}.spanplate {font-size:12px;} </style>');
    mywindow.document.write('</head><body >');
    mywindow.document.write(data);
    mywindow.document.write('</body></html>');

    mywindow.print();
    mywindow.close();

    return true;
};


function drawPlate(linkid) {
	$.ajax( {
	         type: "POST",
	         url: '/plate/getplate',
	         data: {id : linkid},
	         success: function( response ) {
	           console.log(response);
			var myData = $.parseJSON(response.json.aaData);
	           var map;
	           var dmap;
			for (var i=0; i< myData.aaData.length; i++) {
				 map = myData.aaData[i]["map"];
				 plate.changeCell(map, myData.aaData[i]);
			}

	         },
	   });
}

function drawPlateForPrinter(linkid) {
	$.ajax( {
	         type: "POST",
	         url: '/plate/getplate',
	         data: {id : linkid},
	         success: function( response ) {
	           console.log(response);
			var myData = $.parseJSON(response.json.aaData);
	           var map;
	           var dmap;
			for (var i=0; i< myData.aaData.length; i++) {
				 map = myData.aaData[i]["map"];
				 plate.changeCellPrinter(map, myData.aaData[i]);
			}

	         },
	   });
}

function PrintElem(elem)
{
    Popup($(elem).html());
}

function Popup(data)
{
    var mywindow = window.open('', 'my div', 'height=400,width=600');
    mywindow.document.write('<html><head><title>Plate</title>');
    mywindow.document.write('<style type="text/css"> table {empty-cells: show;}td { line-height: 1em; padding-right: 20px;padding-left: 20px;padding: 20px;text-align: center;border: 1px solid #000;}.spanplate {font-size:12px;} </style>');
    mywindow.document.write('</head><body >');
    mywindow.document.write(data);
    mywindow.document.write('</body></html>');

    mywindow.print();
    mywindow.close();

    return true;
};

plate.createBoard(12,8);
