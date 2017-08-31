const API_URL = "http://api.moodify.dev";
const URL_SPEECH_TO_TEXT = "https://api.api.ai/v1/";
const TOKEN_SPEECH_TO_TEXT = "4b8289d60d15475f8380de1d4086aff6";

var app = angular.module('MoodApp', ['ngRoute', 'ngSanitize']);
app.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      resolve: {
        check: function ($location, user) {
          if (user.isUserLoggedIn()) {
            $location.path('/search');
          }
        },
      },
      templateUrl: 'partials/login.html',
      controller: 'loginCtrl'
    }).
    when('/search/', {
      resolve: {
        check: function ($location, user) {
          if (!user.isUserLoggedIn()) {
            $location.path('/');
          }
        },
      },
      templateUrl: 'partials/search.html',
      controller: 'speechtCtrl'
    }).
    when('/home/', {
      resolve: {
        check: function ($location, user) {
          if (!user.isUserLoggedIn()) {
            $location.path('/');
          }
        },
      },
      templateUrl: 'partials/home.html',
      controller: 'homeCtrl'
    }).
    when('/detailDrinks/', {
      resolve: {
        check: function ($location, user) {
          if (!user.isUserLoggedIn()) {
            $location.path('/');
          }
        },
      },
      templateUrl: 'partials/detail-drinks.html',
      controller: 'homeCtrl'
    }).
    when('/detailFood/', {
      resolve: {
        check: function ($location, user) {
          if (!user.isUserLoggedIn()) {
            $location.path('/');
          }
        },
      },
      templateUrl: 'partials/detail-food.html',
      controller: 'homeCtrl'
    }).
    when('/detailUpcomingMovies/', {
      resolve: {
        check: function ($location, user) {
          if (!user.isUserLoggedIn()) {
            $location.path('/');
          }
        },
      },
      templateUrl: 'partials/detail-upcoming-movies.html',
      controller: 'homeCtrl'
    }).
    when('/detailTV/', {
      resolve: {
        check: function ($location, user) {
          if (!user.isUserLoggedIn()) {
            $location.path('/');
          }
        },
      },
      templateUrl: 'partials/detail-tv.html',
      controller: 'homeCtrl'
    }).
    when('/detailActivity/', {
      resolve: {
        check: function ($location, user) {
          if (!user.isUserLoggedIn()) {
            $location.path('/');
          }
        },
      },
      templateUrl: 'partials/activity.html',
      controller: 'homeCtrl'
    }).
    when('/home/', {
      resolve: {
        check: function ($location, user) {
          if (!user.isUserLoggedIn()) {
            $location.path('/');
          }
        },
      },
      templateUrl: 'partials/home.html',
      controller: 'homeCtrl'
    }).
    when('/logout/', {
      resolve: {
        deadResolve: function ($location, user) {
          user.clearData();
          $location.path('/');
        }
      }
    })
    .otherwise({
      template: '404'
    });
});

app.service('user', function () {
  var loggedin = false;
  var is_google = false;

  this.setUser = function (user) {
    userInfos = user;
  };
  this.getUser = function () {
    return JSON.parse(localStorage.getItem('user'));
  };

  this.isUserLoggedIn = function () {
    if (!!localStorage.getItem('user')) {
      loggedin = true;
      var data = JSON.parse(localStorage.getItem('user'));
    }
    return loggedin;
  };

  this.isUserGoogleLoggedIn = function () {
    console.log(is_google);
    if (!!localStorage.getItem('user')) {
      is_google = false;
      var data = JSON.parse(localStorage.getItem('user'));
      if (data.social_id == 0) {
        is_google = true;
      }
    }
    return is_google;
  };

  this.saveData = function (data) {
    loggedin = true;
    localStorage.setItem('user', data);
  };

  this.clearData = function () {
    loggedin = false;
    console.log('test');
    localStorage.removeItem('user');
  }
});

app.service('storage', function () {

  this.getStorage = function (nom_parameter) {
    return localStorage.getItem(nom_parameter);
  };

  this.setStorage = function (nom_parameter, value_parameter) {
    localStorage.setItem(nom_parameter, value_parameter);
  };

  this.clearStorage = function () {
    localStorage.removeItem(nom_parameter);
  }

});

