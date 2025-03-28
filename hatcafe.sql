create database qlcoffee
use qlcoffee

CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(100) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    phone_number NVARCHAR(20),
    role NVARCHAR(10) CHECK (role IN ('user', 'admin')) NOT NULL,
    
);
CREATE TABLE ProductCategories (
    category_id INT IDENTITY(1,1) PRIMARY KEY,
    category_name NVARCHAR(255) NOT NULL,
    category_description NVARCHAR(MAX)
);
--select * from ProductCategories
--select * from products
CREATE TABLE Products (
    product_id INT IDENTITY(1,1) PRIMARY KEY,
    category_id INT,
    product_name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    price float NOT NULL,
    stock INT NOT NULL,
    image_url NVARCHAR(255),
    CONSTRAINT FK_CategoryID FOREIGN KEY (category_id) REFERENCES ProductCategories(category_id)
);
CREATE TABLE Orders (
    order_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    order_date DATETIME NOT NULL DEFAULT GETDATE(),
    total_amount float NOT NULL,
    status NVARCHAR(10) CHECK (status IN ('pending', 'completed', 'canceled')) NOT NULL,
    CONSTRAINT FK_UserID FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

--delete from Shipping
--delete from Payments

CREATE TABLE OrderDetails (
    order_detail_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price float NOT NULL,
    CONSTRAINT FK_OrderID FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    CONSTRAINT FK_ProductID FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

SELECT @@SERVERNAME, @@SERVICENAME;

select * from users

CREATE TABLE Cart (
    cart_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    product_id INT,
    quantity INT NOT NULL,
    CONSTRAINT FK_UserID_Cart FOREIGN KEY (user_id) REFERENCES Users(user_id),
    CONSTRAINT FK_ProductID_Cart FOREIGN KEY (product_id) REFERENCES Products(product_id)
);
CREATE TABLE Reviews (
    review_id INT IDENTITY(1,1) PRIMARY KEY,
    product_id INT,
    user_id INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment NVARCHAR(MAX),
    review_date DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_ProductID_Review FOREIGN KEY (product_id) REFERENCES Products(product_id),
    CONSTRAINT FK_UserID_Review FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

INSERT INTO Reviews (product_id, user_id, rating, comment)
VALUES 
    (8, 1, 5, N'Sản phẩm tuyệt vời, rất đáng tiền!'),
    (8, 3, 4, N'Sản phẩm ổn, nhưng giao hàng hơi chậm.'),
    (8, 3, 3, N'Sản phẩm chấp nhận được với giá này.');

select * from Products
CREATE TABLE Payments (
    payment_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT,
    payment_date DATETIME NOT NULL DEFAULT GETDATE(),
    payment_method NVARCHAR(20) CHECK (payment_method IN (N'chuyển khoản ngân hàng', N'thanh toán tiền mặt khi nhận hàng')),
	payment_status NVARCHAR(20) CHECK (payment_status IN (N'pending', N'completed')),
    CONSTRAINT FK_OrderID_Payment FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);


select * from Payments


CREATE TABLE Shipping (
    shipping_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT,
    shipping_address NVARCHAR(MAX) NOT NULL,
    shipping_status NVARCHAR(10) CHECK (shipping_status IN ('pending', 'shipped', 'delivered')) NOT NULL,
    CONSTRAINT FK_OrderID_Shipping FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE
);



ALTER TABLE Shipping
DROP CONSTRAINT FK_OrderID_Shipping


ALTER TABLE OrderDetails
ADD CONSTRAINT FK_OrderID FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE;

ALTER TABLE Shipping
ADD CONSTRAINT FK_OrderID_Shipping FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE;



--s PROCEDURE CUA ROLE QUAN TRI--
--S procedure b?ng ProductCategory--
CREATE PROCEDURE GetAllProductCategories
AS
BEGIN
    SELECT category_id, category_name, category_description 
    FROM ProductCategories;
END


CREATE PROCEDURE GetCategoryByID
	@category_id int
AS
BEGIN
    SELECT category_id, category_name, category_description 
    FROM ProductCategories where category_id = @category_id
END

CREATE PROCEDURE GetCategoryByName
	@category_name nvarchar(255)
AS
BEGIN
    SELECT category_id, category_name, category_description 
    FROM ProductCategories
	WHERE 
        category_name LIKE '%' + @category_name + '%'
    ORDER BY 
        category_name;
END

CREATE PROCEDURE AddProductCategory
    @category_name NVARCHAR(255),
    @category_description NVARCHAR(MAX) = NULL
AS
BEGIN
    INSERT INTO ProductCategories (category_name, category_description)
    VALUES (@category_name, @category_description);
END

CREATE PROCEDURE UpdateProductCategory
    @category_id INT,
    @category_name NVARCHAR(255),
    @category_description NVARCHAR(MAX) = NULL
AS
BEGIN
    UPDATE ProductCategories
    SET category_name = @category_name,
        category_description = @category_description
    WHERE category_id = @category_id;
END



CREATE PROCEDURE DeleteProductCategory
    @category_id INT
AS
BEGIN
    DELETE FROM ProductCategories
    WHERE category_id = @category_id;
END


--S procedure b?ng Product--

CREATE PROCEDURE AddProduct
	@category_id INT,
	@product_name nvarchar(255),
	@description nvarchar(max) = null,
	@price float,
	@stock int,
	@image_url nvarchar(255) = null
as
begin	
	insert into Products( category_id, product_name, description, price, stock, image_url)
	values (@category_id, @product_name, @description, @price, @stock, @image_url);
end 

CREATE PROCEDURE GetProductsByCategory
    @category_id INT
AS
BEGIN

    SELECT 
        product_id,
        category_id,
        product_name,
        description,
        price,
        stock,
        image_url
    FROM Products
    WHERE category_id = @category_id;
END;


CREATE PROCEDURE GetAllProducts
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        *
    FROM Products;
END;

CREATE PROCEDURE UpdateProduct
	@product_id INT,
    @category_id INT,
	@product_name nvarchar(255),
	@description nvarchar(max) = null,
	@price float,
	@stock int,
	@image_url nvarchar(255) = null
AS
BEGIN
    UPDATE Products
    SET category_id = @category_id,
        product_name = @product_name,
		description = @description,
		price = @price,
		stock = @stock,
		image_url = @image_url
    WHERE product_id = @product_id;
END

create PROCEDURE DeleteProduct
    @product_id INT
AS
BEGIN

    IF EXISTS (SELECT 1 FROM Products WHERE product_id = @product_id)
    BEGIN
        DELETE FROM OrderDetails WHERE product_id = @product_id;
        DELETE FROM Reviews WHERE product_id = @product_id;
        DELETE FROM Cart WHERE product_id = @product_id;
        DELETE FROM Products WHERE product_id = @product_id;

        
    END
    
END


--S procedure c?a b?ng users--
CREATE PROCEDURE GetAllUsers
AS
BEGIN
    SET NOCOUNT ON;

    SELECT user_id, username, password, email, phone_number, role
    FROM Users;
END

create PROCEDURE GetUserById
    @user_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT user_id, username, password, email, phone_number, role, token, password_reset_token, token_expiry
    FROM Users
    WHERE user_id = @user_id;
END

create PROCEDURE GetUserByName
    @user_name Nvarchar(255) 
AS
BEGIN
    SET NOCOUNT ON;

    SELECT user_id, username, password, email, phone_number, role, token, password_reset_token, token_expiry
    FROM Users
    WHERE 
        username LIKE '%' + @user_name + '%'
    ORDER BY 
        username;
END

create PROCEDURE UpdateUser
    @user_id INT,
    @username NVARCHAR(100),
    @password NVARCHAR(255) = NULL,
    @email NVARCHAR(255),
    @phone_number NVARCHAR(20) = NULL,
    @role NVARCHAR(10)
AS
BEGIN
    

    UPDATE Users
    SET username = @username,
        password = @password, 
        email = @email,
        phone_number = @phone_number,
        role = @role
    WHERE user_id = @user_id;
END


CREATE PROCEDURE DeleteUser
    @user_id INT
AS
BEGIN

    -- Xóa chi tiết đơn hàng liên quan đến đơn hàng của người dùng
    DELETE OrderDetails
    FROM OrderDetails
    INNER JOIN Orders ON OrderDetails.order_id = Orders.order_id
    WHERE Orders.user_id = @user_id;

    -- Xóa thông tin giao hàng liên quan đến đơn hàng của người dùng
    DELETE Shipping
    FROM Shipping
    INNER JOIN Orders ON Shipping.order_id = Orders.order_id
    WHERE Orders.user_id = @user_id;

    -- Xóa thanh toán liên quan đến đơn hàng của người dùng
    DELETE Payments
    FROM Payments
    INNER JOIN Orders ON Payments.order_id = Orders.order_id
    WHERE Orders.user_id = @user_id;

    -- Xóa đơn hàng của người dùng
    DELETE Orders
    FROM Orders
    WHERE Orders.user_id = @user_id;

    -- Xóa các mục trong giỏ hàng của người dùng
    DELETE Cart
    FROM Cart
    WHERE Cart.user_id = @user_id;

    -- Xóa đánh giá của người dùng
    DELETE Reviews
    FROM Reviews
    WHERE Reviews.user_id = @user_id;


    -- Cuối cùng, xóa người dùng
    DELETE Users
    FROM Users
    WHERE Users.user_id = @user_id;
    
END;


--s PROCEDURE CUA BANG ORDERS

-- Lấy tất cả đơn hàng cùng thông tin shipping_status và payment_status
alter PROCEDURE GetAllOrder
AS
BEGIN
	SELECT 
		od.order_id,
		us.username,
		od.order_date,
		od.total_amount,
		sp.shipping_status,
		pm.payment_status,
		od.status
	FROM 
		Orders od
	JOIN 
		Users us ON od.user_id = us.user_id
	LEFT JOIN 
		Shipping sp ON od.order_id = sp.order_id
	LEFT JOIN 
		Payments pm ON od.order_id = pm.order_id;
END

-- Lấy thông tin đơn hàng theo order_id cùng thông tin shipping_status và payment_status
alter PROCEDURE GetOrderByID
	@order_id INT
AS
BEGIN
	SELECT 
		od.order_id,
		us.username,
		od.order_date,
		od.total_amount,
		pm.payment_status,
		sp.shipping_status,
		od.status
	FROM 
		Orders od
	JOIN 
		Users us ON od.user_id = us.user_id
	LEFT JOIN 
		Shipping sp ON od.order_id = sp.order_id
	LEFT JOIN 
		Payments pm ON od.order_id = pm.order_id
	WHERE 
		od.order_id = @order_id;
END

-- Lấy thông tin đơn hàng theo username cùng thông tin shipping_status và payment_status
ALTER PROCEDURE GetOrderByUserName
	@user_name NVARCHAR(255)
AS
BEGIN
	SELECT 
		od.order_id,
		us.username,
		od.order_date,
		od.total_amount,
		pm.payment_status,
		sp.shipping_status,
		od.status
	FROM 
		Orders od
	JOIN 
		Users us ON od.user_id = us.user_id
	LEFT JOIN 
		Shipping sp ON od.order_id = sp.order_id
	LEFT JOIN 
		Payments pm ON od.order_id = pm.order_id
	WHERE 
		us.username LIKE '%' + @user_name + '%'
	ORDER BY 
		us.username;
END

CREATE PROCEDURE UpdatePaymentStatus
    @OrderID INT,
    @PaymentStatus NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra nếu đơn hàng tồn tại
    IF EXISTS (SELECT 1 FROM Orders WHERE order_id = @OrderID)
    BEGIN
        -- Cập nhật trạng thái thanh toán
        UPDATE Payments
        SET payment_status = @PaymentStatus
        WHERE order_id = @OrderID;

        PRINT 'Payment status updated successfully.';
    END
    ELSE
    BEGIN
        PRINT 'Order does not exist.';
    END
END;

CREATE PROCEDURE UpdateShippingStatus
    @OrderID INT,
    @ShippingStatus NVARCHAR(50)
AS
BEGIN

    -- Kiểm tra nếu đơn hàng tồn tại
    IF EXISTS (SELECT 1 FROM Orders WHERE order_id = @OrderID)
    BEGIN
        -- Cập nhật trạng thái giao hàng
        UPDATE Shipping
        SET shipping_status = @ShippingStatus
        WHERE order_id = @OrderID;

        PRINT 'Shipping status updated successfully.';
    END
    ELSE
    BEGIN
        PRINT 'Order does not exist.';
    END
END;


create PROCEDURE UpdateOrder
    @order_id INT,
    @user_id INT,
    @order_date DATETIME,
    @total_amount FLOAT,
    @status NVARCHAR(10)
AS
BEGIN
	-- Kiểm tra xem user_id có tồn tại trong bảng Users không
    IF NOT EXISTS (SELECT 1 FROM Users WHERE user_id = @user_id)
    BEGIN
        RETURN -1; -- Trả về -1 nếu user_id không tồn tại
    END
    ELSE
    BEGIN
        -- Kiểm tra giá trị của @status
        IF @status NOT IN ('pending', 'completed', 'canceled')
        BEGIN
            RETURN -1; -- Trả về -1 nếu giá trị status không hợp lệ
        END
        ELSE
        BEGIN
            UPDATE Orders
            SET 
                user_id = @user_id,
                order_date = @order_date,
                total_amount = @total_amount,
                status = @status
            WHERE order_id = @order_id;
        END
    END
END

select * from Orders
select * from OrderDetails
select * from Payments
select * from Shipping

CREATE PROCEDURE DeleteOrder
    @order_id INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Xóa chi tiết đơn hàng liên quan đến đơn hàng
    DELETE FROM OrderDetails WHERE order_id = @order_id;

    -- Xóa thông tin giao hàng liên quan đến đơn hàng
    DELETE FROM Shipping WHERE order_id = @order_id;

    -- Xóa thanh toán liên quan đến đơn hàng
    DELETE FROM Payments WHERE order_id = @order_id;

    -- Cuối cùng, xóa đơn hàng
    DELETE FROM Orders WHERE order_id = @order_id;
END;

--S procedure c?a b?ng reviews--
CREATE PROCEDURE GetAllReview
AS
BEGIN
    SELECT 
        *
    FROM 
        Reviews;
END;

CREATE PROCEDURE GetReviewByID
    @review_id INT
AS
BEGIN
    -- Kiểm tra xem review có tồn tại không
    IF EXISTS (SELECT 1 FROM Reviews WHERE review_id = @review_id)
    BEGIN
        SELECT 
            review_id,
            product_id,
            user_id,
            rating,
            comment,
            review_date
        FROM 
            Reviews
        WHERE 
            review_id = @review_id;
    END
    ELSE
    BEGIN
        -- Trả về -1 nếu review không tồn tại
        RETURN -1;
    END
END;

CREATE PROCEDURE DeleteReview
    @review_id INT
AS
BEGIN
    -- Kiểm tra xem review có tồn tại không
    IF EXISTS (SELECT 1 FROM Reviews WHERE review_id = @review_id)
    BEGIN
        DELETE FROM Reviews
        WHERE review_id = @review_id;
    END
    ELSE
    BEGIN
        -- Trả về -1 nếu review không tồn tại
        RETURN -1;
    END
END;

--S PROCEDURE C?A TRANG NGUOI DUNG--
--S procedure c?a b?ng user--

--day la phan dang nhap dang ki quen mat khau 
CREATE PROCEDURE SP_RegisterUser
    @Username NVARCHAR(100),
    @Password NVARCHAR(255),
    @Email NVARCHAR(255),
    @PhoneNumber NVARCHAR(20),
    @Role NVARCHAR(10)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Users WHERE Username = @Username OR Email = @Email)
    BEGIN
        RAISERROR ('Username or Email already exists.', 16, 1);
        RETURN;
    END
    
    INSERT INTO Users (Username, Password, Email, Phone_Number, Role)
    VALUES (@Username, @Password, @Email, @PhoneNumber, @Role);
END

CREATE PROCEDURE SP_LoginUser
    @Username NVARCHAR(100),
    @Password NVARCHAR(255)
AS
BEGIN
    SELECT user_id, username, role FROM Users
    WHERE Username = @Username AND Password = @Password;
END

select * from Users
update Users
set role = 'admin'
where user_id = 4

select * from Products

CREATE PROCEDURE SP_SetPasswordResetToken
    @Email NVARCHAR(255),
    @ResetToken NVARCHAR(255),
    @Expiry DATETIME
AS
BEGIN
    UPDATE Users
    SET Password_Reset_Token = @ResetToken, Token_Expiry = @Expiry
    WHERE Email = @Email;
END

CREATE PROCEDURE SP_ResetPassword
    @Email NVARCHAR(255),
    @NewPassword NVARCHAR(255),
    @ResetToken NVARCHAR(255)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Users WHERE Email = @Email AND Password_Reset_Token = @ResetToken AND Token_Expiry > GETDATE())
    BEGIN
        UPDATE Users
        SET Password = @NewPassword, Password_Reset_Token = NULL, Token_Expiry = NULL
        WHERE Email = @Email;
    END
    ELSE
    BEGIN
        RAISERROR ('Invalid token or token has expired.', 16, 1);
    END
END


CREATE PROCEDURE GetUserProfile
    @user_id INT
AS
BEGIN

    SELECT 
        user_id,
        username,
        email,
        phone_number,
        role
    FROM Users
    WHERE user_id = @user_id;
END;

CREATE PROCEDURE UpdateUserProfile
    @user_id INT,
    @new_email NVARCHAR(255),
    @new_phone_number NVARCHAR(20)
AS
BEGIN
    UPDATE Users
    SET email = @new_email,
        phone_number = @new_phone_number
    WHERE user_id = @user_id;
END

CREATE PROCEDURE UpdateUserPassword
    @user_id INT,
    @old_password NVARCHAR(255),
    @new_password NVARCHAR(255)
AS
BEGIN
    -- Kiểm tra xem mật khẩu cũ có đúng không
    IF EXISTS (SELECT 1 FROM Users WHERE user_id = @user_id AND password = @old_password)
    BEGIN
        -- Nếu mật khẩu cũ đúng, tiến hành cập nhật mật khẩu mới
        UPDATE Users
        SET password = @new_password
        WHERE user_id = @user_id;
        
        RETURN 1; -- Trả về 1 nếu cập nhật thành công
    END
    ELSE
    BEGIN
        RETURN -1; -- Trả về -1 nếu mật khẩu cũ không đúng
    END
END

select * from Users

--xóa dùng của user bên admin role

--S procedure c?a b?ng cart--

create PROCEDURE GetUserCart
    @user_id INT
AS
BEGIN
    SELECT c.cart_id,c.user_id, c.product_id, c.quantity, p.product_name, p.price, p.image_url
    FROM Cart c
    JOIN Products p ON c.product_id = p.product_id
    WHERE c.user_id = @user_id;
END

SELECT * FROM Cart
select * from Orders
select * from OrderDetails
select * from Payments
select * from Reviews

CREATE PROCEDURE AddProductToCart
    @user_id INT,
    @product_id INT,
    @quantity INT
AS
BEGIN
    -- Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    IF EXISTS (SELECT 1 FROM Cart WHERE user_id = @user_id AND product_id = @product_id)
    BEGIN
        UPDATE Cart
        SET quantity = quantity + @quantity
        WHERE user_id = @user_id AND product_id = @product_id;
    END
    ELSE
    BEGIN
        INSERT INTO Cart (user_id, product_id, quantity)
        VALUES (@user_id, @product_id, @quantity);
    END
END

CREATE PROCEDURE UpdateCartItem
    @cart_id INT,
    @quantity INT
AS
BEGIN
    UPDATE Cart
    SET quantity = @quantity
    WHERE cart_id = @cart_id;
END

CREATE PROCEDURE DeleteCartItem
    @cart_id INT
AS
BEGIN
    DELETE FROM Cart
    WHERE cart_id = @cart_id;
END

select * from Cart
--s procedure của bảng product--

create PROCEDURE GetProductById
    @ProductID INT
AS
BEGIN

    SELECT product_id, category_id, product_name, description, price, stock, image_url
    FROM Products
    WHERE product_id = @ProductID;
END;

CREATE PROCEDURE SearchProductsByName
    @name NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        product_id,
        product_name,
        category_id,
        description,
        price,
        stock,
        image_url
    FROM 
        Products
    WHERE 
        product_name LIKE '%' + @name + '%'
    ORDER BY 
        product_name; -- Sắp xếp theo tên sản phẩm nếu cần
END;


CREATE PROCEDURE GetProducts
    @PageNumber INT,
    @PageSize INT,
    @CategoryID INT = NULL -- Cho phép lọc theo danh mục nếu có CategoryID
AS
BEGIN

    SELECT product_id, product_name, description, price, stock, image_url, category_id
    FROM Products
    WHERE (@CategoryID IS NULL OR category_id = @CategoryID)
    ORDER BY product_id
    OFFSET (@PageNumber - 1) * @PageSize ROWS 
    FETCH NEXT @PageSize ROWS ONLY;

    -- Đếm tổng số lượng sản phẩm cho tính toán tổng trang
    SELECT COUNT(*) AS TotalProducts
    FROM Products
    WHERE (@CategoryID IS NULL OR category_id = @CategoryID);
END;

--s procedure của bảng orders--
alter PROCEDURE GetOrdersByID
    @order_id INT
AS
BEGIN
    SELECT order_id, user_id, order_date, status, total_amount
    FROM Orders
    WHERE order_id = @order_id
END

CREATE PROCEDURE GetUserOrders
    @user_id INT
AS
BEGIN
    SELECT order_id, order_date, status, total_amount
    FROM Orders
    WHERE user_id = @user_id
    ORDER BY order_date DESC;
END

create PROCEDURE GetOrderDetails
    @order_id INT
AS
BEGIN
    SELECT od.order_id, od.product_id, p.product_name, od.quantity, od.price, (od.quantity * od.price) AS total_price, p.image_url
    FROM OrderDetails od
    JOIN Products p ON od.product_id = p.product_id
    WHERE od.order_id = @order_id;
END


alter PROCEDURE CreateOrderFromCart
    @user_id INT,
	@total_amount FLOAT,
	@order_id int output
AS
BEGIN
    INSERT INTO Orders (user_id, order_date, status, total_amount)
    VALUES (
        @user_id,
        GETDATE(),
        'pending',
        @total_amount
    );
	-- Gán ID đơn hàng mới tạo vào biến output
    SET @order_id = SCOPE_IDENTITY();
END
delete from Orders
select * from orders
create PROCEDURE CreateOrderDetail
    @order_id int,
	@product_id int,
	@quantity int,
	@price float
AS
BEGIN
    INSERT INTO OrderDetails (order_id, product_id, quantity, price)
    VALUES (
        @order_id,
        @product_id,
        @quantity,
        @price
    );
END


CREATE PROCEDURE DeleteOrderUser
	@order_id INT
AS
BEGIN 
	DELETE FROM OrderDetails WHERE order_id = @order_id;
	DELETE FROM Payments WHERE order_id = @order_id;
	DELETE FROM Shipping WHERE order_id = @order_id;
	DELETE FROM Orders WHERE order_id = @order_id;
END

ALTER PROCEDURE UpdateStatusOrder
    @order_id INT,
    @status NVARCHAR(20)
AS
BEGIN
    -- Kiểm tra nếu đơn hàng tồn tại
    IF EXISTS (SELECT 1 FROM Orders WHERE order_id = @order_id)
    BEGIN
        -- Lấy trạng thái hiện tại của đơn hàng
        DECLARE @current_status NVARCHAR(20);
        SELECT @current_status = status FROM Orders WHERE order_id = @order_id;

        -- Nếu trạng thái mới là 'completed' và trạng thái hiện tại là 'pending'
        IF @status = 'completed' AND @current_status = 'pending'
        BEGIN
            -- Kiểm tra tồn kho đủ hay không
            IF EXISTS (
                SELECT 1 
                FROM OrderDetails od
                INNER JOIN Products p ON od.product_id = p.product_id
                WHERE od.order_id = @order_id AND p.stock < od.quantity
            )
            BEGIN
                -- Nếu tồn kho không đủ thì trả về -1
                RETURN -1;
            END

            -- Trừ số lượng sản phẩm trong kho
            UPDATE Products
            SET stock = stock - od.quantity
            FROM Products p
            INNER JOIN OrderDetails od ON p.product_id = od.product_id
            WHERE od.order_id = @order_id;
        END

        -- Cập nhật trạng thái đơn hàng
        UPDATE Orders
        SET status = @status
        WHERE order_id = @order_id;

        -- Trả về 1 khi thành công
        RETURN 1;
    END
    ELSE
    BEGIN
        -- Nếu đơn hàng không tồn tại trả về -2
        RETURN -2;
    END
END;



--store p bang reviews
ALTER PROCEDURE GetReviewByProductID
	@product_id INT
AS
BEGIN
	SELECT rv.product_id, rv.user_id, rv.rating, rv.comment, rv.review_date, us.username 
	FROM Reviews rv 
	JOIN Users us ON rv.user_id = us.user_id
	WHERE rv.product_id = @product_id
	ORDER BY rv.review_date DESC
END


CREATE PROCEDURE AddReview
    @product_id INT,
    @user_id INT,
    @rating INT,
    @comment NVARCHAR(MAX)
AS
BEGIN
    -- Kiểm tra tính hợp lệ của rating
    IF @rating < 1 OR @rating > 5
    BEGIN
        -- Nếu rating không hợp lệ, trả về -1
        RETURN -1;
    END

    -- Chèn đánh giá mới vào bảng Reviews
    INSERT INTO Reviews (product_id, user_id, rating, comment, review_date)
    VALUES (@product_id, @user_id, @rating, @comment, GETDATE());

END;

--store p bang payments và shipping

create procedure GetPaymentsByOrderID
	@orderId int
AS
BEGIN
	SELECT * FROM Payments
	WHERE order_id = @orderId
END

create procedure GetShippingByOrderID
	@orderId int
AS
BEGIN
	SELECT * FROM Shipping
	WHERE order_id = @orderId
END

select * from Payments

alter PROCEDURE AddPaymentAndShipping
    @order_id INT,
    @payment_method NVARCHAR(50),
    @shipping_address NVARCHAR(MAX)
AS
BEGIN
    -- Thêm bản ghi vào bảng Payments
    INSERT INTO Payments (order_id, payment_method, payment_status)
    VALUES (@order_id, @payment_method, N'pending');

    -- Thêm bản ghi vào bảng Shipping
    INSERT INTO Shipping (order_id, shipping_address, shipping_status)
    VALUES (@order_id, @shipping_address, N'pending');

    -- Trả về 1 khi thành công
    RETURN 1;
END;

delete from Shipping

INSERT INTO ProductCategories (category_name, category_description)
VALUES 
    (N'Cà phê nguyên chất', N'Sản phẩm cà phê nguyên chất với hương vị đậm đà'),
    (N'Nước ép - sinh tố', N'Nước ép và sinh tố trái cây tươi ngon, bổ dưỡng'),
    (N'Trà hoa quả', N'Các loại trà với hương vị trái cây'),
    (N'Sữa chua', N'Sữa chua thơm ngon, bổ dưỡng'),
    (N'Freeze', N'Freeze đá xay với các hương vị độc đáo'),
    (N'Iced Latte', N'Iced Latte với các hương vị đa dạng'),
    (N'Trà sữa', N'Trá sữa ngon với các hương vị hấp dẫn');

INSERT INTO Products (category_id, product_name, description, price, stock, image_url)
VALUES 
    (7, N'Cà phê đen đá', N'Hương vị đậm đà, mạnh mẽ', 320000, 100, 'https://example.com/cafe_den_da.jpg'),
    (7, N'Cà phê sữa đá', N'Hương vị đậm đà kết hợp cùng sữa', 340000, 120, 'https://example.com/cafe_sua_da.jpg'),
    (7, N'Cà phê phin', N'Phong cách cà phê truyền thống', 300000, 150, 'https://example.com/cafe_phin.jpg'),
    (7, N'Cà phê moka', N'Cà phê Moka thơm ngon', 360000, 80, 'https://example.com/cafe_moka.jpg'),
    (7, N'Cà phê Arabica', N'Arabica đậm vị, quyến rũ', 380000, 90, 'https://example.com/cafe_arabica.jpg');

INSERT INTO Products (category_id, product_name, description, price, stock, image_url)
VALUES 
    (8, N'Nước ép cam', N'Cam tươi 100%', 20000, 200, 'https://example.com/nuoc_ep_cam.jpg'),
    (8, N'Nước ép dứa', N'Hương vị dứa tươi mát', 22000, 150, 'https://example.com/nuoc_ep_dua.jpg'),
    (8, N'Nước ép táo', N'Hương vị táo ngọt ngào', 21000, 180, 'https://example.com/nuoc_ep_tao.jpg'),
    (8, N'Sinh tố xoài', N'Xoài tươi ngon', 23000, 160, 'https://example.com/sinh_to_xoai.jpg'),
    (8, N'Sinh tố dâu', N'Dâu tươi mát, bổ dưỡng', 24000, 140, 'https://example.com/sinh_to_dau.jpg');

INSERT INTO Products (category_id, product_name, description, price, stock, image_url)
VALUES 
    (9, N'Trà đào cam sả', N'Hương vị thanh mát của đào, cam và sả', 25000, 120, 'https://example.com/tra_dao_cam_sa.jpg'),
    (9, N'Trà vải', N'Vải tươi ngon kết hợp với trà', 27000, 110, 'https://example.com/tra_vai.jpg'),
    (9, N'Trà quất mật ong', N'Quất thơm mát, mật ong ngọt dịu', 26000, 130, 'https://example.com/tra_quat_mat_ong.jpg'),
    (9, N'Trà dâu', N'Dâu tươi ngọt dịu', 28000, 140, 'https://example.com/tra_dau.jpg'),
    (9, N'Trà chanh leo', N'Hương chanh leo tươi mát', 29000, 150, 'https://example.com/tra_chanh_leo.jpg');

INSERT INTO Users (username, password, email, phone_number, role) VALUES
('NguyenVanA', 'password123', 'nguyenvana@example.com', '0912345678', 'user'),
('TranThiB', 'password123', 'tranthib@example.com', '0923456789', 'user'),
('LeVanC', 'password123', 'levanc@example.com', '0934567890', 'user'),
('PhamThiD', 'adminpassword', 'phamthid@example.com', '0945678901', 'admin'),
('HoangVanE', 'adminpassword', 'hoangvane@example.com', '0956789012', 'admin'),
('NguyenThiF', 'password123', 'nguyenthif@example.com', '0967890123', 'user'),
('TranVanG', 'password123', 'tranvang@example.com', '0978901234', 'user'),
('LeThiH', 'adminpassword', 'lethih@example.com', '0989012345', 'admin'),
('BuiVanI', 'password123', 'buivani@example.com', '0990123456', 'user'),
('NgoThiK', 'password123', 'ngothik@example.com', '0901234567', 'user');

INSERT INTO Orders (user_id, order_date, total_amount, status)
VALUES 
(1, '2024-10-01', 150.00, 'completed'),
(2, '2024-10-02', 200.50, 'pending'),
(3, '2024-10-03', 50.75, 'completed'),
(2, '2024-10-04', 100.00, 'canceled'),
(4, '2024-10-05', 300.20, 'pending'),
(5, '2024-10-06', 450.00, 'completed'),
(2, '2024-10-07', 80.00, 'completed'),
(3, '2024-10-08', 120.99, 'pending'),
(2, '2024-10-09', 60.50, 'completed'),
(5, '2024-10-10', 99.99, 'completed');

-- Dữ liệu cho Category 10: Sữa chua
INSERT INTO Products (category_id, product_name, description, price, stock, image_url)
VALUES 
(10, N'Sữa chua dâu tây', N'Sữa chua dâu tây thơm ngon, bổ dưỡng, chứa nhiều vitamin giúp tăng cường sức khỏe và làm đẹp da. Với hương vị tự nhiên, sản phẩm mang đến một cảm giác ngọt ngào và tươi mát. Sữa chua dâu tây là lựa chọn tuyệt vời cho bữa sáng hoặc như một món ăn vặt nhẹ nhàng.', 35000, 100, 'https://example.com/sua-chua-dau-tay.jpg'),
(10, N'Sữa chua vani', N'Sữa chua vani là một món ăn quen thuộc với hương vị thơm ngon đặc trưng. Được làm từ nguyên liệu sữa tươi tự nhiên và vani nguyên chất, mang đến sự ngọt ngào và mát lạnh. Sữa chua vani rất giàu canxi và protein, giúp tăng cường hệ miễn dịch và hỗ trợ tiêu hóa.', 40000, 150, 'https://example.com/sua-chua-vani.jpg'),
(10, N'Sữa chua nếp cẩm', N'Sữa chua nếp cẩm kết hợp giữa vị ngọt nhẹ nhàng của sữa chua và hương thơm của nếp cẩm, tạo nên một sự kết hợp tuyệt vời cho sức khỏe. Đây là món ăn giúp bổ sung nhiều dưỡng chất, hỗ trợ tiêu hóa và làm mát cơ thể, đặc biệt thích hợp vào mùa hè.', 45000, 200, 'https://example.com/sua-chua-nep-cam.jpg'),
(10, N'Sữa chua dẻo', N'Sữa chua dẻo với độ mềm mịn, thơm ngon đặc trưng, thích hợp cho mọi đối tượng. Nó cung cấp các lợi ích tuyệt vời cho sức khỏe, bao gồm việc giúp hệ tiêu hóa hoạt động tốt hơn và bổ sung vitamin D cho cơ thể. Bạn có thể thưởng thức món này mỗi ngày để có một làn da khỏe mạnh.', 42000, 120, 'https://example.com/sua-chua-deo.jpg'),
(10, N'Sữa chua mít', N'Sữa chua mít là một món ăn vặt lý tưởng cho những ai yêu thích sự mới mẻ. Với hương vị ngọt ngào của mít tươi và sự mát lạnh của sữa chua, đây sẽ là một sự lựa chọn tuyệt vời để thưởng thức vào mùa hè. Sản phẩm này chứa nhiều chất xơ và vitamin giúp cải thiện sức khỏe tim mạch.', 47000, 80, 'https://example.com/sua-chua-mit.jpg');

-- Dữ liệu cho Category 11: Freeze
INSERT INTO Products (category_id, product_name, description, price, stock, image_url)
VALUES 
(11, N'Freeze trà xanh', N'Freeze trà xanh là sự kết hợp tuyệt vời giữa trà xanh nguyên chất và đá xay mịn, mang đến hương vị thanh mát, tươi mới. Đây là lựa chọn lý tưởng cho những ai yêu thích sự nhẹ nhàng và không quá ngọt. Freeze trà xanh giúp giải nhiệt và bổ sung chất chống oxy hóa cho cơ thể.', 35000, 150, 'https://example.com/freeze-tra-xanh.jpg'),
(11, N'Freeze dâu tây', N'Freeze dâu tây được làm từ những trái dâu tươi ngon, xay mịn với đá, tạo ra một thức uống ngọt ngào và đầy tươi mới. Hương vị dâu tây thanh mát kết hợp với độ lạnh của đá xay tạo cảm giác sảng khoái mỗi khi thưởng thức.', 38000, 200, 'https://example.com/freeze-dau-tay.jpg'),
(11, N'Freeze chanh leo', N'Freeze chanh leo mang đến hương vị chua ngọt đặc trưng của chanh leo kết hợp với đá xay mát lạnh. Đây là một thức uống giải nhiệt cực kỳ hiệu quả, giúp bạn xua tan mệt mỏi trong những ngày hè oi ả.', 40000, 180, 'https://example.com/freeze-chanh-leo.jpg'),
(11, N'Freeze matcha', N'Freeze matcha là sự kết hợp hoàn hảo giữa bột matcha chất lượng cao và đá xay lạnh, tạo ra một món đồ uống vừa ngọt vừa đắng vừa mát. Đây là lựa chọn tuyệt vời cho những ai yêu thích vị trà xanh thanh khiết và các lợi ích từ chất chống oxy hóa có trong matcha.', 45000, 120, 'https://example.com/freeze-matcha.jpg'),
(11, N'Freeze xoài', N'Freeze xoài được làm từ xoài tươi ngon, xay cùng với đá lạnh tạo ra một thức uống mát lạnh, thơm ngon, đầy hương vị. Đây là món đồ uống tuyệt vời cho những ai yêu thích sự ngọt ngào tự nhiên từ xoài chín.', 42000, 250, 'https://example.com/freeze-xoai.jpg');

-- Dữ liệu cho Category 12: Iced Latte
INSERT INTO Products (category_id, product_name, description, price, stock, image_url)
VALUES 
(12, N'Iced Latte đậm đà', N'Iced Latte đậm đà là món cà phê lạnh kết hợp giữa cà phê espresso và sữa tươi, tạo ra hương vị cà phê mạnh mẽ, đậm đà. Đây là sự lựa chọn hoàn hảo cho những ai yêu thích cà phê có vị mạnh và đặc biệt.', 45000, 100, 'https://example.com/iced-latte-dam-da.jpg'),
(12, N'Iced Latte vani', N'Iced Latte vani mang đến sự kết hợp hoàn hảo giữa cà phê espresso và vị ngọt ngào của vani. Hương vị ngọt nhẹ của vani hòa quyện với cà phê tạo nên một trải nghiệm mới lạ, thú vị và đặc biệt.', 47000, 150, 'https://example.com/iced-latte-vani.jpg'),
(12, N'Iced Latte caramel', N'Iced Latte caramel là món thức uống kết hợp giữa cà phê espresso đậm đà và vị ngọt ngào của caramel. Món thức uống này mang đến một sự kết hợp hoàn hảo giữa sự đắng của cà phê và ngọt của caramel.', 48000, 120, 'https://example.com/iced-latte-caramel.jpg'),
(12, N'Iced Latte chocolate', N'Iced Latte chocolate là sự pha trộn tuyệt vời giữa cà phê espresso và sữa chocolate, mang đến hương vị ngọt ngào và thơm lừng của chocolate. Đây là món thức uống lý tưởng cho những ai yêu thích cà phê cùng với vị ngọt từ chocolate.', 50000, 110, 'https://example.com/iced-latte-chocolate.jpg'),
(12, N'Iced Latte hạt phỉ', N'Iced Latte hạt phỉ là một sự kết hợp mới lạ giữa cà phê espresso và hương vị hạt phỉ thơm ngon, mang đến một món thức uống nhẹ nhàng và đậm đà. Mùi hương của hạt phỉ hòa quyện với cà phê tạo ra một hương vị đặc biệt không thể tìm thấy ở bất kỳ món cà phê nào khác.', 49000, 90, 'https://example.com/iced-latte-hat-phi.jpg');

-- Dữ liệu cho Category 13: Trà sữa
INSERT INTO Products (category_id, product_name, description, price, stock, image_url)
VALUES 
(13, N'Trà sữa truyền thống', N'Trà sữa truyền thống là sự kết hợp giữa trà đen và sữa tươi, mang đến hương vị đậm đà nhưng cũng rất dịu nhẹ. Đây là món trà sữa phổ biến nhất, được yêu thích nhờ vào sự hòa quyện hoàn hảo giữa vị trà và sữa. Một lựa chọn tuyệt vời cho những ai yêu thích sự đơn giản nhưng vẫn đầy đủ hương vị.', 42000, 200, 'https://example.com/tra-sua-truyen-thong.jpg'),
(13, N'Trà sữa matcha', N'Trà sữa matcha là món trà sữa đặc biệt với bột matcha thơm ngon, mang đến một hương vị vừa đắng vừa ngọt. Đây là món trà sữa lý tưởng cho những ai yêu thích trà xanh và muốn thưởng thức một thức uống nhẹ nhàng nhưng đầy hương vị.', 45000, 180, 'https://example.com/tra-sua-matcha.jpg'),
(13, N'Trà sữa caramel', N'Trà sữa caramel mang đến sự kết hợp hoàn hảo giữa trà đen và sữa, cùng với vị ngọt của caramel. Hương vị của caramel thêm phần đặc biệt và lôi cuốn, thích hợp cho những ai yêu thích sự ngọt ngào nhưng không quá gắt.', 47000, 150, 'https://example.com/tra-sua-caramel.jpg'),
(13, N'Trà sữa dâu tây', N'Trà sữa dâu tây là sự kết hợp hoàn hảo giữa vị chua nhẹ của dâu tây và vị ngọt từ sữa. Trà sữa dâu tây mang đến một cảm giác thanh mát, thích hợp để giải nhiệt vào những ngày hè oi bức.', 48000, 120, 'https://example.com/tra-sua-dau-tay.jpg'),
(13, N'Trà sữa xoài', N'Trà sữa xoài là món trà sữa đầy tươi mới với hương vị ngọt ngào của xoài chín kết hợp với trà đen và sữa tươi. Đây là món trà sữa rất thích hợp cho những ai yêu thích hương vị trái cây đặc biệt.', 50000, 130, 'https://example.com/tra-sua-xoai.jpg');

