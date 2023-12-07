
// Đối với phiên bản hiện tại của handlebar thì sẽ không cần viết tool chuyển sang object nữa, 
// cứ truyền thẳng vào
const Account = require('../models/Account')
const Order = require('../models/Order')
const OrderDetail = require('../models/OrderDetail')
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

     // [GET] /customer detail
     showCustomerDetail(req, res) {
        const id = req.params.id
        Customer.findOne({
            _id: id
        }).lean()
            .then(customer => {
                console.log(customer)
                    res.render('customer-profile', {userLogin, title: "Customer Profile Page",customer:customer})
            })
            .catch((error) => {
                console.error('Error fetching customer:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }
    showHistory(req,res) {
        //search and load order for this page 
        res.render('listHistoryCus',{userLogin, title: "Customer History Page"})
    }

     // [POST] /search customer history
    searchHistory(req, res) {
        const {
        searchTerm
        } = req.body;
        console.log(searchTerm)
        Order.find({
        $or: [{
            phoneNumber: {
                $regex: searchTerm,
                $options: 'i'
            }
            }
        ]
        }).then(orders => {
            if(orders) {
                res.json(orders)
            } else {
                res.json({})
            }
        })
        .catch((error) => {
            console.error('Error fetching customer history:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });

    }

      // [POST] /search customer history
      searchCustomer(req, res) {
        const {
        searchTerm
        } = req.body;
        console.log(searchTerm)
        Customer.find({
        $or: [{
            phoneNumber: {
                $regex: searchTerm,
                $options: 'i'
            }
            }
        ]
        }).then(customer => {
            if(customer) {
                res.json(customer)
            } else {
                res.json({})
            }
        })
        .catch((error) => {
            console.error('Error fetching customer:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });

    }


}

module.exports = new CustomerControllers();
