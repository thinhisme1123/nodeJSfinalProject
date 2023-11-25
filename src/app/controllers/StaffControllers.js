
// Đối với phiên bản hiện tại của handlebar thì sẽ không cần viết tool chuyển sang object nữa, 
// cứ truyền thẳng vào
const Account = require('../models/Account')
const Product = require('../models/Product')
const session = require('express-session')
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken');
const flash = require('express-flash');
const {check, validationResult } = require('express-validator')
var userLogin = true

function getUsernameFromEmail(email) {
    // Split the email address at the "@" symbol
    const parts = email.split('@');

    // The first part (index 0) will be the username
    const username = parts[0];
  
    return username;
}
//chứa function handler
class StaffControllers {

    // [GET] /staff
    index(req, res) {
        const isActive = true;
        console.log(req.session.user)
        res.render('staff', {userLogin, title: "Staff Page"})
    }
    // [GET] /show create staff 
    createStaffInterface(req,res) {
        res.render('create-staff',{userLogin,showAlert:false ,code:1,title: "Create Staff Page"})
    }
    // [POST] /create staff
    async createStaff(req, res) {
        const { email, role ,change, verified} = req.body;
        const username = getUsernameFromEmail(email);
    
        console.log('Username:', username);
    
        const result = validationResult(req);
    
        if (result.errors.length !== 0) {
            const message = result.errors[0].msg;
            req.flash('error', message);
            return res.send(message);
        }
        Account.findOne({username:username})
            .then(async data => {
                if(data) {
                    return res.render("create-staff",{userLogin,showAlert:true,code:0,message:"Username already existed!"})
                }
                else {
                    try {
                        const us = new Account({
                            username: username,
                            password: username,
                            email: email,
                            role: role,
                            change:change,
                            verified:verified
                        });
                        await us.save();
                        // Generate a token with a 1-minute expiration time
                        //expireIn phải để vị trí cuối cùng của jwt.sign
                        const verificationToken = jwt.sign({ email }, 'thinhisme123', { expiresIn: '20s' });
                        req.session.token = verificationToken
                        req.session.username = username
                        console.log(req.session.username)
                        console.log(req.session.token)
        
                        const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'kieplulanh93@gmail.com', // Replace with your Gmail email address
                            pass: 'deiq qbvp vjtv yatu', // Replace with your Gmail password or an application-specific password
                        },
                        });
            
                        const verificationLink = `http://localhost:3000/verify-account?token=${verificationToken}&username=${username}`;
                        // The link now includes the token as a query parameter
                        
            
                        // Setup email data
                        const mailOptions = {
                        from: 'kieplulanh93@gmail.com', // Sender email address
                        to: email, // Recipient email address
                        subject: 'Account Verification', // Email subject
                        html: `
                                <p>Thank you for creating an account!</p>
                                <p>Please click the button below to verify your account:</p>
                                <a href="${verificationLink}" style="display:inline-block; padding:10px 20px; background-color:#3498db; color:#ffffff; text-decoration:none; border-radius:5px;">Verify Your Account</a>
                                <p>Your username is: <strong>${username}</strong></p>
                                <p>Your temporary password is: <strong>${username}</strong></p>
                                <p>If you didn't create an account, you can ignore this email.</p>
                            `,
                        };
            
                        // Send email
                        transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error('Error:', error);
                        } else {
                            res.render("create-staff", {userLogin,showAlert:true,code:1, message:"Staff account created success"})
                            console.log('Email sent:', info.response);
                        }
                        });
                    } catch (err) {
                        console.error('Error creating staff:', err);
                        req.flash('error', 'An error occurred while creating the staff.');
                        res.status(500).send('Internal Server Error');
                    }
                }
            })
    }
    
}

module.exports = new StaffControllers();
