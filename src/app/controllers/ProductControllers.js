
// Đối với phiên bản hiện tại của handlebar thì sẽ không cần viết tool chuyển sang object nữa, 
// cứ truyền thẳng vào
const Account = require('../models/Account')
const Product = require('../models/Product')
const session = require('express-session')
var userLogin = true
//chứa function handler
class ProductControllers {

    // [GET] /product
    index(req, res) {
        const isActive = true;
        res.render('product', {userLogin, title: "Product Page"})
    }
    // [GET] /create product
    createProduct(req,res) {
        res.render('create-product',{userLogin, title: "Create Product Page"})
    }
}

module.exports = new ProductControllers();
