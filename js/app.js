var app = angular.module('MoodApp', ['ngRoute', 'socialLogin']);
app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/login.html',
      controller : 'loginCtrl'
    }).
    when('/search/', {
      templateUrl: 'partials/search.html',
      controller : 'speechtCtrl'
    }).
    when('/home/', {
      templateUrl: 'partials/home.html'
    });
});

app.config(function(socialProvider){
  socialProvider.setGoogleKey("724346200475-sj3iure20vb2mse5m6ogjtsg9kb5qma2.apps.googleusercontent.com");
  /*socialProvider.setLinkedInKey("YOUR LINKEDIN CLIENT ID");
  socialProvider.setFbKey({appId: "YOUR FACEBOOK APP ID", apiVersion: "API VERSION"});*/
});

app.controller('parentCtrl', function parentCtrl($scope, $http) {
  $scope.title = 'wtf';
  $http.get('http://api.moodify.dev/api/home/lyon').then(function(response) {
    $scope.services = response.data.returns;
    // console.log(response.data);
  });
});

app.controller('loginCtrl', function($scope, socialLoginService) {
  $scope.signout = function(){
    socialLoginService.logout();
    console.log($scope.userGoogle);
	}
	$scope.$on('event:social-sign-in-success', (event, userDetails)=> {
		$scope.userGoogle = userDetails;
		$scope.$apply();
    if(userDetails.token != null){
      window.location = '/#!/search/';
    }
	})
	$scope.$on('event:social-sign-out-success', function(event, userDetails){
		$scope.userGoogle = userDetails;
	})

});
