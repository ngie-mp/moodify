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
        $scope.inputSearch = null
        send();
    }

    function send() {
        var text = $scope.inputSearch;
        var non_compris = "";

        /*var req = {
            method: 'POST',
            url: URL_SPEECH_TO_TEXT + "query?v=20150910",
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                "Authorization": "Bearer " + TOKEN_SPEECH_TO_TEXT
            },
            data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" })
        }*/

        var req = {
            method: 'POST',
            url: API_URL + '/api/speech/',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
            data: 'text=' + text
        }

        $http(req).then(function (response) {
            console.log('send success');
            console.log(response);
            var parameter = response.data.result.parameters.geocityfr;
            var intent = response.data.result.metadata.intentName;
            var speech = response.data.result.fulfillment.speech;
            actionSpeech(intent, parameter);
            talkResponse(speech);
        }, function () {
            console.log('Erreur récup Api.Ai => Voir Allow...')
        });
    }

    function actionSpeech(action, parameter) {
        if (action == "weather") {
            storage.setStorage('weather_ville', newParameter);
            $rootScope.showloader = true;
            $http.get(API_URL + '/api/home/'+parameter).then(function (response) {
              if (response.data.return_code == 0) {
                $rootScope.services = response.data.returns;
                console.log(response.data);
                $rootScope.showloader = false;
                $location.path('/home/');
              } else {
                alert('error : ' + response.data.error);
              }
            });
        }else if(action == "drinks"){
            //$rootScope.showloader = true;
            $http.get(API_URL + '/api/drinks/'+parameter).then(function (response) {
              if (response.data.return_code == 0) {
                $rootScope.drinks = response.data.returns;
                console.log(response.data);
                //$rootScope.showloader = false;
              } else {
                alert('error : ' + response.data.error);
              }
            });
          }
    }

    function talkResponse(talk_text) {
        ;
        synth = window.speechSynthesis;
        var utterThis = new SpeechSynthesisUtterance(talk_text);
        synth.speak(utterThis);
    }

});
