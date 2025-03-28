$(document).ready(function () {
  const userId = localStorage.getItem("user_id");
  if (userId) {
    // Lấy thông tin người dùng từ API
    $.ajax({
      url: "https://localhost:7111/api/Admin/users/" + userId,
      type: "GET",
      success: function (response) {
        // Hiển thị thông tin người dùng và nút đăng xuất
        $("#user-info").empty();
        $("#user-info").html(`
                    <span class="text-white me-3">Xin chào, ${response.username}</span>
                    <button class="btn btn-outline-light" id="logout-btn">Đăng xuất</button>
                `);

        //đăng xuất
        $("#logout-btn").click(function () {
          localStorage.removeItem("user_id");
          window.location.href = "../login/log in.html";
        });
      },
      error: function () {
        console.log("Không lấy được thông tin người dùng.");
      },
    });
  } else {
    window.location.href = "../login/log in.html";
  }

  const $menuItems = $(".menu-item");
  const $sections = $(".section");

  // Thay đổi hiển thị section khi nhấn vào menu
  $menuItems.on("click", function () {
    // Xóa active trên tất cả menu và section
    $menuItems.removeClass("active");
    $sections.removeClass("active");

    // Thêm active cho menu và section được chọn
    $(this).addClass("active");
    $("#" + $(this).data("section")).addClass("active");
    loadDataAll();
  });

  const API_URL = "https://localhost:7111/api/Admin";

  
  function showError(message) {
    const $errorToast = $("#errorToast");
    $errorToast.find(".toast-body").text(message);
    const errorToast = new bootstrap.Toast($errorToast[0]);
    errorToast.show();
  }

  function showSuccess(message) {
    const $successToast = $("#successToast");
    $successToast.find(".toast-body").text(message);
    const successToast = new bootstrap.Toast($successToast[0]);
    successToast.show();
  }

  // ** Products Management **
  function loadProducts() {
    $.ajax({
      url: `${API_URL}/product`,
      type: "GET",
      success: function (products) {
        const productTable = $("#products-table tbody");
        productTable.empty();
        products.forEach((product) => {
          productTable.append(`
                        <tr>
                            <td>
                                <img src="${product.image_url}" alt="Sản phẩm" class="product-image" style="width: 50px; height: 50px; object-fit: cover;">
                            </td>
                            <td>${product.product_id}</td>
                            <td>${product.product_name}</td>
                            <td>${product.price}</td>
                            <td>${product.stock}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn btn-primary edit-product" data-id="${product.product_id}">Sửa</button>
                                    <button class="btn btn-danger delete-product" data-id="${product.product_id}">Xóa</button>
                                </div>
                            </td>
                        </tr>
                    `);
        });
      },
      error: function () {
        showError("Không thể tải danh sách sản phẩm.");
      },
    });
  }

  // Add new product
  $("#add-product-image").on("change", function (e) {
    const file = e.target.files[0]; // Lấy file ảnh người dùng chọn
    if (file) {
      const fileName = file.name; // Lấy tên file
      const imageUrl = `../picture/${fileName}`; // Gắn tên file vào mẫu đường dẫn
      $("#image-url").val(imageUrl); // Gán đường dẫn vào trường "image-url"
    }
  });

  $("#add-product-form").on("submit", function (e) {
    e.preventDefault();

    const newProduct = {
      product_name: $("#add-product-name").val(),
      price: parseFloat($("#add-product-price").val()),
      stock: parseInt($("#add-product-stock").val(), 10),
      description: $("#add-product-description").val(),
      category_id: parseInt($("#add-product-category").val(), 10),
      image_url: $("#image-url").val(), // Lấy đường dẫn ảnh từ trường "image-url"
    };

    $.ajax({
      url: `${API_URL}/product`, // Địa chỉ API của bạn
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(newProduct),
      success: function () {
        loadProducts();
        $("#add-product-modal").removeClass("active");
        showSuccess("Thêm sản phẩm thành công!");
        // Load lại sản phẩm hoặc làm gì đó sau khi thêm
      },
      error: function () {
        showError("Không thể thêm sản phẩm.");
      },
    });
  });

  // Event: Delete Product
  $(document).on("click", ".delete-product", function () {
    const productId = $(this).data("id");
    $.ajax({
      url: `${API_URL}/product/${productId}`,
      type: "DELETE",
      success: function () {
        loadProducts();
        showSuccess("Xóa sản phẩm thành công!");
      },
      error: function () {
        showError("Không thể xóa sản phẩm.");
      },
    });
  });

  $("#edit-product-image").on("change", function (e) {
    const file = e.target.files[0]; // Lấy file ảnh người dùng chọn
    if (file) {
      const fileName = file.name; // Lấy tên file
      const imageUrl = `../picture/${fileName}`; // Gắn tên file vào mẫu đường dẫn
      $("#image-url-edit").val(imageUrl); // Gán đường dẫn vào trường "image-url"
    }
  });

  //nhấn sửa product, tự động đẩy dữ liệu lên form
  $(document).on("click", ".edit-product", function () {
    const productId = $(this).data("id");

    
    $.ajax({
      url: `${API_URL}/product/${productId}`,
      type: "GET",
      success: function (response) {
        const product = response[0];
        $("#edit-product-id").val(product.product_id);
        $("#edit-product-name").val(product.product_name);
        $("#edit-product-price").val(product.price);
        $("#edit-product-stock").val(product.stock);
        $("#edit-product-description").val(product.description);
        $("#image-url-edit").val(product.image_url);
        loadCategories("#edit-product-category");
        $("#edit-product-category").val(product.category_id); 
        $("#edit-product-modal").addClass("active");
      },
      error: function () {
        showError("Không thể tải thông tin sản phẩm.");
      },
    });
  });

  // Save edited product
  $("#edit-product-form").on("submit", function (e) {
    e.preventDefault();

    const updatedProduct = {
      product_name: $("#edit-product-name").val(),
      price: parseFloat($("#edit-product-price").val()),
      stock: parseInt($("#edit-product-stock").val(), 10),
      description: $("#edit-product-description").val(),
      category_id: parseInt($("#edit-product-category").val(), 10),
      image_url: $("#image-url-edit").val(),
    };

    const productId = $("#edit-product-id").val();

    $.ajax({
      url: `${API_URL}/product/${productId}`,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(updatedProduct),
      success: function () {
        loadProducts();
        $("#edit-product-modal").removeClass("active");
        showSuccess("Cập nhật sản phẩm thành công!");
      },
      error: function () {
        showError("Không thể cập nhật sản phẩm.");
      },
    });
  });

  // Close edit modal
  $("#edit-product-modal .close").on("click", function () {
    $("#edit-product-modal").removeClass("active");
  });

  // ** Search Product **
  $("#search-product-form").on("submit", function (e) {
    e.preventDefault();
    const searchQuery = $("#search-product").val();

    $.ajax({
      url: `${API_URL}/product/name/${searchQuery}`,
      type: "GET",
      success: function (products) {
        const productTable = $("#products-table tbody");
        productTable.empty();

        if (products.length > 0) {
          products.forEach((product) => {
            productTable.append(`
                            <tr>
                                <td>
                                    <img src="${product.image_url}" alt="Sản phẩm" class="product-image" style="width: 50px; height: 50px; object-fit: cover;">
                                </td>
                                <td>${product.product_id}</td>
                                <td>${product.product_name}</td>
                                <td>${product.price}</td>
                                <td>${product.stock}</td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn btn-primary edit-product" data-id="${product.product_id}">Sửa</button>
                                        <button class="btn btn-danger delete-product" data-id="${product.product_id}">Xóa</button>
                                    </div>
                                </td>
                            </tr>
                        `);
          });
        } else {
          productTable.append(
            "<tr><td colspan='5'>Không tìm thấy sản phẩm nào.</td></tr>"
          );
        }
      },
      error: function () {
        showError("Không thể tìm kiếm sản phẩm.");
      },
    });
  });

  function loadCategoriesCombobox() {
    const apiEndpoint = `${API_URL}/ProductCategory`; // Đổi thành endpoint API thực tế

    // Gửi yêu cầu GET tới API
    $.ajax({
      url: apiEndpoint,
      method: "GET",
      success: function (categories) {
        // Xóa các tùy chọn cũ (nếu có)
        $("#add-product-category").empty();
        $("#edit-product-category").empty();

        // Thêm tùy chọn mặc định
        $("#add-product-category").append(
          '<option value="">Chọn danh mục</option>'
        );
        $("#edit-product-category").append(
          '<option value="">Chọn danh mục</option>'
        );

        // Duyệt qua danh sách danh mục và thêm vào combobox
        categories.forEach(function (category) {
          const option = `<option value="${category.category_id}">${category.category_name}</option>`;
          $("#add-product-category").append(option);
          $("#edit-product-category").append(option);
        });
      },
      error: function () {
        showError("Không thể tải danh mục");
      },
    });
  }

  // ** Categories Management **
  function loadCategories() {
    $.ajax({
      url: `${API_URL}/ProductCategory`,
      type: "GET",
      success: function (categories) {
        const categoryTable = $("#categories-table tbody");
        categoryTable.empty();
        categories.forEach((category) => {
          categoryTable.append(`
                        <tr>
                            <td>${category.category_id}</td>
                            <td>${category.category_name}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn btn-primary edit-category" data-id="${category.category_id}">Sửa</button>
                                    <button class="btn btn-danger delete-category" data-id="${category.category_id}">Xóa</button>
                                </div>
                            </td>
                        </tr>
                    `);
        });
      },
      error: function () {
        showError("Không thể tải danh sách danh mục.");
      },
    });
  }

  // Event: Add Category
  $("#add-category-form").on("submit", function (e) {
    e.preventDefault();
    const newCategory = {
      category_name: $("#add-category-name").val(),
      category_description: $("#add-category-description").val(),
    };

    $.ajax({
      url: `${API_URL}/ProductCategory`,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(newCategory),
      success: function () {
        loadCategories();
        $("#add-category-form")[0].reset();
        showSuccess("Thêm danh mục thành công!");
      },
      error: function () {
        showError("Không thể thêm danh mục.");
      },
    });
  });

  // Open edit modal and load category details
  $(document).on("click", ".edit-category", function () {
    const categoryId = $(this).data("id");

    // Fetch product details to prefill the form
    $.ajax({
      url: `${API_URL}/ProductCategory/${categoryId}`,
      type: "GET",
      success: function (response) {
        const category = response[0];
        $("#edit-category-id").val(category.category_id);

        $("#edit-category-name").val(category.category_name);

        $("#edit-category-description").val(category.category_description);

        $("#edit-category-modal").addClass("active");
      },
      error: function () {
        showError("Không thể tải thông tin sản phẩm.");
      },
    });
  });

  // Save edited category
  $("#edit-category-form").on("submit", function (e) {
    e.preventDefault();

    const updatedCategory = {
      category_name: $("#edit-category-name").val(),
      category_description: $("#edit-category-description").val(),
    };

    const categoryId = $("#edit-category-id").val();

    $.ajax({
      url: `${API_URL}/ProductCategory/${categoryId}`,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(updatedCategory),
      success: function () {
        loadProducts();
        $("#edit-category-modal").removeClass("active");
        showSuccess("Cập nhật sản phẩm thành công!");
      },
      error: function () {
        showError("Không thể cập nhật sản phẩm.");
      },
    });
  });

  // Close edit modal
  $("#edit-category-modal .close").on("click", function () {
    $("#edit-category-modal").removeClass("active");
  });

  // Event: Delete Category
  $(document).on("click", ".delete-category", function () {
    const categoryId = $(this).data("id");
    $.ajax({
      url: `${API_URL}/ProductCategory/${categoryId}`,
      type: "DELETE",
      success: function () {
        loadCategories();
        showSuccess("Xóa danh mục thành công!");
      },
      error: function () {
        showError("Không thể xóa danh mục.");
      },
    });
  });

  // ** Search Category **
  $("#search-category-form").on("submit", function (e) {
    e.preventDefault();
    const searchQuery = $("#search-category").val();

    $.ajax({
      url: `${API_URL}/ProductCategory/Name/${searchQuery}`,
      type: "GET",
      success: function (categories) {
        const categoryTable = $("#categories-table tbody");
        categoryTable.empty();

        if (categories.length > 0) {
          categories.forEach((category) => {
            categoryTable.append(`
                            <tr>
                                <td>${category.category_id}</td>
                                <td>${category.category_name}</td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn btn-primary edit-category" data-id="${category.category_id}">Sửa</button>
                                        <button class="btn btn-danger delete-category" data-id="${category.category_id}">Xóa</button>
                                    </div>
                                </td>
                            </tr>
                        `);
          });
        } else {
          categoryTable.append(
            "<tr><td colspan='5'>Không tìm thấy loại sản phẩm nào.</td></tr>"
          );
        }
      },
      error: function () {
        showError("Không thể tìm kiếm sản phẩm.");
      },
    });
  });

  // ** Users Management **
  function loadUsers() {
    $.ajax({
      url: `${API_URL}/users`,
      type: "GET",
      success: function (users) {
        const userTable = $("#users-table tbody");
        userTable.empty();

        const filteredUsers = users.filter((user) => user.role === "user");

        if (filteredUsers.length > 0) {
          filteredUsers.forEach((user) => {
            userTable.append(`
                        <tr>
                            <td>${user.user_id}</td>
                            <td>${user.username}</td>
                            <td>${user.email}</td>
                            <td>${user.phone_number}</td>
                            <td>${user.role}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn btn-danger delete-user" data-id="${user.user_id}">Xóa</button>
                                </div>
                            </td>
                        </tr>
                    `);
          });
        } else {
          userTable.append(
            "<tr><td colspan='6'>Không có tài khoản nào thuộc vai trò 'user'.</td></tr>"
          );
        }
      },
      error: function () {
        showError("Không thể tải danh sách người dùng.");
      },
    });
  }

  $("#search-user-form").on("submit", function (e) {
    e.preventDefault();
    const searchQuery = $("#search-user").val();

    $.ajax({
      url: `${API_URL}/users/Name/${searchQuery}`,
      type: "GET",
      success: function (users) {
        const userTable = $("#users-table tbody");
        userTable.empty();

        const filteredUsers = users.filter((user) => user.role === "user");

        if (filteredUsers.length > 0) {
          filteredUsers.forEach((user) => {
            userTable.append(`
                            <tr>
                                <td>${user.user_id}</td>
                                <td>${user.username}</td>
                                <td>${user.email}</td>
                                <td>${user.phone_number}</td>
                                <td>${user.role}</td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn btn-danger delete-user" data-id="${user.user_id}">Xóa</button>
                                    </div>
                                </td>
                            </tr>
                        `);
          });
        } else {
          userTable.append(
            "<tr><td colspan='6'>Không tìm thấy người dùng nào thuộc vai trò 'user'.</td></tr>"
          );
        }
      },
      error: function () {
        showError("Không thể tìm kiếm người dùng.");
      },
    });
  });

  //  Delete user
  $(document).on("click", ".delete-user", function () {
    const userId = $(this).data("id");
    const userConfirmed = confirm(
      "Bạn có chắc chắn muốn xóa người dùng này không?"
    );
    if (userConfirmed) {
      $.ajax({
        url: `${API_URL}/users/${userId}`,
        type: "DELETE",
        success: function () {
          loadUsers();
          alert("Xóa người dùng thành công!");
        },
        error: function () {
          showError("Không thể xóa người dùng.");
        },
      });
    } else {
      showError("Hành động xóa đã bị hủy.");
    }
  });

  // ** Orders Management **
  function loadOrders() {
    $.ajax({
      url: `${API_URL}/Orders`,
      type: "GET",
      success: function (orders) {
        const orderTable = $("#orders-table tbody");
        orderTable.empty();

        orders.forEach((order) => {
          const date = new Date(order.order_date);
          const formattedDate = `${date
            .getDate()
            .toString()
            .padStart(2, "0")}/${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${date.getFullYear()}`;

          // Kiểm tra trạng thái để xác định các nút hành động
          let actionButtons = "";

          // Nút cập nhật trạng thái thanh toán
          if (order.payment_status !== "completed") {
            actionButtons += `
              <button class="btn btn-success update-payment-status" data-id="${order.order_id}">Cập nhật trạng thái thanh toán</button>
            `;
          }

          // Nút cập nhật trạng thái giao hàng
          if (order.shipping_status !== "delivered") {
            actionButtons += `
              <button class="btn btn-primary update-shipping-status" data-id="${order.order_id}">Cập nhật trạng thái giao hàng</button>
            `;
          }

          // Nút hủy đơn hàng (chỉ hiển thị nếu trạng thái không phải completed hoặc canceled)
          if (!["completed", "canceled"].includes(order.status)) {
            actionButtons += `
              <button class="btn btn-danger cancel-order" data-id="${order.order_id}">Hủy đơn</button>
            `;
          }

          updateOrderStatus(
            order.order_id,
            order.shipping_status,
            order.payment_status,
            order.status
          );

          // Thêm hàng vào bảng
          orderTable.append(`
            <tr>
                <td>${order.order_id}</td>
                <td>${order.user_name}</td>
                <td>${formattedDate}</td>
                <td>${order.total_amount.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}</td>
                <td>${order.payment_status}</td>
                <td>${order.shipping_status}</td>
                <td>${order.status}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-secondary detail-order" data-id="${
                          order.order_id
                        }" data-date="${formattedDate}" data-name="${
            order.user_name
          }" data-location="yên lịch" data-phonenumber="0339706393">Chi tiết đơn hàng</button>
                        ${actionButtons} <!-- Hiển thị nút dựa trên trạng thái -->
                    </div>
                </td>
            </tr>
          `);
        });
      },
      error: function () {
        showError("Không thể tải danh sách đơn hàng.");
      },
    });
  }

  function updateOrderStatus(orderId, shippingStatus, paymentStatus, status) {
    // Nếu trạng thái shipping là "delivered" và trạng thái thanh toán là "completed", tự động cập nhật trạng thái đơn hàng
    if (
      shippingStatus === "delivered" &&
      paymentStatus === "completed" &&
      status === "pending"
    ) {
      $.ajax({
        url: `${API_URL}/Orders/update/status/${orderId}/completed`,
        type: "PUT",
        success: function () {
          showSuccess(
            `Order ${orderId} đã được cập nhật trạng thái thành completed.`
          );
          loadOrders();
        },
        error: function () {
          showError(
            `Không thể cập nhật trạng thái cho Order ${orderId} vì sản phẩm đã hết.`
          );
        },
      });
    }
  }

  $(document).on("click", ".update-payment-status", function () {
    const orderId = $(this).data("id");

    // Gọi API để cập nhật trạng thái thanh toán
    $.ajax({
      url: `${API_URL}/Orders/update/payment-status/${orderId}/completed`,
      type: "PUT",
      success: function () {
        showSuccess(
          `Đã cập nhật trạng thái thanh toán cho đơn hàng ${orderId}.`
        );
        loadOrders(); // Tải lại danh sách đơn hàng sau khi cập nhật
      },
      error: function () {
        showError(
          `Không thể cập nhật trạng thái thanh toán cho đơn hàng ${orderId}.`
        );
      },
    });
  });

  $(document).on("click", ".update-shipping-status", function () {
    const orderId = $(this).data("id");

    // Gọi API để cập nhật trạng thái giao hàng
    $.ajax({
      url: `${API_URL}/Orders/update/shipping-status/${orderId}/delivered`,
      type: "PUT",
      success: function () {
        showSuccess(
          `Đã cập nhật trạng thái giao hàng cho đơn hàng ${orderId}.`
        );
        loadOrders(); // Tải lại danh sách đơn hàng sau khi cập nhật
      },
      error: function () {
        showError(
          `Không thể cập nhật trạng thái giao hàng cho đơn hàng ${orderId}.`
        );
      },
    });
  });

  // Hàm mở modal
  function openModal(modalId) {
    $(`#${modalId}`).fadeIn(); // Hiện modal với hiệu ứng fade
    $("body").addClass("modal-open"); // Ngăn cuộn trang
  }

  // Hàm đóng modal
  function closeModal(modalId) {
    $(`#${modalId}`).fadeOut(); // Ẩn modal với hiệu ứng fade
    $("body").removeClass("modal-open"); // Bỏ trạng thái ngăn cuộn
  }

  // Hàm gọi API và hiển thị chi tiết đơn hàng
  function fetchAndRenderOrderDetails(orderId) {
    $.ajax({
      url: `${API_URL}/OrdersDetails/${orderId}`,
      type: "GET",
      success: function (orderDetails) {
        renderOrderDetails(orderDetails);
        openModal("orderDetailModal");
      },
      error: function () {
        showError("Không thể tải chi tiết đơn hàng.");
      },
    });
  }

  // Hàm hiển thị dữ liệu vào bảng chi tiết và tổng tiền
  function renderOrderDetails(orderDetails) {
    const detailTable = $("#order-detail-table");
    let totalAmount = 0;

    detailTable.empty(); // Xóa nội dung cũ
    orderDetails.forEach((detail) => {
      detailTable.append(`
                <tr>
                    <td>${detail.product_name}</td>
                    <td>${detail.quantity}</td>
                    <td>${formatCurrency(detail.price)}</td>
                    <td>${formatCurrency(detail.total_price)}</td>

                </tr>
            `);
      totalAmount += detail.total_price || 0; // Đảm bảo cộng đúng kiểu số
    });

    $("#tongorder").text(formatCurrency(totalAmount));
  }

  // Hàm định dạng tiền tệ
  function formatCurrency(amount) {
    return `${(amount || 0).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    })}`;
  }

  // Sự kiện nhấn vào nút "Chi tiết đơn hàng"
  $(document).on("click", ".detail-order", function () {
    const orderId = $(this).data("id"); // Lấy ID đơn hàng
    const date = $(this).data("date");
    const name = $(this).data("name");
    const location = $(this).data("name");
    const phonenumber = $(this).data("name");
    $("#invoice-id").text(orderId);
    $("#invoice-date").text(date);
    $("#customer-name").text(name);
    $("#location").text(location);
    $("#phonenumber").text(phonenumber);
    fetchAndRenderOrderDetails(orderId);
  });

  // Sự kiện nhấn nút "In hóa đơn"
  $(document).on("click", "#print-order-btn", function () {
    window.print(); // Mở hộp thoại in
  });

  // Gắn sự kiện đóng modal khi nhấn vào nút "x"
  $(document).on("click", ".close-modal", function () {
    closeModal("orderDetailModal");
  });

  // Gắn sự kiện đóng modal khi nhấn ngoài modal
  $(document).on("click", "#orderDetailModal", function (e) {
    if ($(e.target).is("#orderDetailModal")) {
      closeModal("orderDetailModal");
    }
  });

  $("#search-order-form").on("submit", function (e) {
    e.preventDefault();
    const searchQuery = $("#search-order").val();

    $.ajax({
      url: `${API_URL}/Orders/userName/${searchQuery}`,
      type: "GET",
      success: function (orders) {
        const orderTable = $("#orders-table tbody");
        orderTable.empty();

        if (orders.length > 0) {
          orders.forEach((order) => {
            const date = new Date(order.order_date);
            const formattedDate = `${date
              .getDate()
              .toString()
              .padStart(2, "0")}/${(date.getMonth() + 1)
              .toString()
              .padStart(2, "0")}/${date.getFullYear()}`;

            // Kiểm tra trạng thái đơn hàng và shipping để hiển thị nút hành động phù hợp
            let actionButtons = "";
            if (!["completed", "canceled"].includes(order.status)) {
              actionButtons = `
                <button class="btn btn-primary edit-shipping-status" data-id="${order.order_id}">Cập nhật trạng thái shipping</button>
                <button class="btn btn-danger cancel-order" data-id="${order.order_id}">Hủy đơn</button>
              `;
            }

            // Nếu shipping đã "delivered" và payment đã "completed", tự động cập nhật trạng thái đơn hàng
            if (
              order.shipping_status === "delivered" &&
              order.payment_status === "completed"
            ) {
              $.ajax({
                url: `${API_URL}/Orders/update/status/${order.order_id}/completed`,
                type: "PUT",
                success: function () {
                  console.log(
                    `Order ${order.order_id} đã được cập nhật trạng thái thành completed.`
                  );
                },
                error: function () {
                  console.error(
                    `Không thể cập nhật trạng thái cho Order ${order.order_id}.`
                  );
                },
              });
            }

            // Thêm hàng vào bảng
            orderTable.append(`
              <tr>
                  <td>${order.order_id}</td>
                  <td>${order.user_name}</td>
                  <td>${formattedDate}</td>
                  <td>${order.total_amount.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}</td>
                  <td>${order.payment_status}</td>
                  <td>${order.shipping_status}</td>
                  <td>${order.status}</td>
                  <td>
                      <div class="action-buttons">
                          <button class="btn btn-secondary detail-order" data-id="${
                            order.order_id
                          }" data-date="${formattedDate}" data-name="${
              order.user_name
            }">Chi tiết đơn hàng</button>
                          ${actionButtons} <!-- Hiển thị nút dựa trên trạng thái -->
                      </div>
                  </td>
              </tr>
            `);
          });
        } else {
          orderTable.append(
            "<tr><td colspan='8'>Không tìm thấy đơn hàng nào.</td></tr>"
          );
        }
      },
      error: function () {
        showError("Không thể tìm kiếm đơn hàng.");
      },
    });
  });

  // Sự kiện hủy đơn hàng
  $(document).on("click", ".cancel-order", function () {
    const orderId = $(this).data("id");
    if (confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      $.ajax({
        url: `${API_URL}/Orders/${orderId}`,
        type: "DELETE",
        success: function () {
          showSuccess("Đơn hàng đã bị hủy.");
          loadOrders(); // Tải lại danh sách đơn hàng
        },
        error: function () {
          showError("Không thể hủy đơn hàng.");
        },
      });
    }
  });

  // ** reviews Management **
  function loadReviews() {
    $.ajax({
      url: `${API_URL}/reviews`,
      type: "GET",
      success: function (reviews) {
        const reviewTable = $("#reviews-table tbody");
        reviewTable.empty();
        reviews.forEach((review) => {
          const date = new Date(review.review_date);
          const formattedDate = `${date
            .getDate()
            .toString()
            .padStart(2, "0")}/${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${date.getFullYear()}`;
          reviewTable.append(`
                        <tr>
                            <td>${review.review_id}</td>
                            <td>${review.product_id}</td>
                            <td>${review.user_id}</td>
                            <td>${review.rating}</td>
                            <td>${review.comment}</td>
                            <td>${formattedDate}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn btn-danger delete-review" data-id="${review.review_id}">Xóa</button>
                                </div>
                            </td>
                        </tr>
                    `);
        });
      },
      error: function () {
        showError("Không thể tải danh sách review.");
      },
    });
  }

  $(document).on("click", ".delete-review", function () {
    const reviewId = $(this).data("id");
    if (confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
      $.ajax({
        url: `${API_URL}/reviews/${reviewId}`,
        type: "DELETE",
        success: function () {
          showSuccess("đánh giá đã được xóa");
          loadReviews(); // Tải lại danh sách đơn hàng
        },
        error: function () {
          showError("Không thể xóa đánh giá.");
        },
      });
    }
  });

  let profitChart;

  // Vẽ biểu đồ
  function renderProfitChart(revenueByMonth) {
    if (profitChart) profitChart.destroy();
    profitChart = new Chart($("#profit-chart")[0].getContext("2d"), {
      type: "line",
      data: {
        labels: Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`),
        datasets: [
          {
            label: "Doanh thu (VNĐ)",
            data: revenueByMonth,
            borderColor: "blue",
            backgroundColor: "lightblue",
          },
        ],
      },
    });
  }

  // Lấy dữ liệu và vẽ biểu đồ
  function loadProfitChart() {
    $.get(`${API_URL}/Orders`, (orders) => {
      const year = $("#year-select").val();
      const revenue = Array(12).fill(0);
      orders.forEach((o) => {
        const date = new Date(o.order_date);
        if (o.status === "completed" && date.getFullYear() == year) {
          revenue[date.getMonth()] += o.total_amount;
        }
      });
      renderProfitChart(revenue);
    });
  }

  // Khởi tạo
  $("#year-select").on("change", loadProfitChart);
  $("#year-select").html(
    Array.from({ length: 6 }, (_, i) => {
      const y = new Date().getFullYear() - 5 + i;
      return `<option value="${y}" ${
        y === new Date().getFullYear() ? "selected" : ""
      }>${y}</option>`;
    })
  );
  loadProfitChart();

  $(".newlist").on("click", function (e) {
    e.preventDefault();
    loadDataAll();
  });

  function loadDataAll() {
    loadProducts();
    loadCategories();
    loadUsers();
    loadOrders();
    loadReviews();
    loadCategoriesCombobox();
    loadProfitChart();
  }

  loadDataAll();
});
