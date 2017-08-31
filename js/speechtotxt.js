// Page de recherche initial : /search/
app.controller('speechtCtrl', function speechtCtrl($scope, $rootScope, $http, $location, user, storage) {
    $scope.title = 'search';
    $scope.user = user.getUser();

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
            var parameter = response.data.result.parameters.parameter;
            var intent = response.data.result.metadata.intentName;
            actionSpeech(intent, parameter);
        }, function () {
            console.log('Erreur récup Api.Ai => Voir Allow...')
        });
    }

    // On regarde sur quel api on tape avec le retour de API.AI
    function actionSpeech(action, newParameter) {
        if (action == "weather") {
            storage.setStorage('weather_ville', newParameter);
            $location.path('/home/');
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

});
