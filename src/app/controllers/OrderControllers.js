// Đối với phiên bản hiện tại của handlebar thì sẽ không cần viết tool chuyển sang object nữa, 
// cứ truyền thẳng vào
const Order = require('../models/Order')
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
class OrderControllers {

    // [GET] /order
    index(req, res) {
        const isActive = true;
        console.log(req.session.user)
        Order.find().lean()
            .then(order => {
                    res.render('list-order', {userLogin, title: "Order Page",order:order})
            })
            .catch((error) => {
                console.error('Error fetching orders:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
        
    }

      // [GET] /order detail
      showOrderDetail(req, res) {
        const id = req.params.id
        res.redirect(`/pos/invoice/${id}`)
        
    }
}



module.exports = new OrderControllers();
