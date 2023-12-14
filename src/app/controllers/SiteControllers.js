
// Đối với phiên bản hiện tại của handlebar thì sẽ không cần viết tool chuyển sang object nữa, 
// cứ truyền thẳng vào
const Account = require('../models/Account')
const OrderDetail = require('../models/OrderDetail')
const Product = require('../models/Product')
const Customer = require('../models/Customer')
const Order = require('../models/Order')
const Brand = require('../models/Brand')
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
            //calcualate the data to load to the dashboard
            const product = await Product.find().lean();
            const productAmount = product.length;
            const customer = await Customer.find().lean();
            const customerAmount = customer.length;
            const order = await Order.find().lean();
            const orderAmount = order.length;
            const brand = await Brand.find().lean();
            const brandAmount = brand.length;
            const account = await Account.find().lean();

            let totalSaleAmount = 0;
            //bất đông bộ, block code vòng lặp tính toán sẽ phải chạy xong thì mới lụm code tiếp thep
            // solution: phải dùng await để cho vòng lạp chạy xong rồi mới lụm
            order.forEach(e => {
                totalSaleAmount += Number(e.totalAmount);
            });

            const totalEmployees = account.filter(e => {
                return e.role === 'staff';
            }).length;


            if (req.session.user) {
                res.render('dashboard', {
                    title: "Home Page",
                    userLogin,
                    id:req.session.user._id.toString(),
                    username: req.session.user.username,
                    role: req.session.user.role,
                    change: req.session.user.change,
                    productAmount: productAmount,
                    customerAmount: customerAmount,
                    orderAmount: orderAmount,
                    totalSaleAmount: totalSaleAmount,
                    brandAmount: brandAmount,
                    totalEmployees: totalEmployees,
                    blocked: req.session.user.blocked,
                    
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

        res.render("login",{title: "Login Page", favicon:`<link type="image/png" sizes="16x16" rel="icon" href=".../icons8-login-16.png">
        <link type="image/png" sizes="32x32" rel="icon" href=".../icons8-login-32.png">
        <link type="image/png" sizes="96x96" rel="icon" href=".../icons8-login-96.png">
        <link rel="icon" type="image/png" sizes="72x72" href=".../icons8-login-72.png">
        <link rel="icon" type="image/png" sizes="96x96" href=".../icons8-login-96.png">
        <link rel="icon" type="image/png" sizes="144x144" href=".../icons8-login-144.png">
        <link rel="icon" type="image/png" sizes="192x192" href=".../icons8-login-192.png">
        <link rel="icon" type="image/png" sizes="512x512" href=".../icons8-login-512.png">
        <link rel="apple-touch-icon" type="image/png" sizes="57x57" href=".../icons8-login-57.png">
        <link rel="apple-touch-icon" type="image/png" sizes="60x60" href=".../icons8-login-60.png">
        <link rel="apple-touch-icon" type="image/png" sizes="72x72" href=".../icons8-login-72.png">
        <link rel="apple-touch-icon" type="image/png" sizes="76x76" href=".../icons8-login-76.png">
        <link rel="apple-touch-icon" type="image/png" sizes="114x114" href=".../icons8-login-114.png">
        <link rel="apple-touch-icon" type="image/png" sizes="120x120" href=".../icons8-login-120.png">
        <link rel="apple-touch-icon" type="image/png" sizes="144x144" href=".../icons8-login-144.png">
        <link rel="apple-touch-icon" type="image/png" sizes="152x152" href=".../icons8-login-152.png">
        <link rel="apple-touch-icon" type="image/png" sizes="180x180" href=".../icons8-login-180.png">
        <link color="#26E07F" rel="mask-icon" href=".../icons8-login-150.svg">
        <meta name="msapplication-square70x70logo" content=".../icons8-login-70.png">
        <meta name="msapplication-TileColor" content="#C0FFEE">
        <meta name="application-name" content="Beautiful application name">`})
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
                        console.log('------------')
                        console.log(req.session.user._id.toString())
                        console.log('------------')
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
        const id = req.params.id
        console.log('------------------')
        console.log(id)
        console.log('------------------')
        Account.findOne({
            _id:id
        }).lean()
        .then(account => {
            console.log(account)
            res.render('profile', {title: "Profile Page", userLogin, account:account})
        })
        .catch((error) => {
            console.error('Error fetching accounts:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
        
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
            const result = await Order.aggregate([
                {
                    $match: {
                        // Add any additional filters if needed
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$dateBuy" } },
                        totalAmount: { $sum: { $toInt: "$amount" } }
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
            console.log(result)
            res.json(result);
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
    }


}

module.exports = new SiteControllers();
