function resetPassword() {
    const email = $('#email').val();
    const username = $('#username').val();
    const phone = $('#phone').val();

    $.ajax({
        url: 'http://localhost:your_api_port/api/user/request-reset-password', // Địa chỉ API yêu cầu đặt lại mật khẩu
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(email),
        success: function(response) {
            alert(response.message);
            // Thông báo về token được gửi đến email
        },
        error: function(jqXHR) {
            alert(jqXHR.responseJSON.message || 'Yêu cầu đặt lại mật khẩu không thành công.');
        }
    });
}

// Khi người dùng đã có mã token từ email và muốn đặt lại mật khẩu
function updatePassword() {
    const newPassword = $('#new-password').val(); // Giả sử bạn có trường cho mật khẩu mới
    const resetToken = $('#reset-token').val(); // Giả sử bạn có trường cho mã token

    $.ajax({
        url: 'http://localhost:your_api_port/api/user/reset-password', // Địa chỉ API đặt lại mật khẩu
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            email: email,
            newPassword: newPassword,
            resetToken: resetToken
        }),
        success: function(response) {
            alert(response.message);
            window.location.href = 'log in.html'; // Chuyển hướng đến trang đăng nhập
        },
        error: function(jqXHR) {
            alert(jqXHR.responseJSON.message || 'Đặt lại mật khẩu không thành công.');
        }
    });
}
