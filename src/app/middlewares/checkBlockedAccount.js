// middleware.js
const checkBlockedAccount= (req, res, next) => {
  const blocked = req.session.user.blocked
    if(blocked === 0)
      next();
    else 
      res.redirect('/')
};
  
module.exports = checkBlockedAccount;
  