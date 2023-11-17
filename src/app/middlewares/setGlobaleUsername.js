// middleware.js
const setGlobalVariables = (req, res, next) => {
    res.locals.globalData = {
      username: req.session.user.username,
      role: req.session.user.role
    };
    next();
  };
  
module.exports = setGlobalVariables;
  