var app = angular.module('MoodApp', []);

app.controller('parentCtrl', function parentCtrl($scope, $http) {
  $scope.title = 'Hello';
  $http.get('http://api.moodify.dev/api/home/lyon').then(function(response) {
    $scope.services = response.data;
    // console.log(response.data);
  });
});
