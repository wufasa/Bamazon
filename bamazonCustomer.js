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
    displayItems();
});

//prompt user to POST AN ITEM or BID ON AN ITEM
//function bamazon() {
//    inquirer
//        .prompt([
//        {
//            type: "list",
//            message: "Would you like to POST or BID on an item? Or EXIT?",
//            choices: ["POST", "BID", "EXIT"],
//            name: "userChoice"
//        }
//    ]).then(function (res) {
//        switch (res.userChoice) {
//            case "POST":
//                postItem();
//                break;
//
//            case "BID":
//                bidItem();
//                break;
//            case "EXIT":
//                console.log("Goodbye...");
//                connection.end();
//                break;
//        }
//    });
//}





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

//// Function to post item
//function postItem() {
//    inquirer
//        .prompt([
//        {
//            type: "input",
//            message: "What is the item you would like to submit?",
//            name: "postItem"
//        },
//        {
//            type: "input",
//            message: "What category would you like to place your item into?",
//            name: "category"
//        },
//        {
//            type: "input",
//            message: "What would you like the starting bid to be?",
//            name: "startingBid"
//        }
//    ])
//        .then(function (answer) {
//        var query = connection.query(
//            "INSERT INTO items SET ?",
//            {
//                item_name: answer.postItem,
//                category: answer.category,
//                starting_bid: answer.startingBid,
//                current_bid: answer.startingBid
//            },
//            function (err, res) {
//                console.log(res.affectedRows + " item inserted!\n");
//                // Call postOrBid AFTER the INSERT completes to start
//                postOrBid();
//            }
//        );
//    });
//}
//display Items
function displayItems() {
    readProducts(function(itemInfo){

        console.log("Welcome to Michael's goods that are 100% not bought from Amazon!");
        var items = [];
        for (i = 0; i < itemInfo.length; i++) {
            console.log("Product ID: " + itemInfo[i].item_id + "\n Product Name: " + itemInfo[i].product_name + "\n Price: " + itemInfo[i].price + "\n Quantity: " + itemInfo[i].stock_quantity + "\n -----------------------")
            items.push(itemInfo[i].product_name);
        };
        inquirer.prompt([
            {
                type: "list",
                name: "selectedItem",
                message: "What item would you like to buy?",
                choices: items
            }
        ])
            .then(function (resp) {
            var selectedItem = resp.selectedItem;
            var selectedItemQuantity = itemInfo[items.indexOf(selectedItem)].stock_quantity;
            var selectedItemPrice = itemInfo[items.indexOf(selectedItem)].price;
            var selectedItemId = itemInfo[items.indexOf(selectedItem)].item_id;
            inquirer.prompt([
                {
                    type: "input",
                    name: "units",
                    message: "How many items?"
                }
            ])
                .then(function (res) {
                var toBuy = res.units;
                //                console.log(selectedItem);
                //                console.log(toBuy);
                //                console.log(selectedItemQuantity);
                if(toBuy>selectedItemQuantity){
                    console.log("Insufficent quantity!")
                }else{
                    var numBought = selectedItemQuantity - toBuy;
                    updateProduct(toBuy, numBought,itemInfo[items.indexOf(selectedItem)]);
                }
            })
        });
    });
    //    console.log(readProducts());


}

function updateProduct(toBuy, numBought, item_info) {
    console.log("Updating current stock...\n");
    var item_id = item_info.item_id;
    var item_name = item_info.product_name;
    var item_price = parseFloat(item_info.price) * toBuy;
    var query = connection.query(
        "UPDATE products SET stock_quantity = "+numBought+" WHERE item_id = "+item_id,
        function (err, res) {
            console.log(res.affectedRows + " order placed! You just bought "+toBuy+" " + item_name +" for a total of "+ item_price + "!\n");
            // Invoke start function to begin POST or BID process all over again
            connection.end();
        }
    );
}

