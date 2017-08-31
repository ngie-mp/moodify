const API_URL = "http://api.it-squad.fr";
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
        check: function ($location, user, storage) {        
          if (!user.isUserLoggedIn() || storage.getStorage('weather_ville') == undefined) {
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
      controller: 'drinksCtrl'
    }).
    when('/detailFood/', {
      resolve: {
        check: function ($location, user) {
          if (!user.isUserLoggedIn()) {
            $location.path('/');
          }
        },
      },
      templateUrl: 'partials/recipe-detail.html',
      controller: 'foodCtrl'
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
      controller: 'upcomingMoviesCtrl'
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
      controller: 'tvCtrl'
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
      controller: 'activityCtrl'
    }).
    when('/logout/', {
      resolve: {
        deadResolve: function ($location, user, storage) {
          user.clearData();
          storage.clearStorage();
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
    localStorage.removeItem('ingredient_food');
    localStorage.removeItem('taste_drinks');
    localStorage.removeItem('type_media_tv');
    localStorage.removeItem('weather_ville');
  }

});

// Gestion login : /
app.controller('loginCtrl', function ($scope, $http, $location, user) {
  
  $scope.title = 'login';

  // Touche Entrée pour l'input password du login
  $scope.keyPress = function (event) {
    if (event.which == 13) {
        $scope.login();
    }
}

  // Boutton trigger googleAuth
  $scope.googleLogin = function () {
    $(".abcRioButtonContentWrapper").click();
  }

  // Retour de la modal de connexion googleAuth
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
  $scope.inputSearch = null;

  var dt = new Date();
  var time = dt.getHours() + ":" + (dt.getMinutes()<10?'0':'') + dt.getMinutes();
  $scope.datenow = time;

  $scope.trustSrc = function (src) {
    return $sce.trustAsResourceUrl(src);
  }

  // Récupère la météo avec toutes les données des tab
  $scope.getWeather = function(){
    $scope.showloader = true;
    $scope.weather_ville = storage.getStorage('weather_ville');
    $http.get(API_URL + '/api/home/' + $scope.weather_ville).then(function (response) {
      if (response.data.return_code == 0) {
        $scope.services = response.data.returns;
        console.log(response.data);
        $scope.showloader = false;
        hideSearchBar();
        var speech = "Voici la météo pour " + $scope.weather_ville;
        talkResponse(speech);
      } else {
        alert('error : ' + response.data.error);
      }
    });
  }

  // Si on est sur la page home, on lance la requete de la météo avec toutes les données des tab
  if(storage.getStorage('weather_ville') != undefined){
    $scope.getWeather();
  }

  ///////////////////////////////////////////////////////////////////////////
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
      console.log($scope.inputSearch);
      console.log($('#inputSearch').val());
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
    $scope.inputSearch = text;
    send();
  }

  function send() {
    var text = $scope.inputSearch;
    var non_compris = "";

    var req = {
      method: 'POST',
      url: URL_SPEECH_TO_TEXT + "query?v=20150910",
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        "Authorization": "Bearer " + TOKEN_SPEECH_TO_TEXT
      },
      data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" })
    }

    $http(req).then(function (response) {
      console.log(response);
      var newParameter = response.data.result.parameters.parameter;
      var intent = response.data.result.metadata.intentName;
      actionSpeech(intent, newParameter);
    }, function () {
      console.log('Erreur récup Api.Ai => Voir Allow...')
    });
  }

  // On regarde sur quel api on tape avec le retour de API.AI
  function actionSpeech(action, newParameter) {
    if (action == "weather") {
      storage.setStorage('weather_ville', newParameter);
      $scope.getWeather();
    }
    else if (action == "drinks") {
      storage.setStorage('taste_drinks', newParameter);
      $location.path('/detailDrinks/');
    }
    else if (action == "food") {
      storage.setStorage('ingredient_food', newParameter);
      $location.path('/detailFood/');
    }
    else if (action == "upcomingMovies") {
      $location.path('/detailUpcomingMovies/');
    }
    else if (action == "TV") {
      storage.setStorage('type_media_tv', newParameter);
      $location.path('/detailTV/');
    }
    else if (action == "activity") {
      $location.path('/detailActivity/');
    }
  }

  function hideSearchBar() {
    $(".sticky-input").hide();
    $("#openResearch img").css({ 'transform': 'rotate(0deg)' });
    $("#openResearch").css('bottom', '0');
  }

});

