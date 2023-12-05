
// Đối với phiên bản hiện tại của handlebar thì sẽ không cần viết tool chuyển sang object nữa, 
// cứ truyền thẳng vào
const Account = require('../models/Account')
const OrderDetail = require('../models/OrderDetail')
const Product = require('../models/Product')
const Customer = require('../models/Customer')
const session = require('express-session')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

var userLogin = false
//chứa function handler
class SiteControllers {

    // [GET] /home dashboard
    async index(req, res) {
        try {
            const product = await Product.find().lean();
            const productAmount = product.length;
            const customer = await Customer.find().lean();
            const customerAmount = customer.length;
    
            if (req.session.user) {
                res.render('dashboard', {
                    title: "Home Page",
                    userLogin,
                    username: req.session.user.username,
                    role: req.session.user.role,
                    change: req.session.user.change,
                    productAmount: productAmount,
                    customerAmount: customerAmount,
                    blocked: req.session.user.blocked
                });
            } else {
                res.redirect('/login');
            }
        } catch (error) {
            console.error(error);
            // Handle the error appropriately, e.g., send an error response.
            res.status(500).send('Internal Server Error');
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
        Account.findOne({ username: username})
            .then(user => {
                console.log(user)
                if (user) {
                    // this if is just for admin account
                    if(password === user.password) {
                        req.session.user = user
                        console.log(req.session.user.blocked)
                        userLogin = true
                        console.log('success')
                        return res.redirect('/')
                    }
                    else {
                        // this else for staff account
                        bcrypt.compare(password, user.password).then(function (result) {
                        
                            if (result) {   
                                req.session.user = user
                                userLogin = true
                                console.log('success')
                                return res.redirect('/')
                            }
                            req.session.flash = {
                                msg: 'Username or password is wrong !'
                            }
                            return res.render('login', {
                                msg: req.session.flash ? req.session.flash.msg : null
                            });
                        })
                    }
                    
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
        console.log("Changing")
        console.log(req.session.user.username)
        res.render('changePassword', {title: 'Change Password',showAlert:false,code:1,username:req.session.user.username})
    }
    // [POST] /changepassword
    changePW(req,res) {
        const {username,password, comfirmPassword} = req.body
        console.log(password.length)
        if(password.length < 6) {
            return res.render('changePassword', {title: 'Change Password',showAlert:true,code:0,message: 'The password must has at least 6 characters!'})
        }
        if(password === comfirmPassword) {
            bcrypt.hash(comfirmPassword, saltRounds, async function(err, hash) {
                const result = await Account.updateOne(
                    { username: username }, // Replace with the actual username
                    { $set: { password: hash ,
                              change: 1
                    } }
                );
            });
            res.redirect('/login')
            
        } else {
            res.render('changePassword', {title: 'Change Password',showAlert:true,code:0,message: 'The comfirm password is not the same with the password'})
        }
    }
    // [GET] /verify-account
    verifyStaff(req,res) {
        //set the account verify to 1
        const token = req.query.token
        const username = req.query.username
        console.log(token)
        console.log(username)
        
        jwt.verify(token,'thinhisme123',async (err, decoded) => {
            if (err) {
                // Token is invalid or has expired
                return res.render('errorLink',  {title: "Error Page"})
                // Handle the error, e.g., render an error page or show a message to the user
            } else {
                const result = await Account.updateOne(
                    { username: username }, // Replace with the actual username
                    { $set: { verified: 1 } }
                );
                // Token is valid
                return res.redirect("/login")              
                // Mark the user account as verified in yo ur database
                // Redirect the user to a success page or show a message indicating successful verification
            }
        });
    }
    // [GET] /pos
    showPOS(req,res) {
        Product.find().lean()
            .then(product => {
                    res.render('POS', {title: "POS Page",product:product})
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }


    async showChartToday(req, res) {
        try {
            const result = await OrderDetail.aggregate([
                {
                    $match: {
                        // Add any additional filters if needed
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$saleDate" } },
                        totalAmount: { $sum: { $toInt: "$amountOrder" } }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        date: "$_id",
                        totalAmount: 1
                    }
                },
                {
                    $sort: {
                        date: 1
                    }
                }
            ]);
        
            res.json(result);
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
    }


}

module.exports = new SiteControllers();
