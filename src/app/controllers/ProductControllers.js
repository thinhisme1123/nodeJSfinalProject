
// Đối với phiên bản hiện tại của handlebar thì sẽ không cần viết tool chuyển sang object nữa, 
// cứ truyền thẳng vào
const Account = require('../models/Account')
const Product = require('../models/Product')
const session = require('express-session')
var userLogin = true

// Function to show a success toast message
function showSuccessToast(message) {
    Toastify({
        text: message,
        duration: 3000, // 3 seconds
        close: true,
        gravity: 'top', // 'top' or 'bottom'
        position: 'center', // 'left', 'center', or 'right'
        backgroundColor: 'green',
    }).showToast();
}
//chứa function handler
class ProductControllers {

    // [GET] /product
    index(req, res) {
        const isActive = true;
        console.log(req.session.user)
        Product.find().lean()
            .then(product => {
                    res.render('product', {userLogin, title: "Product Page",product:product})
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
        
    }
    // [GET] /create product
    showCreateProduct(req,res) {
        res.render('create-product',{userLogin, title: "Create Product Page"})
    }
    // [POST] /create product
    createProduct(req,res) {
        const { productName, category, brand, price, description, quantity, createdBy, image } = req.body;
        console.log(productName)

        const newProduct = new Product({
            productName,
            category,
            brand,
            price,
            description,
            quantity,
            createdBy,
            image,
        });

        // Save the new product to the database
        newProduct.save()
            .then((savedProduct) => {
                showSuccessToast('Product created successfully');
            })
            .catch((error) => {
                // Handle the error, send an error response to the client
                console.error('Error creating product:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }
}



module.exports = new ProductControllers();
