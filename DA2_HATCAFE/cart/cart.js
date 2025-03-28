$(document).ready(function() {
    const userId = localStorage.getItem('user_id');
    if (userId) {
        // Lấy thông tin người dùng từ API
        $.ajax({
            url: 'https://localhost:7028/api/User/' + userId,
            type: 'GET',
            success: function(response) {
                $('#user-info').html(`
                    <span class="text-white me-3">Xin chào, ${response.username}</span>
                    <button class="btn btn-outline-light" id="logout-btn">Đăng xuất</button>
                `);
                $('#logout-btn').click(function() {
                    localStorage.removeItem('user_id');
                    window.location.href = '../log in/log in.html';
                });
            },
            error: function() {
                console.log('Không lấy được thông tin người dùng.');
            }
        });

        function formatPrice(price) {
            return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }

        function updateTotalPrice() {
            let totalPrice = 0;
            $('#cart-item .cart-item-row').each(function() {
                const isChecked = $(this).find('.product-checkbox').is(':checked');
                const totalItemPrice = parseFloat($(this).find('.total-price').data('totalprice'));
                if (isChecked) {
                    totalPrice += totalItemPrice;
                }
            });
            $('#total-price-all').text(formatPrice(totalPrice) + "₫");
        }

        // Lấy thông tin giỏ hàng
        $.ajax({
            url: `https://localhost:7028/api/User/Cart/${userId}`,
            type: 'GET',
            success: function(carts) {
                if (carts.length === 0) {
                    $('#cart-item').html('<p class="text-center">Giỏ hàng của bạn không có sản phẩm nào</p>');
                } else {
                carts.forEach(cart => {
                    const total = cart.price * cart.quantity; 
                    const cartItem = $(`
                        <div class="row cart-item-row">
                            <div class="col-5 d-flex align-items-center">
                                <input type="checkbox" class="form-check-input me-3 product-checkbox">
                                <img src="${cart.image_url}" alt="Sản phẩm" class="img-thumbnail">
                                <div class="ms-3">
                                    <p class="m-0">${cart.product_name}</p>
                                    <p class="cart-id" value="${cart.cart_id}" style="display: none;"></p>
                                    <p class="product-id" value="${cart.product_id}" style="display: none;"></p>
                                    <small class="text-muted">size M</small>
                                </div>
                            </div>
                            <div class="col-2 text-center price" data-price="${cart.price}">${formatPrice(cart.price)}₫</div>
                            <div class="col-2 text-center">
                                <div class="quantity-control d-flex align-items-center justify-content-center">
                                    <button class="btn btn-sm btn-outline-secondary decrease">-</button>
                                    <input type="text" class="form-control text-center mx-2 quantity" value="${cart.quantity}" style="width: 50px;">
                                    <button class="btn btn-sm btn-outline-secondary increase">+</button>
                                </div>
                            </div>
                            <div class="col-2 text-center total-price" data-totalprice="${total}">${formatPrice(total)}₫</div>
                            <div class="col-1 delete_cart">
                                <button class="btn btn-outline-danger delete-btn">Xóa</button>
                            </div>
                        </div>
                    `);

                    $('#cart-item').append(cartItem);
                
                    // Tăng, giảm số lượng
                    cartItem.find('.increase').click(function() {
                        let quantityInput = cartItem.find('.quantity');
                        let quantity = parseInt(quantityInput.val()) || 0;
                        quantityInput.val(quantity + 1);
                        const newTotal = cart.price * (quantity + 1);
                        cartItem.find('.total-price').text(formatPrice(newTotal) + "₫").data('totalprice', newTotal);
                        updateTotalPrice();
                    });

                    cartItem.find('.decrease').click(function() {
                        let quantityInput = cartItem.find('.quantity');
                        let quantity = parseInt(quantityInput.val()) || 0;
                        if (quantity > 1) {
                            quantityInput.val(quantity - 1);
                            const newTotal = cart.price * (quantity - 1);
                            cartItem.find('.total-price').text(formatPrice(newTotal) + "₫").data('totalprice', newTotal);
                            updateTotalPrice();
                        }
                    });

                    cartItem.find('.product-checkbox').change(function() {
                        updateTotalPrice();
                    });
                });

                // Checkbox chọn tất cả
                $('#select-all').change(function() {
                    const isChecked = $(this).is(':checked');
                    $('.product-checkbox').prop('checked', isChecked);
                    updateTotalPrice();
                });
            }
            },
            error: function() {
                console.log("Không lấy được giỏ hàng.");
            }
        });

        // Nút Mua hàng
        $('#buy-now-btn').click(function() {
            const totalAmountText = $('#total-price-all').text();
            const totalAmount = parseFloat(totalAmountText.replace(/₫|,|\./g, ''));
            const selectedItems = [];

            $('#cart-item .cart-item-row').each(function() {
                const isChecked = $(this).find('.product-checkbox').is(':checked');
                if (isChecked) {
                    const cartId = parseInt($(this).find('.cart-id').attr('value'));
                    const productId = parseInt($(this).find('.product-id').attr('value'));
                    const quantity = parseInt($(this).find('.quantity').val());
                    const price = parseFloat($(this).find('.price').data('price'));
                    selectedItems.push({ cartId, productId, quantity, price });
                }
            });

            if (selectedItems.length > 0) {
                $.ajax({
                    url: `https://localhost:7209/api/User/orders`,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ 
                        user_id: userId,
                        total_amount: totalAmount
                    }),
                    success: function(orderResponse) {
                        const orderId = orderResponse.order_id;

                        const orderDetailsRequests = selectedItems.map(item => {
                            return $.ajax({
                                url: `https://localhost:7209/api/User/orders/OrderDetails`,
                                type: 'POST',
                                contentType: 'application/json',
                                data: JSON.stringify({
                                    order_id: orderId,
                                    product_id: item.productId,
                                    quantity: item.quantity,
                                    price: item.price
                                })
                            });
                        });

                        $.when(...orderDetailsRequests).done(function() {
                            const deleteRequests = selectedItems.map(item => {
                                return $.ajax({
                                    url: `https://localhost:7209/api/User/Cart/${item.cartId}`,
                                    type: 'DELETE',
                                    success: function() {
                                        $(`.cart-item-row:has(.cart-id[value="${item.cartId}"])`).remove();
                                        updateTotalPrice();
                                    },
                                    error: function() {
                                        console.log("Không thể xóa sản phẩm khỏi giỏ hàng.");
                                    }
                                });
                            });

                            $.when(...deleteRequests).done(function() {
                                window.location.href = `../pay/pay.html?orderId=${orderId}`;
                            }).fail(function() {
                                console.log("Không thể xóa sản phẩm khỏi giỏ hàng sau khi tạo đơn hàng.");
                            });
                        }).fail(function() {
                            console.log("Không thể tạo chi tiết đơn hàng.");
                        });
                    },
                    error: function() {
                        console.log("Không thể tạo đơn hàng.");
                    }
                });
            } else {
                alert("Vui lòng chọn sản phẩm để mua.");
            }
        });
    } else {
        window.location.href = '../log in/log in.html';
    }
});
