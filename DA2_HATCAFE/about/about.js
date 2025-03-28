$(document).ready(function () {
  const userId = localStorage.getItem("user_id");
  if (userId) {
    // Lấy thông tin người dùng từ API
    $.ajax({
      url: "https://localhost:7028/api/User/" + userId,
      type: "GET",
      success: function (response) {
        $("#user-info").html(`
                    <span class="text-white me-3">Xin chào, ${response.username}</span>
                    <button class="btn btn-outline-light" id="logout-btn">Đăng xuất</button>
                `);
        $("#logout-btn").click(function () {
          localStorage.removeItem("user_id");
          window.location.href = "../log in/log in.html";
        });
      },
      error: function () {
        console.log("Không lấy được thông tin người dùng.");
      },
    });
  } else {
    window.location.href = "../log in/log in.html";
  }
});
