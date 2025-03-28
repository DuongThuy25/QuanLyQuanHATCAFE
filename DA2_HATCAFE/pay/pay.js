$(document).ready(function () {
  const userId = localStorage.getItem("user_id");
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get("orderId");

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

        $("#info").html(`
                    <br>
                    <p><strong>Tên khách hàng:</strong> ${response.username}</p>
                    <p><strong>Sô điện thoại:</strong> ${response.phoneNumber}</p>
                    <p><strong>Email:</strong> ${response.email}</p>
                    <br>
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

    // Hàm định dạng giá
    function formatPrice(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Cập nhật tổng giá
    function updateTotalPrice() {
      let totalPrice = 0;
      $("#order-summary .cart-item-row").each(function () {
        const totalItemPrice =
          parseFloat($(this).find(".total-price").data("price")) || 0;
        totalPrice += totalItemPrice;
      });
      $("#total-price-all").text(formatPrice(totalPrice) + "₫");
    }

    // Lấy thông tin chi tiết order
    $.ajax({
      url: `https://localhost:7209/api/User/orders/OrderDetails/${orderId}`,
      type: "GET",
      success: function (orderdetails) {
        orderdetails.forEach((orderdetail) => {
          const total = orderdetail.price * orderdetail.quantity;
          const orderItem = $(`
                        <div class="row cart-item-row">
                            <div class="col-5 d-flex align-items-center">
                                <img src="${
                                  orderdetail.image_url
                                }" alt="Sản phẩm" class="product-image">
                                <div class="ms-3">
                                    <p class="m-0">${
                                      orderdetail.product_name
                                    }</p>
                                    <p class="product-id" value="${
                                      orderdetail.product_id
                                    }" style="display: none;"></p>
                                    <small class="text-muted">size M</small>
                                </div>
                            </div>
                            <div class="col-2 text-center">${
                              orderdetail.quantity
                            }</div>
                            <div class="col-2 text-center total-price"data-price="${
                              orderdetail.price
                            }">${formatPrice(orderdetail.price)}₫</div>
                        </div>
                    `);

          $("#order-summary").append(orderItem);
        });

        // Cập nhật tổng giá
        updateTotalPrice();
      },
      error: function () {
        console.log("Không lấy được giỏ hàng.");
      },
    });

    // Sự kiện khi nhấn nút "Xác nhận thanh toán"
    $("#confirm-order-btn").click(function () {
      const paymentMethod = $("#payment-method").val();
      const shippingAddress = $("#shipping-address").val();

      if (!shippingAddress) {
        alert("Địa chỉ giao hàng không được để trống.");
        return;
      }

      // Gửi dữ liệu đến API để thêm thông tin vào Payments và Shipping
      $.ajax({
        url: "https://localhost:7209/api/User/payments",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          order_id: orderId,
          payment_method: paymentMethod,
          shipping_address: shippingAddress,
        }),
        success: function () {
          alert("Thanh toán thành công !!!");
          window.location.href = "../orders/orders.html";
        },
        error: function () {
          alert("Đã có lỗi xảy ra trong quá trình thanh toán.");
        },
      });
    });

    let isOrderConfirmed = false; // Biến theo dõi trạng thái thanh toán

    // Hàm hiển thị Toast
    function showToast(type, message) {
        const toastId = type === "success" ? "#successToast" : "#errorToast";
        const toastElement = $(toastId);
        toastElement.find(".toast-body").text(message);
        const toast = new bootstrap.Toast(toastElement[0]);
        toast.show();
    }

    // Khi nhấn nút "Xác nhận thanh toán", cập nhật trạng thái
    $("#confirm-order-btn").click(function () {
        isOrderConfirmed = true;
        showToast("success", "Thanh toán thành công! Cảm ơn bạn.");
    });

    // Gắn sự kiện click cho các liên kết và nút
    $(document).on("click", "a, button", function (e) {
        if (!isOrderConfirmed) {
            const isPaymentButton = $(this).attr("id") === "confirm-order-btn"; // Kiểm tra nếu đây là nút thanh toán
            if (!isPaymentButton) {
                e.preventDefault(); // Ngăn rời khỏi trang
                showToast("error", "Đơn hàng chưa thanh toán. Nếu rời đi, đơn sẽ bị hủy!");
                const shouldCancelOrder = confirm("Bạn có muốn hủy đơn hàng không?");
                if (shouldCancelOrder) {
                    // Gọi API để xóa đơn hàng
                    $.ajax({
                        url: `https://localhost:7028/api/User/orders/${orderId}`,
                        type: "DELETE",
                        success: function () {
                            showToast("success", "Đơn hàng đã được hủy.");
                            window.location.href = $(e.target).attr("href"); // Chuyển hướng sau khi xóa
                        },
                        error: function () {
                            showToast("error", "Có lỗi xảy ra khi hủy đơn hàng.");
                        },
                    });
                }
            }
        }
    });
  } else {
    window.location.href = "../log in/log in.html";
  }
});
