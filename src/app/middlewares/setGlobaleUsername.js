// middleware.js
const setGlobalVariables = (req, res, next) => {
    res.locals.globalData = {
      id:req.session.user._id.toString(),
      username: req.session.user.username,
      email: req.session.user.email,
      role: req.session.user.role,
      change: req.session.user.change,
      verified: req.session.user.verified,
      permission:req.session.user.permission,
      blocked:req.session.user.blocked,
      image:req.session.user.image
    };
    next();
  };
  
module.exports = setGlobalVariables;
  