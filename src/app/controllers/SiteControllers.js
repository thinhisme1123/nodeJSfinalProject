
// Đối với phiên bản hiện tại của handlebar thì sẽ không cần viết tool chuyển sang object nữa, 
// cứ truyền thẳng vào
const Account = require('../models/Account')

var userLogin = true
//chứa function handler
class SiteControllers {

    // [GET] /
    index(req, res) {
        if(userLogin) {
            res.render('home', {title: "Home Page", userLogin})
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
}

module.exports = new SiteControllers();
