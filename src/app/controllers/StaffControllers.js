
// Đối với phiên bản hiện tại của handlebar thì sẽ không cần viết tool chuyển sang object nữa, 
// cứ truyền thẳng vào
const Account = require('../models/Account')
const Product = require('../models/Product')
const session = require('express-session')
const nodemailer = require('nodemailer');
var userLogin = true


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
        res.render('create-staff',{userLogin, title: "Create Staff Page"})
    }
    // [POST] /create staff
    createStaff(req,res) {
        const {email} = req.body
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'kieplulanh93@gmail.com',  // Replace with your Gmail email address
              pass: 'deiq qbvp vjtv yatu'    // Replace with your Gmail password or an application-specific password
            }
          });
        
        const verificationLink = 'https://localhost:3000';
        // Setup email data
        const mailOptions = {
            from: 'kieplulanh93@gmail.com',  // Sender email address
            to: `${email}`,  // Recipient email address
            subject: 'Account Verification',  // Email subject
            html: `
                    <p>Thank you for creating an account!</p>
                    <p>Please click the button below to verify your account:</p>
                    <a href="${verificationLink}" style="display:inline-block; padding:10px 20px; background-color:#3498db; color:#ffffff; text-decoration:none; border-radius:5px;">Verify Your Account</a>
                    <p>If you didn't create an account, you can ignore this email.</p>
                `
          };
        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            console.error('Error:', error);
            } else {
            console.log('Email sent:', info.response);
            }
        });
    }
}

module.exports = new StaffControllers();
