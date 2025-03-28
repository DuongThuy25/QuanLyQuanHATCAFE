$(document).ready(function () {
    // Lấy userId từ localStorage
    const userId = localStorage.getItem('user_id');
    if (userId) {
        // Lấy thông tin người dùng và hiển thị tên người dùng trong header
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

        function loadOrders(user_id){
            $.ajax({
                url: `https://localhost:7028/api/User/orders/${user_id}`,
                type: 'GET',
                success: function (orders) {
                    displayOrders(orders);
                },
                error: function () {
                    console.log('Không thể tải danh sách hóa đơn.');
                }
            });
        }
        // Gọi API để lấy danh sách hóa đơn của người dùng
        loadOrders(userId);

        // Hàm hiển thị danh sách hóa đơn trong bảng
        function displayOrders(orders) {
            const $ordersTableBody = $('#orders-table-body');
            $ordersTableBody.empty();  // Xóa nội dung cũ

            orders.forEach(order => {
                const orderRow = `
                    <tr>
                        <td>${order.order_id}</td>
                        <td>${new Date(order.order_date).toLocaleDateString()}</td>
                        <td>${order.total_amount.toLocaleString()}₫</td>
                        <td>${order.status === 'pending' ? 'Chưa hoàn thành' : 'Đã hoàn thành'}</td>
                        <td>
                            <button class="btn btn-primary btn-sm me-2" onclick="viewOrderDetails(${order.order_id})">Chi tiết</button>
                            ${order.status === 'pending' ? `<button class="btn btn-danger btn-sm" onclick="deleteOrder(${order.order_id})">Hủy đơn</button>` : ''}
                        </td>
                    </tr>
                `;
                $ordersTableBody.append(orderRow);
            });
        }

        // Hàm xem chi tiết hóa đơn
        window.viewOrderDetails = function (orderId) {
            window.location.href = `../orders-detail/orders-detail.html?orderId=${orderId}`;
        };

        // Hàm xóa hóa đơn (chỉ xóa được nếu hóa đơn chưa thanh toán)
        window.deleteOrder = function (orderId) {
            if (confirm('Bạn có chắc chắn muốn xóa hóa đơn này?')) {
                $.ajax({
                    url: `https://localhost:7028/api/User/orders/${orderId}`,
                    type: 'DELETE',
                    success: function () {
                        alert('Hóa đơn đã được xóa.');
                        loadOrders(userId);  // Tải lại danh sách hóa đơn sau khi xóa thành công
                    },
                    error: function () {
                        alert('Có lỗi xảy ra khi xóa hóa đơn.');
                    }
                });
            }
        };

    } else {
        window.location.href = '../log in/log in.html';
    }
});
