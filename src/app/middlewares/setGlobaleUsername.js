// middleware.js
const setGlobalVariables = (req, res, next) => {
    res.locals.globalData = {
      username: req.session.user.username,
      email: req.session.user.email,
      role: req.session.user.role,
      change: req.session.user.change,
      
    };
    next();
  };
  
module.exports = setGlobalVariables;
  