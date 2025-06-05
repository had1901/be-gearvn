const jwt = require('jsonwebtoken')


const verifyToken = (req, res, next) => {
    const accessToken = req.cookies?.access_token
    const paths = ['/auth/register', '/auth/login', '/auth/logout', '/auth/refreshToken']
    if(!paths.includes(req.originalUrl)) {
        if (!accessToken) {
           return res.status(401).json({
               message: 'Token is not provided',
               ec: -1,
               hasAccessToken: false
           })
        } 
        jwt.verify(accessToken, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                if(err.name === 'TokenExpiredError') {
                    return res.status(403).json({
                        message: 'Access_token has expired',
                        ec: 1,
                        isHasExpired: true
                    })
                }
                return res.status(403).json({
                    message: 'Access_token invalid',
                    ec: -1,
                    isValid: false
                })
            }
            req.user = decoded
            next()
        })
    } else {
        next()
    }
    
}
module.exports = verifyToken