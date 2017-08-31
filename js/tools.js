/* Sign in & Sign out animation */

$(function () {
    $(document).on('click', ".btn-login", function () {
        $(".form-signin").toggleClass("form-signin-left");
        $(".form-signup").toggleClass("form-signup-left");
        $(".frame").toggleClass("frame-long");
        $(".signup-inactive").toggleClass("signup-active");
        $(".signin-active").toggleClass("signin-inactive");
        $(this).removeClass("idle").addClass("active");
    });
});

$(document).on('click', ".buttonRec", function () {
  $(this).toggleClass("active");
});

$(document).on('click', '#openResearch', function(){
  if($(".sticky-input").is(":visible")){
    $(".sticky-input").hide()
    $("#openResearch img").css({'transform': 'rotate(0deg)'});
    $("#openResearch").css('bottom', '0');
  }else{
    $(".sticky-input").show()
  }
});

$(document).ready(function() {
if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
})

function showPosition(position) {
		$.ajax({ url:'http://maps.googleapis.com/maps/api/geocode/json?latlng='+position.coords.latitude+','+position.coords.longitude+'&sensor=true',
         success: function(data){
	         for (var i = 0; i < data.results[4].address_components.length; i++) {
    			 	for (var j = 0; j < data.results[4].address_components[i].types.length; j++) {
        			if(data.results[4].address_components[i].types[j] == 'locality') {
            		var city_name = data.results[4].address_components[i].long_name;
                $("#body_corp input.ng-pristine").val("météo à " + city_name)
        		}
    			}
				}
		   }
		})
  }
