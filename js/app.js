var app = angular.module('MoodApp', ['ngRoute', 'socialLogin']);
app.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/login.html',
      controller : 'loginCtrl'
    }).
    when('/search/', {
      resolve: {
        check: function($location, user) {
          if(!user.isUserLoggedIn()) {
            $location.path('/');
          }
        },
      },
      templateUrl: 'partials/search.html',
      controller : 'speechtCtrl'
    }).
    when('/home/', {
      resolve: {
        check: function($location, user) {
          if(!user.isUserLoggedIn()) {
            $location.path('/');
          }
        },
      },
      templateUrl: 'partials/home.html',
      controller : 'resultsCtrl'
    }).
    when('/logout/', {
      resolve: {
        deadResolve: function($location, user) {
          user.clearData();
          $location.path('/');
        }  
      }
    })
    .otherwise({
      template: '404'
    });
});

app.config(function(socialProvider){
  socialProvider.setGoogleKey("724346200475-sj3iure20vb2mse5m6ogjtsg9kb5qma2.apps.googleusercontent.com");
  /*socialProvider.setLinkedInKey("YOUR LINKEDIN CLIENT ID");
  socialProvider.setFbKey({appId: "YOUR FACEBOOK APP ID", apiVersion: "API VERSION"});*/
});

app.service('user', function() {
	var loggedin = false;

	this.setUser = function(user) {
		userInfos = user;
	};
	this.getUser = function() {
		return JSON.parse(localStorage.getItem('user'));
	};

	this.isUserLoggedIn = function() {
		if(!!localStorage.getItem('user')) {
			loggedin = true;
			var data = JSON.parse(localStorage.getItem('user'));
			userInfos = data;
			id = data.id;
		}
		return loggedin;
	};

	this.saveData = function(data) {
		loggedin = true;
		localStorage.setItem('user', data);
	};

	this.clearData = function() {
		localStorage.removeItem('user');
		loggedin = false;
	}
})

// Gestion login : / 
app.controller('loginCtrl', function($scope, $http, $location, socialLoginService, user) {
  $scope.title = 'login';
  
  // Bouton GoogleAuth
  $scope.signout = function(){
    socialLoginService.logout();
    console.log($scope.userGoogle);
	}
	$scope.$on('event:social-sign-in-success', (event, userDetails)=> {
    $scope.userGoogle = userDetails;
    user.setUser(userDetails);
		$scope.$apply();
    if(userDetails.token != null){
      window.location = '/#!/search/';
    }
	})
	$scope.$on('event:social-sign-out-success', function(event, userDetails){
		$scope.userGoogle = userDetails;
  })
  
  // Bouton Login normal
  $scope.login = function() {
		var email = $scope.email;
		var password = $scope.password;
		$http({
			url: 'http://api.moodify.hackaton/api/connect',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'email='+email+'&password='+password
		}).then(function(response) {
      console.log(response.data);
			if(response.data.return_code == 0) {
				user.saveData(response.data.returns.user);
				$location.path('/search');
			} else {
				alert('invalid login | error : ' + response.data.error);
			}
		})
  }
  
  // Bouton Register normal
  $scope.register = function() {
		var firstname = $scope.firstname;
    var lastname = $scope.lastname;
    var email = $scope.email;
    var password = $scope.password;
    var password_confirm = $scope.password_confirm;
		$http({
			url: 'http://api.moodify.hackaton/api/register',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'firstname='+firstname+'&lastname='+lastname+'&email='+email+'&password='+password+'&password_confirm='+password_confirm
		}).then(function(response) {
      console.log(response.data);
			if(response.data.return_code == 0) {
        $(".nav").toggleClass("nav-up");
        $(".form-signup-left").toggleClass("form-signup-down");
        $(".frame").toggleClass("frame-short");
				user.saveData(response.data.returns.user);
				$location.path('/search');
			} else {
				alert('invalid login | error : ' + response.data.error);
			}
		})
	}

});

// Page results : /home/ 
app.controller('resultsCtrl', function parentCtrl($scope, $http) {
  $scope.title = 'result';
  $http.get('http://api.moodify.hackaton/api/home/lyon').then(function(response) {
    if(response.data.return_code == 0) {
      $scope.services = response.data.returns;
      console.log(response.data);
    } else {
      alert('error : ' + response.data.error);
    }
  });
});