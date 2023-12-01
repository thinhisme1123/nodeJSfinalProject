
// Đối với phiên bản hiện tại của handlebar thì sẽ không cần viết tool chuyển sang object nữa, 
// cứ truyền thẳng vào
const Account = require('../models/Account')
const Customer = require('../models/Customer')
const session = require('express-session')
var userLogin = true
//chứa function handler
class CustomerControllers {

    // [GET] /customer
    index(req, res) {
        const isActive = true;
        console.log(req.session.user)
        Customer.find().lean()
            .then(customer => {
                    res.render('customer', {userLogin, title: "Product Page",customer:customer})
            })
            .catch((error) => {
                console.error('Error fetching customer:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }

}

module.exports = new CustomerControllers();
