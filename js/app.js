const API_URL = "http://api.moodify.dev";

var app = angular.module('MoodApp', ['ngRoute', 'ngSanitize']);
app.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      resolve: {
        check: function($location, user) {
          if(user.isUserLoggedIn()) {
            $location.path('/search');
          }
        },
      },
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
    when('/recipe-detail/', {
      templateUrl: 'partials/recipe-detail.html',
      controller: 'resultsCtrl'
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

app.service('user', function() {
	var loggedin = false;
  var is_google = false;

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
		}
		return loggedin;
	};

  this.isUserGoogleLoggedIn = function() {
    console.log(is_google);
		if(!!localStorage.getItem('user')) {
			is_google = false;
			var data = JSON.parse(localStorage.getItem('user'));
			if(data.social_id == 0){
        is_google = true;
      }
		}
		return is_google;
	};

	this.saveData = function(data) {
		loggedin = true;
		localStorage.setItem('user', data);
	};

	this.clearData = function() {
    loggedin = false;
    console.log('test');
    localStorage.removeItem('user');
	}
})

// Gestion login : /
app.controller('loginCtrl', function($scope, $http, $location, user) {
  $scope.title = 'login';

  $scope.googleLogin = function(){
    $(".abcRioButtonContentWrapper").click();
  }

  function onSignIn(googleUser) {
    googleUser.disconnect();
    var id_token = googleUser.getAuthResponse().id_token;
    $http({
      url: API_URL+'/api/registerGoogle/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: 'id_token='+id_token
    }).then(function(response) {
      if(response.data.return_code == 0) {
        user.saveData(response.data.returns.user);
        $location.path('/search');
      } else {
        alert('invalid login | error : ' + response.data.error);
      }
    })
   }
  window.onSignIn = onSignIn;

  // Bouton Login normal
  $scope.login = function() {
		var email = $scope.email;
		var password = $scope.password;
		$http({
			url: API_URL+'/api/connect',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'email='+email+'&password='+password
		}).then(function(response) {
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
			url: API_URL + '/api/register',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'firstname='+firstname+'&lastname='+lastname+'&email='+email+'&password='+password+'&password_confirm='+password_confirm
		}).then(function(response) {
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
app.controller('resultsCtrl', function parentCtrl($scope, $http, $sce, user) {
  $scope.title = 'result';
  $scope.user = user.getUser();
  $scope.showloader = true;

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }

  $http.get(API_URL + '/api/home/lyon').then(function(response) {
    if(response.data.return_code == 0) {
      $scope.services = response.data.returns;
      console.log(response.data);
      $scope.showloader = false;
    } else {
      alert('error : ' + response.data.error);
    }
  });
});
