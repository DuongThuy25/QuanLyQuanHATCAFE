$(document).ready(function() {
    // Lắng nghe sự kiện nhấn phím Enter
    $('#username, #password').on('keydown', function(event) {
        if (event.key === 'Enter') {
            login(); // Gọi hàm login khi nhấn phím Enter
        }
    });
});


function login() {
    const username = $('#username').val();
    const password = $('#password').val();

    $.ajax({
        url: 'https://localhost:7028/api/User/login', // Địa chỉ API đăng nhập
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ username: username, password: password }),
        success: function(response) {
            alert(response.message);

            // Kiểm tra vai trò và chuyển hướng theo role
            if (response.role === 'user') {
                window.location.href = '../main/main.html'; // Thay đổi thành trang bạn muốn chuyển hướng tới
            } else if (response.role === 'admin') {
                window.location.href = 'http://127.0.0.1:5501/admin.html'; // Thay đổi thành trang admin
            }

            // Lưu user_id vào localStorage hoặc sessionStorage để sử dụng sau này
            localStorage.setItem('user_id', response.user_id);
        },
        error: function(jqXHR) {
            alert(jqXHR.responseJSON.message || 'Đăng nhập không thành công.');
        }
    });
}

