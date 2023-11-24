
// Đối với phiên bản hiện tại của handlebar thì sẽ không cần viết tool chuyển sang object nữa, 
// cứ truyền thẳng vào
const Account = require('../models/Account')
const session = require('express-session')
const jwt = require('jsonwebtoken');

var userLogin = false
//chứa function handler
class SiteControllers {

    // [GET] /
    index(req, res) {
        if(req.session.user) {
            res.render('dashboard', {title: "Home Page", userLogin, 
                                    username: req.session.user.username,
                                    role:req.session.user.role,
                                    change:req.session.user.change
            })
        }
        else { 
            res.redirect('/login')
        }

    }
    // [GET] /login
    showLogin(req,res) {
        res.render("login",{title: "Login Page"})
    }
    
    // [POST] /login
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
     // [GET] /logout
    logout(req,res) {
        req.session.destroy()
        res.redirect('/')
    }
     // [GET] /profile
    showProfile(req,res) {
        res.render('profile', {title: "Profile Page", userLogin})
    }
    // [GET] /changepassword
    showChangePW(req,res) {
        var blocked = true
        res.render('changePassword', {title: 'Change Password',username:req.session.user.username})
    }
    changePW(req,res) {
        res.send('hello')
    }
    // [GET] /verify-account
    verifyStaff(req,res) {
        //set the account verify to 1
        const token = req.query.token
        console.log(token)
        console.log(req.session.token)
        jwt.verify(req.session.token, token, (err, decoded) => {
            if (err) {
                // Token is invalid or has expired
                console.error('Error verifying token:', err);
                // Handle the error, e.g., render an error page or show a message to the user
            } else {
                // Token is valid
                return res.redirect("/login")
                
                // Mark the user account as verified in your database
                // Redirect the user to a success page or show a message indicating successful verification
            }
        });

        res.send("Verified")
    }
}

module.exports = new SiteControllers();
