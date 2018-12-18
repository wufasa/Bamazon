// Import inquirer
var inquirer = require("inquirer");

// Import MySQL
var mysql = require("mysql");

// Mysql connection 
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");    
    // Invoke first function to prompt user on post/bid
    bamazon();
});

//prompt user to POST AN ITEM or BID ON AN ITEM
function bamazon() {
    inquirer
        .prompt([
        {
            type: "list",
            message: "What would you like to do Mr. Manager? Or EXIT?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "EXIT"],
            name: "userChoice"
        }
    ]).then(function (res) {
        switch (res.userChoice) {
            case "View Products for Sale":
                viewProducts();
                break;

            case "View Low Inventory":
                viewLowProducts();
                break;

            case "Add to Inventory":
                addToInventory();
                break;

            case "Add New Product":
                addNewProduct();
                break;

            case "EXIT":
                console.log("Goodbye...");
                connection.end();
                break;
        }
    });
}





function readProducts(cb) {
    console.log("Selecting all items...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        // console.log(res);
        cb(res);
        // connection.end();
    });
}

// Function to post item
function addNewProduct() {
    inquirer
        .prompt([
        {
            type: "input",
            message: "What is the item you would like to submit?",
            name: "postItem"
        },
        {
            type: "input",
            message: "What department would you like to place your item into?",
            name: "category"
        },
        {
            type: "input",
            message: "What would you like the price to be?",
            name: "price"
        },
        {
            type: "input",
            message: "How many would you like to add?",
            name: "stock"
        }
    ])
        .then(function (answer) {
        var query = connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: answer.postItem,
                department_name: answer.category,
                price: answer.price,
                stock_quantity: answer.stock,
            },
            function (err, res) {
                console.log(res.affectedRows + " item inserted!\n");
                // Call postOrBid AFTER the INSERT completes to start
                bamazon();
            }
        );
    });
}
//display Items
function viewProducts() {
    readProducts(function(itemInfo){

        console.log("Welcome to Michael's goods that are 100% not bought from Amazon!");
        var items = [];
        for (i = 0; i < itemInfo.length; i++) {
            console.log("Product ID: " + itemInfo[i].item_id + "\n Product Name: " + itemInfo[i].product_name + "\n Price: " + itemInfo[i].price + "\n Quantity: " + itemInfo[i].stock_quantity + "\n -----------------------")
            items.push(itemInfo[i].product_name);
        };
    }); 
    bamazon();
}

function viewLowProducts() {
    readProducts(function(itemInfo){

        console.log("Here are all products currently low on inventory");
        var items = [];
        for (i = 0; i < itemInfo.length; i++) {
            if(itemInfo[i].stock_quantity < 5){
                console.log("Product ID: " + itemInfo[i].item_id + "\n Product Name: " + itemInfo[i].product_name + "\n Price: " + itemInfo[i].price + "\n Quantity: " + itemInfo[i].stock_quantity + "\n -----------------------")
            }
        };

    }); 
    bamazon();

};


function updateProduct(toBuy, item_info) {
    console.log("Updating current stock...\n");
    var item_id = item_info.item_id;
    var item_name = item_info.product_name;
    var newStock = parseInt(item_info.stock_quantity) + parseInt(toBuy);
    var query = connection.query(
        "UPDATE products SET stock_quantity = "+newStock+" WHERE item_id = "+item_id,
        function (err, res) {
            console.log(res.affectedRows + " item changed! You just added "+toBuy+" " + item_name +" for a total stock of: "+ newStock + "!\n");
            // Invoke start function to begin POST or BID process all over again
            bamazon();
        }
    );
}


function addToInventory() {
    readProducts(function(itemInfo){

        console.log("What item would you like to add invetory to?");
        var items = [];
        for (i = 0; i < itemInfo.length; i++) {
            console.log("Product ID: " + itemInfo[i].item_id + "\n Product Name: " + itemInfo[i].product_name + "\n Quantity: " + itemInfo[i].stock_quantity + "\n -----------------------")
            items.push(itemInfo[i].product_name);
        };
        inquirer.prompt([
            {
                type: "list",
                name: "selectedItem",
                message: "What item would you like to add inventory to?",
                choices: items
            }
        ])
            .then(function (resp) {
            var selectedItem = resp.selectedItem;
            var selectedItemQuantity = itemInfo[items.indexOf(selectedItem)].stock_quantity;
            var selectedItemId = itemInfo[items.indexOf(selectedItem)].item_id;
            inquirer.prompt([
                {
                    type: "input",
                    name: "units",
                    message: "How many items?"
                }
            ])
                .then(function (res) {
                var toAdd = res.units;
                updateProduct(toAdd, itemInfo[items.indexOf(selectedItem)]);
            })
        });
    });

    //    console.log(readProducts());


}
