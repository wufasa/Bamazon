DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
    item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(30) NUll,
    department_name VARCHAR(30) NULL,
    price DECIMAL(10,4) NULL,
    stock_quantity INT NULL,
    PRIMARY KEY (item_id)
);

    INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
    VALUES (1, "Romaine Lettuce", "Groceries", 5.24, 30);

    INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
    VALUES (2, "Super Smash", "Video Games", 60, 100);

    INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
    VALUES (3, "Absinthe", "Alcohol", 50.20, 30);

    INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
    VALUES (4, "Horse Cream", "Skin Care", 19.99, 20);

    INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
    VALUES (5, "Basketball", "Sporting Goods", 20, 30);

    INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
    VALUES (6, "Flashlight", 'Camping', 10, 2000);

    INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
    VALUES (7, 'Viking Helmet', 'Hats', 40, 100);

    INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
    VALUES (8, 'Supreme Brick', 'Useless Items', 99.99, 2);

    INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
    VALUES (9, 'Socks', 'Christmas Gifts', 8.24, 10000);
    
    INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
    VALUES (10, Unicorn_Horn, Rare_Goods, 89831, 1);






SELECT * FROM products;
