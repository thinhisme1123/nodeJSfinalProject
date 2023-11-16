
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
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
  
    return result;
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
        res.render('create-staff',{userLogin, title: "Create Staff Page"})
    }
    // [POST] /create staff
    async createStaff(req, res) {
        const { email, role } = req.body;
        const username = getUsernameFromEmail(email);
        const password = generateRandomString(8);
    
        console.log('Username:', username);
    
        const result = validationResult(req);
    
        if (result.errors.length !== 0) {
            const message = result.errors[0].msg;
            req.flash('error', message);
            return res.send(message);
        }
    
        try {
            const us = new Account({
                username: username,
                password: password,
                role: role
            });
            await us.save();
            res.send("Create new staff success");
        } catch (err) {
            console.error('Error creating staff:', err);
            req.flash('error', 'An error occurred while creating the staff.');
            res.status(500).send('Internal Server Error');
        }
    }
    
}

module.exports = new StaffControllers();
