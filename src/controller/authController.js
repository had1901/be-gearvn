

const { where } = require('sequelize')
const db = require('../models/index.js')
const {hashPassword, checkPassword} = require('../ultils/auth.js')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const environment = process.env.NODE_ENV || 'development'
dotenv.config({path: `.env.${environment}`})

const authController = {
    login: async (req, res, next) => {
        const { username, password } = req.body
        console.log('login', req.body)
        console.log('model-role', db.Role)
        console.log('associations', db.User.associations)
        try {
            const checkUser = await db.User.findOne({
                where: { username: username },
                attributes: ['id','username', 'phone','password','address','avatar','firstname','lastname','email'],
                include: [
                    { 
                        model: db.Role,
                        attributes: ['id', 'name'] 
                    }
                ],
                    
                nest: true,
                raw: true,
            })

            const product = await db.Product.findOne({
                where: { category_id: 1 },
                include: [
                    { 
                        model: db.Category,
                        attributes: ['id', 'name'] 
                    },
                    { 
                        model: db.Brand,
                        attributes: ['id', 'name'] 
                    }
                ],
                    
                nest: true,
                raw: true,
            })
            console.log('product', product)
            if(!checkUser) {
                const err = new Error('Tài khoản không đúng')
                return next(err)
            }
            console.log('Đăng nhập', checkUser)
            const comparePassword = await checkPassword(password, checkUser.password)
            if(!comparePassword) {
                const err = new Error('Mật khẩu không đúng')
                return next(err)
            }

            const { password: pass, ...infoUser  } = checkUser
            const access_token = jwt.sign(infoUser, process.env.SECRET_KEY, { expiresIn: '10m', audience: 'client', issuer: 'myapp.com', algorithm: 'HS512'})
            const refresh_token = jwt.sign(infoUser, process.env.SECRET_KEY, { expiresIn: '7d', audience: 'client', issuer: 'myapp.com', algorithm: 'HS512'})
            
            res.cookie('access_token', access_token, { 
                httpOnly:true,
                // secure: false,
                // sameSite: 'none',
                maxAge: 600000,
                path: '/'
            })
            res.cookie('refresh_token', refresh_token, { 
                httpOnly:true,
                // secure: false,
                // sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/'
            })

            return res.status(200).json({
                ms: 'Đăng nhập thành công',
                success: true,
                dt: {...infoUser, access_token}
            })
        } catch(e) {
            const serverErr = new Error(e)
            return next(serverErr)
        }
    },
    register: async (req, res, next) => {
        const { username, password, phone, email } = req.body
        try{
            const checkUserExist = await db.User.findOne({
                where: { username: username }
            })
            if(checkUserExist) {
                const error = new Error('Tài khoản đã tồn tại')
                return next(error)
            } 
            const hashPass = await hashPassword(password)
            const createdUser = await db.User.create({
                username: username,
                password: hashPass,
                phone: phone,
                email: email,
                address: null,
                avatar: null,
                firstname: null,
                lastname: null,
                role_id: 3,
            })
            return res.status(201).json({
                message: 'Đăng ký thành công',
                ec: '0',
                success: true,
                dt: createdUser
            })
        } catch(e) {
            const serverErr = new Error('Lỗi kết nối server')
            return next(serverErr)
        }
    },
    logout: async (req, res) => {
        console.log('logout')
            res.clearCookie('access_token',{ 
                httpOnly:true,
                // secure: false,
                // sameSite: 'none',
                maxAge: 600000,
                path: '/'
            })
            res.clearCookie('refresh_token', { 
                httpOnly:true,
                // secure: false,
                // sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/'
            })

            return res.status(200).json({
                ms: 'Đăng xuất thành công',
                success: true,
            })
    },
    profile: async (req, res) => {
        // console.log('user', req.user)
        const {iat, exp, iss, aud, password, ...infoUser} = req.user
        return res.status(200).json({
            ms: 'Get profile successfully',
            ec: 0,
            dt: infoUser
        })
    },
    refreshToken: async (req, res) => {
        const refreshToken = req.cookies?.refresh_token
        console.log('refresh', refreshToken)
        if(refreshToken) {
            return jwt.verify(refreshToken, process.env.SECRET_KEY, (err, decoded) => {
                if (err) {
                    if(err.name === 'TokenExpiredError') {
                        return res.status(403).json({
                            message: 'Refresh_token has expired',
                            ec: 1,
                            isHasExpired: true
                        })
                    }
                    return res.status(401).json({
                        message: 'Refresh_token invalid',
                        ec: -1,
                        isValid: false
                    })
                }
                const { exp, iat, ...newInfo } = decoded
                const new_access_token = jwt.sign(newInfo, process.env.SECRET_KEY, { expiresIn: '10m' })
                const new_refresh_token = jwt.sign(newInfo, process.env.SECRET_KEY, { expiresIn: '7d' })

                res.clearCookie('refresh_token', { 
                    httpOnly:true,
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    path: '/'
                })
                res.cookie('access_token', new_access_token, { 
                    httpOnly:true,
                    // secure: false,
                    // sameSite: 'none',
                    maxAge: 600000,
                    path: '/'
                })
                res.cookie('refresh_token', new_refresh_token, { 
                    httpOnly:true,
                    // secure: false,
                    // sameSite: 'none',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    path: '/'
                })
                return res.status(200).json({
                    message: 'Refresh_token is successfully',
                    ec: 0,
                    access_token: new_access_token,
                    refresh_token: new_refresh_token,
                    hasToken: true
                })
            })
        } else {
            return res.status(404).json({
                message: 'Refresh_token is not provided',
                ec: -1,
                hasToken: false
            })
        }
    },

}
module.exports = authController