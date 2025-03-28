$(document).ready(function () {
  const API_BASE_URL = "https://localhost:7028/api/User";
  const userId = localStorage.getItem("user_id");


  const formatPrice = (price) =>
    price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const getRandomProducts = (products, count) =>
    products.sort(() => 0.5 - Math.random()).slice(0, count);

  // Kiểm tra người dùng đăng nhập
  const loadUserInfo = () => {
    if (!userId) {
      window.location.href = "../log in/log in.html";
      return;
    }

    $.ajax({
      url: `${API_BASE_URL}/${userId}`,
      type: "GET",
      success: function (response) {
        $("#user-info").html(`
            <span class="text-white me-3">Xin chào, ${response.username}</span>
            <button class="btn btn-outline-light" id="logout-btn">Đăng xuất</button>
          `);

        // Xử lý đăng xuất
        $("#logout-btn").click(() => {
          localStorage.removeItem("user_id");
          window.location.href = "../log in/log in.html";
        });
      },
      error: function () {
        console.error("Không thể lấy thông tin người dùng.");
      },
    });
  };

  // Load sản phẩm ngẫu nhiên vào danh sách
  const loadRandomProducts = () => {
    $.ajax({
      url: `${API_BASE_URL}/product`,
      type: "GET",
      success: function (products) {
        if (products.length > 0) {
          const randomProducts = getRandomProducts(products, 3);
          const productContainer = $(".products .row");
          productContainer.empty();

          randomProducts.forEach((product) => {
            productContainer.append(`
                <div class="col-md-4">
                  <div class="product-card shadow-sm p-3 mb-5">
                    <img src="${product.image_url}" alt="${
              product.product_name
            }" class="product-image">
                    <h5 class="mt-3">${product.product_name}</h5>
                    <p>Giá: ${formatPrice(product.price)}</p>
                    <a href="../product-detail/product-detail.html?product_id=${
                      product.product_id
                    }" class="btn btn-success btn-sm">Mua ngay</a>
                  </div>
                </div>
              `);
          });
        } else {
          console.warn("Không có sản phẩm nào để hiển thị.");
        }
      },
      error: function () {
        console.error("Không thể lấy danh sách sản phẩm.");
      },
    });
  };

  // Load sản phẩm vào carousel
  const loadCarouselProducts = () => {
    $.ajax({
      url: `${API_BASE_URL}/product`,
      type: "GET",
      success: function (products) {
        if (products.length > 0) {
          const randomProducts = getRandomProducts(products, 5);
          const carouselInner = $(".carousel-inner");
          carouselInner.empty();

          randomProducts.forEach((product, index) => {
            const slideClass =
              index === 0 ? "carousel-item active" : "carousel-item";
            carouselInner.append(`
                <div class="${slideClass}">
                  <div class="row align-items-center">
                    <div class="col-md-6 text-center text-md-start">
                      <img src="${product.image_url}" class="img-fluid" alt="${
              product.product_name
            }">
                    </div>
                    <div class="col-md-6">
                      <h5 class="box-heading white" style="color: white;">${
                        product.product_name
                      }</h5>
                      <p class="description" style="color: white;">Giá: ${formatPrice(
                        product.price
                      )}</p>
                      <a href="../product-detail/product-detail.html?product_id=${
                        product.product_id
                      }" class="btn btn-secondary">Mua ngay</a>
                    </div>
                  </div>
                </div>
              `);
          });
        } else {
          console.warn("Không có sản phẩm nào để hiển thị trong carousel.");
        }
      },
      error: function () {
        console.error("Không thể lấy danh sách sản phẩm.");
      },
    });
  };

  // Khởi chạy các chức năng
  loadUserInfo();
  loadRandomProducts();
  loadCarouselProducts();
});
