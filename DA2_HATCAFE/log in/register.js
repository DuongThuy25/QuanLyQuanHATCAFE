function register() {
    const username = $('#username').val();
    const email = $('#email').val();
    const password = $('#password').val();
    const phone = $('#phone').val();

    $.ajax({
        url: 'https://localhost:7209/api/User/register', // Địa chỉ API đăng ký
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            username: username,
            password: password,
            email: email,
            phoneNumber: phone,
            role: 'user' // Mặc định là 'user', có thể điều chỉnh nếu cần
        }),
        success: function(response) {
            alert(response.message);
            window.location.href = 'log in.html'; // Chuyển hướng đến trang đăng nhập
        },
        error: function(jqXHR) {
            alert(jqXHR.responseJSON.message || 'Đăng ký không thành công.');
        }
    });
}
