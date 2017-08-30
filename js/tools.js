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
