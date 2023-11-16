
// Đối với phiên bản hiện tại của handlebar thì sẽ không cần viết tool chuyển sang object nữa, 
// cứ truyền thẳng vào
const Account = require('../models/Account')
const Product = require('../models/Product')
const session = require('express-session')
var userLogin = true
//chứa function handler
class CustomerControllers {

    // [GET] /customer
    index(req, res) {
        const isActive = true;
        console.log(req.session.user)
        res.render('customer', {userLogin, title: "Customer Page"})
    }

}

module.exports = new CustomerControllers();
