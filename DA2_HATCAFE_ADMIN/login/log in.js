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
        url: 'https://localhost:7111/api/Admin/users/login', // Địa chỉ API đăng nhập
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ username: username, password: password }),
        success: function(response) {

            // Kiểm tra vai trò và chuyển hướng theo role
            if (response.role === 'admin') {
                alert(response.message);
                window.location.href = '../admin/admin.html'; // Thay đổi thành trang bạn muốn chuyển hướng tới
            } else if (response.role === 'user') {
                alert("bạn không có quyền được vào trang này");
                return;
            }

            // Lưu user_id vào localStorage hoặc sessionStorage để sử dụng sau này
            localStorage.setItem('user_id', response.user_id);
        },
        error: function(jqXHR) {
            alert(jqXHR.responseJSON.message || 'Đăng nhập không thành công.');
        }
    });
}

