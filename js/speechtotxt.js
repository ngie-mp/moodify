app.controller('speechtCtrl', function speechtCtrl($scope, $http, user) {
  $scope.title = 'search';
  $scope.user = user.getUser();

  var recognition;
  var accessToken = "4b8289d60d15475f8380de1d4086aff6";
  var baseUrl = "https://api.api.ai/v1/";

  $scope.switchRecognition = function() {
      if (recognition) {
          stopRecognition();
      } else {
          startRecognition();
      }
  }

  $scope.keyPress = function(){

  }


  $(document).ready(function () {
      $("#input").keypress(function (event) {
          if (event.which == 13) {
              event.preventDefault();
              send();
          }
      });
      $("#rec").click(function (event) {
          switchRecognition();
      });
  });

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
      $("#input").val(text);
      send();
  }

  function send() {
    var text = $("#input").val();
    var non_compris = "";

    var req = {
     method: 'POST',
     url: baseUrl + "query?v=20150910",
     headers: {
       'Content-Type': 'application/json; charset=utf-8',
       "Authorization": "Bearer " + accessToken
     },
     data: JSON.stringify({query: text, lang: "en", sessionId: "somerandomthing"})
    }

    $http(req).then(function(response){
      console.log('send success');
      console.log(response);
      var parameter = response.data.result.parameters.geocityfr;
      var intent = response.data.result.metadata.intentName;
      var speech = response.data.result.fulfillment.speech;
      actionSpeech(intent, parameter);
      talkResponse(speech);
      //setInput2(data.result.parameters.geocityfr);
    }, function(){});
  }

  function actionSpeech(action, parameter){
    if(action == "weather"){
      localStorage.setItem('geocityfr', parameter);
      window.location = '/#!/home/';
    }
  }

  function talkResponse(talk_text){;
    synth = window.speechSynthesis;
    var utterThis = new SpeechSynthesisUtterance(talk_text);
    synth.speak(utterThis);
  }

});
