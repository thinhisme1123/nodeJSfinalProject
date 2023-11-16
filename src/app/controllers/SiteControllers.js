
// Đối với phiên bản hiện tại của handlebar thì sẽ không cần viết tool chuyển sang object nữa, 
// cứ truyền thẳng vào
const Account = require('../models/Account')
const session = require('express-session')


var userLogin = false
//chứa function handler
class SiteControllers {

    // [GET] /
    index(req, res) {
        if(req.session.user) {
            res.render('dashboard', {title: "Home Page", userLogin})
        }
        else { 
            res.render('login', {title: "Login Page"})
        }

    }
    

    login(req, res, next) {
        const { username, password } = req.body
        console.log(username, password)
        
        Account.findOne({ username: username, password: password })
            .then(user => {
                console.log(user)
                if (user) {
                    req.session.user = user
                  res.redirect('/');
                  userLogin = true;
                } else {
                    res.render('login', {message: "Username or passowrd incorrect !"});
                }
            })
            .catch(next => {
                console.error(next);
            })
    }
    resgister(req,res) {
        
    }
}

module.exports = new SiteControllers();
