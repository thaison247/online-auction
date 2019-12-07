$(document).ready(function() {
  $('a.signup-window').click(function() {
    //lấy giá trị thuộc tính href - chính là phần tử "#signup-box"
    var signupBox = $(this).attr('href');
    $('.signin').fadeOut(300);
    //cho hiện hộp đăng nhập trong 300ms
    $(signupBox).fadeIn(300);

    // thêm phần tử id="over" vào sau body
    $('body').append('<div id="over">');
    $('#over').fadeIn(300);

    var body = document.getElementById("body");
    body.style["overflow"] = "hidden";

    return false;
  });

  // khi click đóng hộp thoại
  $(document).on('click', "a.close", function() {
    $('#over, .signup').fadeOut(300 , function() {
      $('#over').remove();
    });

    var body = document.getElementById("body");
    body.style["overflow"] = "visible";

    return false;
  });
});
