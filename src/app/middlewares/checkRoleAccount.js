// middleware.js
const checkRoleAccount= (req, res, next) => {
  const role = req.session.user.role
    if(role === 'admin')
      next();
    else 
      res.redirect('/')
  };
  
module.exports = checkRoleAccount;
  