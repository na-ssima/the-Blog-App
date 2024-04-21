const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// dotenv.config();

// const secretKey = process.env.secretKey;

const auth = (req, res, next)=>{
    const authHeader = req.headers["authorization"]
if(!authHeader){
    return res.status(401).json("you are not authorized");
}
const token = authHeader.split(" ")[1]
if(!token){
    return res.status(401).json("token not exist");
}
jwt.verify(token, 'secret', (error, user)=>{
    if(error){
        res.status(401).json("you are not authorized")
    }
    req.user = user;
});
next();
};

module.exports = auth;

