
// Đối với phiên bản hiện tại của handlebar thì sẽ không cần viết tool chuyển sang object nữa, 
// cứ truyền thẳng vào

const { render } = require("node-sass")

// const {mutipleMongoosesObject} = require('../../util/mongoose')
const users = []
var userLogin = false
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

    login(req, res) {
        const { username, password } = req.body
        console.log(username, password)
        
        if (username === 'admin@gmail.com' && password === '123') {
            users.push(username)
            users.push(password)
            res.redirect('/')
            userLogin = true
        }
        else {
            res.render('login', { message: "Email or password invalid" })
        }
    }
}

module.exports = new SiteControllers();