// Page details : /detailsFood/
app.controller('foodCtrl', function parentCtrl($scope, $http, storage) {

  $scope.showloader = true;

  $scope.ingredient_food = storage.getStorage('ingredient_food');
  $http.get(API_URL + '/api/food/' + $scope.ingredient_food).then(function (response) {
    if (response.data.return_code == 0) {
      $scope.showloader = false;
      $scope.food = response.data.returns.recipes;
      var tts = "Je vous propose différentes recettes avec l'ingrédient " + $scope.ingredient_food;
      for (let i = 0; i < $scope.food.length; i++) {
        tts = tts + $scope.food[i].title + " ";
      }
      talkResponse(tts);
    } else {
      alert('error : ' + response.data.error);
    }
  });
});

// Page details : /detailsDrinks/
app.controller('drinksCtrl', function parentCtrl($scope, $http, $sce, storage) {

  $scope.showloader = true;

  $scope.trustSrc = function (src) {
    return $sce.trustAsResourceUrl(src);
  }

  $scope.taste_drinks = storage.getStorage('taste_drinks');
  $http.get(API_URL + '/api/drinks/' + $scope.taste_drinks).then(function (response) {
    if (response.data.return_code == 0) {
      $scope.showloader = false;
      $scope.drinks = response.data.returns;
      var tts = "Je vous propose deux boissons : ";
      tts = tts + $scope.drinks.drink_alcohol.name;
      tts = tts + " - et - ";
      tts = tts + $scope.drinks.drink_not_alcohol.name;
      talkResponse(tts);
    } else {
      alert('error : ' + response.data.error);
    }
  });
});

// Page details : /detailsUpcomingMovies/
app.controller('upcomingMoviesCtrl', function parentCtrl($scope, $http, $sce, storage) {

  $scope.showloader = true;

  $http.get(API_URL + '/api/upcomingMovies/').then(function (response) {
    if (response.data.return_code == 0) {
      $scope.showloader = false;
      $scope.upcomingMovies = response.data.returns.movies;
      var tts = "Voici quelques films que vous pourrez prochainement aller voir au cinéma : ...";
      for (let i = 0; i < $scope.upcomingMovies.length; i++) {
        tts = tts + $scope.upcomingMovies[i].title + ", ...";
      }
      talkResponse(tts);
    } else {
      alert('error : ' + response.data.error);
    }
  });
});

// Page details : /detailsTv/
app.controller('tvCtrl', function parentCtrl($scope, $http, $sce, storage) {
  
  $scope.showloader = true;

  $scope.type_media_tv = storage.getStorage('type_media_tv');
  $http.get(API_URL + '/api/TV/' + $scope.type_media_tv).then(function (response) {
    if (response.data.return_code == 0) {
      $scope.showloader = false;
      $scope.TV = response.data.returns.media;
      var tts = "Je vous propose quelques " + $scope.type_media_tv + " que vous pourriez regarder : ...";
      for (let i = 0; i < $scope.TV.length; i++) {
        tts = tts + $scope.TV[i].title + ", ...";
      }
      talkResponse(tts);
    } else {
      alert('error : ' + response.data.error);
    }
  });
});

// Page details : /detailsActivities/
app.controller('activityCtrl', function parentCtrl($scope, $http, $sce, storage) {

  $scope.showloader = true;

  $http.get(API_URL + '/api/activity/').then(function (response) {
    if (response.data.return_code == 0) {
      $scope.showloader = false;
      $scope.activities = response.data.returns.activities;
      var tts = "Je vous propose différentes choses que vous pouvez faire : ...";
      for (let i = 0; i < $scope.activities.length; i++) {
        tts = tts + $scope.activities + ", ...";
      }
      talkResponse(tts);
    } else {
      alert('error : ' + response.data.error);
    }
  });
});

// Text To Speech
function talkResponse(talk_text) {
  synth = window.speechSynthesis;
  var utterThis = new SpeechSynthesisUtterance(talk_text);
  synth.speak(utterThis);
}