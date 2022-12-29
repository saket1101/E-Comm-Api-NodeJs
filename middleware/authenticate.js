const { isTokenValid } = require("../utilies/app");


// for authorize some router for user and validating with token
const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (token) {
    // console.log("token availabel",token);
    try {
      const {name,userId,role} = isTokenValid({ token });
      req.user = { name,userId,role};
    // console.log('payload',payload)
      next();
    } catch (error) {
      res.send("token not verified", error);
    }
  } else {
    // console.log('tokenn not aval');
    res.status(401).json("Unauthorised token");
    return;
  }
   
};

// for checking role of user sometimes  we need to authorise some route for only admin or owner else 
const authorizePermission  = (...roles)=>{
return (req,res,next)=>{
  if(!roles.includes(req.user.role)){
    return res.status(403).json('Unauthorized error')
  }
  next();
}
};

module.exports = {authenticateUser,
  authorizePermission
}
