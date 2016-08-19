var app = angular.module("app", []);

app.controller('Ctrl', function($scope, $http) {
    $scope.locations = [];

    $scope.loadLocations = function() {
        console.log("LoadLocation!")
	    console.log($('#study_id option:selected').val());
        return $scope.locations.length ? null : $http.get('/api/locations/.json?study='+$('#study_id option:selected').val()).success(function(data) {
            //var newlocation = {};
            //newlocation.id = 0;
            //newlocation.text = "Add New Location...";
            //data.push(newlocation);
            console.log(data);
            $scope.locations = data;
        });
    };

   $scope.removeSampleAll = function() {
      $scope.$apply(function(){
        $scope.locations = [];
        $scope.loadLocations = function() {
            console.log($('#study_id option:selected').val());
            return $scope.locations.length ? null : $http.get('/api/locations/.json?study='+$('#study_id option:selected').val()).success(function(data) {
	            //console.log(data);
	            //var newlocation = {};
	            //newlocation.id = 0;
	            //newlocation.text = "Add New Location...";
	            //data.push(newlocation);
                $scope.locations = data;
            });
        };
      });
    };
});

