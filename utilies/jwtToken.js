const jwt = require('jsonwebtoken');

const createToken = ({payload}) =>{
    // console.log(payload)
    const token = jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:process.env.JWT_LIFETIME});
    return token;
}

const isTokenValid = ({token}) => jwt.verify(token,process.env.SECRET_KEY);

const attachCookiesToRes = ({res,user})=>{
    const token = createToken({payload:user})
    const oneDay = 1000*60*60*24
    res.cookie('token',token,{
        httpOnly:true,
        expire: new Date(Date.now()+oneDay),
        secure:process.env.NODE_ENV === 'production', // when we publish our app in production 
        signed:true
    });
    // res.status(200).json({msg:'Email registered successfully',user});

}

module.exports = {
    createToken,isTokenValid,attachCookiesToRes
}