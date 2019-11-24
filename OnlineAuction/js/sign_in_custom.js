$(document).ready(function() {
  $('a.signin-window').click(function() {
    //lấy giá trị thuộc tính href - chính là phần tử "#signin-box"
    var signinBox = $(this).attr('href');
    $('.signup').fadeOut(300);
    //cho hiện hộp đăng nhập trong 300ms
    $(signinBox).fadeIn(300);

    // thêm phần tử id="over" vào sau body
    $('body').append('<div id="over">');
    $('#over').fadeIn(300);

    var body = document.getElementById("body");
    body.style["overflow"] = "hidden";

    return false;
  });

  // khi click đóng hộp thoại
  $(document).on('click', "a.close", function() {
    $('#over, .signin').fadeOut(300 , function() {
      $('#over').remove();
    });

    var body = document.getElementById("body");
    body.style["overflow"] = "visible";

    return false;
  });
});


//forgot password
$(document).ready(function() {
  $('a.forgot-window').click(function() {
    //lấy giá trị thuộc tính href - chính là phần tử "#forgot-box"
    var forgotBox = $(this).attr('href');
    $('.signin').fadeOut(300);
    //cho hiện hộp đăng nhập trong 300ms
    $(forgotBox).fadeIn(300);

    // thêm phần tử id="over" vào sau body
    $('body').append('<div id="over">');
    $('#over').fadeIn(300);

    var body = document.getElementById("body");
    body.style["overflow"] = "hidden";

    return false;
  });

  // khi click đóng hộp thoại
  $(document).on('click', "a.close", function() {
    $('#over, .forgot').fadeOut(300 , function() {
      $('#over').remove();
    });

    var body = document.getElementById("body");
    body.style["overflow"] = "visible";

    return false;
  });
});