// Gestion login : /
app.controller('loginCtrl', function ($scope, $http, $location, user) {
  $scope.title = 'login';

  $scope.googleLogin = function () {
    $(".abcRioButtonContentWrapper").click();
  }

  function onSignIn(googleUser) {
    googleUser.disconnect();
    var id_token = googleUser.getAuthResponse().id_token;
    $http({
      url: API_URL + '/api/registerGoogle/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: 'id_token=' + id_token
    }).then(function (response) {
      if (response.data.return_code == 0) {
        user.saveData(response.data.returns.user);
        $location.path('/search');
      } else {
        alert('invalid login | error : ' + response.data.error);
      }
    })
  }
  window.onSignIn = onSignIn;

  // Bouton Login normal
  $scope.login = function () {
    var email = $scope.email;
    var password = $scope.password;
    $http({
      url: API_URL + '/api/connect',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: 'email=' + email + '&password=' + password
    }).then(function (response) {
      if (response.data.return_code == 0) {
        user.saveData(response.data.returns.user);
        $location.path('/search');
      } else {
        alert('invalid login | error : ' + response.data.error);
      }
    })
  }

  // Bouton Register normal
  $scope.register = function () {
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
      data: 'firstname=' + firstname + '&lastname=' + lastname + '&email=' + email + '&password=' + password + '&password_confirm=' + password_confirm
    }).then(function (response) {
      if (response.data.return_code == 0) {
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
app.controller('homeCtrl', function parentCtrl($scope, $rootScope, $http, $sce, $location, user, storage) {
  $scope.title = 'result';
  $scope.user = user.getUser();

  var dt = new Date();
	var time = dt.getHours() + ":" + dt.getMinutes();
	$scope.datenow = time;

  $rootScope.trustSrc = function (src) {
    return $sce.trustAsResourceUrl(src);
  }

  var ville = storage.getStorage('weather_ville');
  $rootScope.showloader = true;
  $http.get(API_URL + '/api/home/'+ville).then(function (response) {
    if (response.data.return_code == 0) {
      $rootScope.services = response.data.returns;
      console.log(response.data);
      $rootScope.showloader = false;
      $(".sticky-input").hide();
      $("#openResearch img").css({'transform': 'rotate(0deg)'});
      $("#openResearch").css('bottom', '0');
    } else {
      alert('error : ' + response.data.error);
    }
  });

  // Recognition
  var recognition;

  $scope.switchRecognition = function () {
    if (recognition) {
      stopRecognition();
    } else {
      startRecognition();
    }
  }

  $scope.keyPress = function (event) {
    if (event.which == 13) {
      event.preventDefault();
      send();
    }
  }

  function startRecognition() {
    recognition = new webkitSpeechRecognition();
    recognition.onstart = function (event) {
      $('#city').val('');
      $('#input').val('');
    };
    recognition.onresult = function (event) {
      var text = "";
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        text += event.results[i][0].transcript;
      }
      setInput(text);
      stopRecognition();
    };
    recognition.onend = function () {
      stopRecognition();
    };
    recognition.lang = "fr-FR";
    recognition.start();
  }

  function stopRecognition() {
    if (recognition) {
      recognition.stop();
      recognition = null;
    }
  }

  function setInput(text) {
    $scope.inputSearch = null
    send();
  }

  function send() {
    var text = $scope.inputSearch;
    var non_compris = "";

    var req2 = {
      method: 'POST',
      url: URL_SPEECH_TO_TEXT + "query?v=20150910",
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        "Authorization": "Bearer " + TOKEN_SPEECH_TO_TEXT
      },
      data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" })
    }

    $http(req2).then(function (response) {
      console.log('send success');
      console.log(response);
      var newParameter = response.data.result.parameters.parameter;
      console.log(newParameter);
      var intent = response.data.result.metadata.intentName;
      var speech = response.data.result.fulfillment.speech;
      actionSpeech(intent, newParameter);
      talkResponse(speech);
    }, function () {
      console.log('Erreur récup Api.Ai => Voir Allow...')
    });
  }

  function actionSpeech(action, newParameter) {
    if (action == "weather") {
      storage.setStorage('weather_ville', newParameter);
      $rootScope.showloader = true;
      $http.get(API_URL + '/api/home/'+newParameter).then(function (response) {
        if (response.data.return_code == 0) {
          $rootScope.services = response.data.returns;
          console.log(response.data);
          $rootScope.showloader = false;
          hideSearchBar();
        } else {
          alert('error : ' + response.data.error);
        }
      });
    }else if(action == "drinks"){
      //$rootScope.showloader = true;
      $http.get(API_URL + '/api/drinks/'+newParameter).then(function (response) {
        if (response.data.return_code == 0) {
          $rootScope.drinks = response.data.returns;
          console.log(response.data);
          //$rootScope.showloader = false;
          hideSearchBar();
          $location.path('/detailDrinks/');
        } else {
          alert('error : ' + response.data.error);
        }
      });
    }else if(action == "food"){
      //$rootScope.showloader = true;
      $http.get(API_URL + '/api/food/'+newParameter).then(function (response) {
        if (response.data.return_code == 0) {
          $rootScope.drinks = response.data.returns;
          console.log(response.data);
          //$rootScope.showloader = false;
          hideSearchBar();
          $location.path('/detailFood/');
        } else {
          alert('error : ' + response.data.error);
        }
      });
    }else if(action == "upcomingMovies"){
      //$rootScope.showloader = true;
      $http.get(API_URL + '/api/upcomingMovies/').then(function (response) {
        if (response.data.return_code == 0) {
          $rootScope.drinks = response.data.returns;
          console.log(response.data);
          //$rootScope.showloader = false;
          hideSearchBar();
          $location.path('/detailUpcomingMovies/');
        } else {
          alert('error : ' + response.data.error);
        }
      });
    }else if(action == "TV"){
      //$rootScope.showloader = true;
      $http.get(API_URL + '/api/TV/'+newParameter).then(function (response) {
        if (response.data.return_code == 0) {
          $rootScope.drinks = response.data.returns;
          console.log(response.data);
          //$rootScope.showloader = false;
          hideSearchBar();
          $location.path('/detailTV/');
        } else {
          alert('error : ' + response.data.error);
        }
      });
    }else if(action == "activity"){
      //$rootScope.showloader = true;
      $http.get(API_URL + '/api/activity/'+newParameter).then(function (response) {
        if (response.data.return_code == 0) {
          $rootScope.drinks = response.data.returns;
          console.log(response.data);
          //$rootScope.showloader = false;
          hideSearchBar();
          $location.path('/detailActivity/');
        } else {
          alert('error : ' + response.data.error);
        }
      });
    }
  }

  function talkResponse(talk_text) {
    synth = window.speechSynthesis;
    var utterThis = new SpeechSynthesisUtterance(talk_text);
    synth.speak(utterThis);
  }

  function hideSearchBar(){
    $(".sticky-input").hide();
    $("#openResearch img").css({'transform': 'rotate(0deg)'});
    $("#openResearch").css('bottom', '0');
  }

});
