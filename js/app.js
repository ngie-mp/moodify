var app = angular.module('MoodApp', ['ngRoute']);
app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/home.html',
      controller : 'parentCtrl'
    }).
    when('/search/', {
      templateUrl: 'partials/search.html'
    }).
    when('/home/', {
      templateUrl: 'partials/home.html'
    });
});

app.controller('parentCtrl', function parentCtrl($scope, $http) {
  $scope.title = 'wtf';
  $http.get('http://api.moodify.dev/api/home/lyon').then(function(response) {
    $scope.services = response.data.returns;
    // console.log(response.data);
  });
});
