
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

        Account.find().lean()
            .then(staff => {
                res.render('staff', {userLogin, title: "Staff Page",staff:staff,})
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }
    // [GET] /show create staff 
    createStaffInterface(req,res) {
        res.render('create-staff',{userLogin,showAlert:false ,code:1,title: "Create Staff Page"})
    }
    // [POST] /create staff
    async createStaff(req, res) {
        const { email, role ,change, verified, image,blocked } = req.body;
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
                        const imageUrl = req.file ? `/uploads/staffs/${req.file.filename}` : null;
                        const us = new Account({
                            username: username,
                            password: username,
                            email: email,
                            role: role,
                            image: imageUrl,
                            change:change,
                            verified:verified,
                            blocked:blocked
                        });
                        await us.save();
                        // Generate a token with a 1-minute expiration time
                        //expireIn phải để vị trí cuối cùng của jwt.sign
                        const verificationToken = jwt.sign({ email }, 'thinhisme123', { expiresIn: '1m' });
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
            
                        const verificationLink = `https://www.htpchronicles.tech/verify-account?token=${verificationToken}&username=${username}`;
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
    // [delete] /staff/delete/:id
    async deleteStaff(req,res) {
        const staffID = req.params.id
        console.log(staffID)
        try {
            const result = await Account.deleteOne({ _id: staffID});
            console.log(`Deleted ${result.deletedCount} document`);       
            res.json({message: "OK"})
          } catch(error) {
            // Close the connection when you're done
            res.send(error)
          }
    }
    // [GET] /edit staff
    async showEditStaff(req,res) {
        const staffID = req.params.id
        
        Account.findById(staffID)
        .lean()
        .then(staff => {
            if (!staff) {
                // Product not found
                return res.status(404).json({ error: 'Staff not found' });
            }
                res.render('edit-staff',{userLogin, title: "Edit Staff Page" , staff})
            })
            .catch(error => {
                console.error('Error fetching staff by ID:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
        
    }
    // [POST] /edit staff
    editStaff(req, res) {
        const staffID = req.params.id;
        const uploadedImage = req.file;
        const image = req.file ? `/uploads/staffs/${uploadedImage.filename}` : null;
        //dùng toán tử rest để lưu trữ giá trị cũ và giá trị mới
        const updateFields = { ...req.body, image };


        Account.findOneAndUpdate(
          { _id: staffID },
          { $set: updateFields },
          { new: true, lean: true } // This will return the updated document
        )
          .then(updatedStaff => {
            if (!updatedStaff) {
                console.log(updatedStaff)
              return res.status(404).json({ error: 'Staff not found' });
            }
            else if(updatedStaff.role === 'admin') {
                res.redirect('/staff/admin');
            }
            else {
                res.redirect('/staff')
            }
            // Successfully updated, send the updated product in the response
          })
          .catch(error => {
            console.error('Error updating staff:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          });
    }

     // [POST] /edit staff
     editProfile(req, res) {
        const staffID = req.params.id;
        const uploadedImage = req.file;
        const image = req.file ? `/uploads/staffs/${uploadedImage.filename}` : null;
        //dùng toán tử rest để lưu trữ giá trị cũ và giá trị mới
        const updateFields = { ...req.body, image };


        Account.findOneAndUpdate(
          { _id: staffID },
          { $set: updateFields },
          { new: true, lean: true } // This will return the updated document
        )
          .then(updatedStaff => {
            if (!updatedStaff) {
                console.log(updatedStaff)
              return res.status(404).json({ error: 'Staff not found' });
            }
            else {
                res.redirect(`/profile/${staffID}`)
            }
            // Successfully updated, send the updated product in the response
          })
          .catch(error => {
            console.error('Error updating staff:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          });
    }


    resendEmailStaff(req, res) {
        const email = req.params.email
        const username = req.body.username
        const verificationToken = jwt.sign({ email }, 'thinhisme123', { expiresIn: '1m' });
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

        const verificationLink = `https://www.htpchronicles.tech/verify-account?token=${verificationToken}&username=${username}`;
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
                res.json({message:'ok'})
                console.log('Email sent:', info.response);
            }
        });
    }
    blockStaff(req, res) {
        const staffID = req.params.id;
        const isBlocked = req.body.blocked;
    
        let updateFields;
    
        if (isBlocked === '1') {
            console.log('account blocked');
            updateFields = {
                blocked: 0,
            };
        } else if (isBlocked === '0') {
            console.log('account not blocked');
            updateFields = {
                blocked: 1,
            };
        }
    
        Account.findByIdAndUpdate(
            { _id: staffID },
            { $set: updateFields },
            { new: true, lean: true }
        )
        .then(data => {
            res.json(data.blocked); // Assuming data has a 'blocked' field
        })
        .catch(error => {
            // Handle errors
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    }

      // [POST] /search staff
      searchStaff(req, res) {
        const {
        searchTerm
        } = req.body;
        console.log(searchTerm)
        Account.find({
        $or: [{
            username: {
                $regex: searchTerm,
                $options: 'i'
            }
            }
        ]
        }).then(account => {
            if(account) {
                res.json(account)
            } else {
                res.json({})
            }
        })
        .catch((error) => {
            console.error('Error fetching staff:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });

    }
    showAdmin(req,res) {
        console.log(req.session.user)

        Account.find().lean()
            .then(admin => {
                console.log(admin.role)
                res.render('admin', {userLogin, title: "Admin Page",admin:admin,})
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }
    
}

module.exports = new StaffControllers();
