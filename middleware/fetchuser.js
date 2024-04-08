const jwt = require('jsonwebtoken')
const JWT_SECRET = 'helloheytatabyebye'

const fetchuser = (req,res,next)=>{
    // checking token form the header and returning bad request if no token is passed
    const token = req.header('auth-token');
    let success = false
    if(!token){
        res.status(401).json({error : 'Please authenticate using correct token',success});
    }
    try{
        //trying to verify the sent token 
        const data = jwt.verify(token,JWT_SECRET);
        req.user = data.user;
        next()
    }
    catch{
        //returning if token doesn't verify
        res.status(401).json({error : 'Please authenticate using correct token',success})
    }
}

module.exports = fetchuser