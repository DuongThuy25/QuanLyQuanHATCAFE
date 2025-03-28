$(document).ready(function () {
    const userId = localStorage.getItem('user_id');
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');

    if (userId) {
        // Hiển thị thông tin người dùng
        $.ajax({
            url: 'https://localhost:7028/api/User/' + userId,
            type: 'GET',
            success: function (response) {
                $('#user-info').html(`
                    <span class="text-white me-3">Xin chào, ${response.username}</span>
                    <button class="btn btn-outline-light" id="logout-btn">Đăng xuất</button>
                `);
                $('#logout-btn').click(function () {
                    localStorage.removeItem('user_id');
                    window.location.href = '../log in/log in.html';
                });
            },
            error: function () {
                console.log('Không lấy được thông tin người dùng.');
            }
        });

        // Hàm định dạng giá
        function formatPrice(price) {
            return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }

        // Cập nhật tổng giá
        function updateTotalPrice() {
            let totalPrice = 0;
            $('#cart-item .cart-item-row').each(function () {
                const totalItemPrice = parseFloat($(this).find('.total-price').data('price'));
                totalPrice += totalItemPrice;
            });
            $('#total-price-all').text(formatPrice(totalPrice) + "₫");
        }

        // Lấy thông tin order
        
    $.ajax({
        url: `https://localhost:7209/api/User/orders/orderId/${orderId}`,
        type: 'GET',
        success: function (response) {
            const order = response[0];
            $('#order-details').html(`
                <br>
                <p><strong>Ngày đặt hàng:</strong> ${new Date(order.order_date).toLocaleDateString()}</p>
                <p><strong>Tổng tiền:</strong> ${formatPrice(order.total_amount)}₫</p>
                <p><strong>Trạng thái:</strong> ${order.status === 'pending' ? 'Chưa hoàn thành' : 'Đã hoàn thành'}</p>
            `);

            let shippingExists = false;
            let paymentExists = false;

            // Kiểm tra và hiển thị dữ liệu từ bảng Shipping
            $.ajax({
                url: `https://localhost:7209/api/User/shipping/${orderId}`,
                type: 'GET',
                success: function (response) {
                    if (response.length > 0) {
                        shippingExists = true;
                        const ship = response[0];
                        $('#order-details').append(`
                            <br>
                            <p><strong>Địa chỉ giao hàng:</strong> ${ship.shipping_address}</p>
                            <p><strong>Trạng thái giao hàng:</strong> ${ship.shipping_status === 'pending' ? 'Đang giao hàng' : 'Đã giao hàng'}</p>
                        `);
                    } else {
                        $('#order-details').append(`
                            <br>
                            <p><strong>Thông tin giao hàng:</strong> Không tồn tại.</p>
                        `);
                    }

                    toggleBuyNowButton(shippingExists, paymentExists);
                },
                error: function () {
                    console.log("Không lấy được thông tin giao hàng.");
                    toggleBuyNowButton(shippingExists, paymentExists);
                }
            });

            // Kiểm tra và hiển thị dữ liệu từ bảng Payments
            $.ajax({
                url: `https://localhost:7209/api/User/payments/${orderId}`,
                type: 'GET',
                success: function (response) {
                    if (response.length > 0) {
                        paymentExists = true;
                        const payment = response[0];
                        $('#order-details').append(`
                            <br>
                            <p><strong>Phương thức thanh toán:</strong> ${payment.payment_method}</p>
                            <p><strong>Ngày thanh toán:</strong> ${new Date(payment.payment_date).toLocaleDateString()}</p>
                            <p><strong>Trạng thái thanh toán:</strong> ${payment.payment_status === 'pending' ? 'Chưa thanh toán' : 'Đã thanh toán'}</p>
                        `);
                    } else {
                        $('#order-details').append(`
                            <br>
                            <p><strong>Thông tin thanh toán:</strong> Không tồn tại.</p>
                        `);
                    }

                    toggleBuyNowButton(shippingExists, paymentExists);
                },
                error: function () {
                    console.log("Không lấy được thông tin thanh toán.");
                    toggleBuyNowButton(shippingExists, paymentExists);
                }
            });
        },
        error: function () {
            console.log("Không lấy được thông tin đơn hàng.");
        }
    });

    // Hàm kiểm tra và hiển thị/ẩn nút "Mua ngay"
    function toggleBuyNowButton(shippingExists, paymentExists) {
        if (!shippingExists || !paymentExists ) {
            $('#buy-now-btn').show();
        } else {
            $('#buy-now-btn').hide();
        }
    }



        // Lấy thông tin chi tiết order
        $.ajax({
            url: `https://localhost:7209/api/User/orders/OrderDetails/${orderId}`,
            type: 'GET',
            success: function (orderdetails) {
                orderdetails.forEach(orderdetail => {
                    const total = orderdetail.price * orderdetail.quantity;
                    const cartItem = $(`
                        <div class="row cart-item-row">
                            <div class="col-5 d-flex align-items-center">
                                <img src="${orderdetail.image_url}" alt="Sản phẩm" class="img-thumbnail">
                                <div class="ms-3">
                                    <p class="m-0">${orderdetail.product_name}</p>
                                    <p class="product-id" value="${orderdetail.product_id}" style="display: none;"></p>
                                    <small class="text-muted">size M</small>
                                </div>
                            </div>
                            <div class="col-2 text-center total-price" data-price="${orderdetail.price}">${formatPrice(orderdetail.price)}₫</div>
                            <div class="col-2 text-center">${orderdetail.quantity}</div>
                        </div>
                    `);

                    $('#cart-item').append(cartItem);
                });

                // Cập nhật tổng giá
                updateTotalPrice();
            },
            error: function () {
                console.log("Không lấy được giỏ hàng.");
            }
        });

        // Nút Mua hàng
        $('#buy-now-btn').click(function () {
            if (orderId) {
                window.location.href = `../pay/pay.html?orderId=${orderId}`;
            } else {
                console.log("orderId không hợp lệ."); // Debug: nếu orderId không tồn tại
            }
        });
    } else {
        window.location.href = '../log in/log in.html';
    }
});
