

const { where } = require('sequelize')
const db = require('../models/index.js')
const {hashPassword, checkPassword} = require('../ultils/auth.js')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library');
const dotenv = require('dotenv')
const environment = process.env.NODE_ENV || 'development'
dotenv.config({path: `.env.${environment}`})



const authController = {
    login: async (req, res, next) => {
        const { username, password } = req.body
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
            if(!checkUser) {
                const err = new Error('Tài khoản hoặc mật khẩu không đúng')
                return next(err)
            }
            // console.log('Đăng nhập', checkUser)
            const comparePassword = await checkPassword(password, checkUser.password)
            if(!comparePassword) {
                const err = new Error('Tài khoản hoặc mật khẩu không đúng')
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
                role_id: 2,
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
    updateProfile: async (req, res, next) => {
        // console.log('user', req.user)
        const { firstname, lastname, gender, phone, email, day, month, year } = req.body
        const { id } = req.user
        console.log(req.body)

        try{
            if(!id) {
                return res.status(400).json({
                    ms: 'Lỗi cập nhật hồ sơ',
                    ec: 1,
                })
            }
            await db.User.update(
                {
                    firstname,
                    lastname, 
                    phone,
                    email,
                },
                { where: { id }}
            )
            const user = await db.User.findOne({
                where: { id }
            })
            return res.status(200).json({
                ms: 'Cập nhật hồ sơ thanh công',
                ec: 0,
                dt: user
            })
        } catch(e) {
            return next(e)
        }
    },
    profile: async (req, res, next) => {
        const user = req.user
        if(!user) {
            return res.status(403).json({
                ms: 'Phiên đăng nhập hét hạn',
                ec: 1,
            })
        }
        return res.status(200).json({
            ms: null,
            ec: 0,
            dt: user
        })
        
    },
    refreshToken: async (req, res) => {
        const refreshToken = req.cookies?.refresh_token
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
                    secure: environment === 'production',
                    sameSite: environment === 'production' ? 'none' : 'strict',
                    maxAge: 600000,
                    path: '/'
                })
                res.cookie('refresh_token', new_refresh_token, { 
                    httpOnly:true,
                    secure: environment === 'production',
                    sameSite: environment === 'production' ? 'none' : 'strict',
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
    googleLogin: async (req, res, next) => {
        const { token } = req.body
        const client = new OAuth2Client(process.env.GOOGLE_ID)

        if (!token) {
            return res.status(404).json({ 
                ms: 'Missing token', 
                ec: 1 
            })
        }

        try{
            const ticket = await client.verifyIdToken({
                idToken: req.body.token,
                audience: process.env.GOOGLE_ID
            })
            if(!ticket) {
                return res.status(404).json({ 
                    ms: 'Missing ticket', 
                    ec: 1 
                })
            }
            const payload = ticket.getPayload()
            const { id, name, email, picture } = payload
            console.log('payload', payload)
            let checkUser = await db.User.findOne({
                where: { username: name, email: email },
                raw: true
            })

            if(!checkUser) {
                checkUser = await db.User.create({
                    username: name,
                    email: email,
                    avatar: picture,
                    phone: null,
                    address: null,
                    firstname: null,
                    lastname: null,
                    role_id: 3,
                })
            }
            const payloadUser = {
                id: checkUser.id,
                username: checkUser.username,
                email: checkUser.email,
                role_id: checkUser.role_id
              }
            console.log('user', checkUser)
            const access_token = jwt.sign(payloadUser, process.env.SECRET_KEY, { expiresIn: '10m', audience: 'client', issuer: 'myapp.com', algorithm: 'HS512'})
            const refresh_token = jwt.sign(payloadUser, process.env.SECRET_KEY, { expiresIn: '7d', audience: 'client', issuer: 'myapp.com', algorithm: 'HS512'})
            
            res.cookie('access_token', access_token, { 
                httpOnly:true,
                secure: environment === 'production',
                sameSite: environment === 'production' ? 'none' : 'strict',
                maxAge: 600000,
                path: '/'
            })
            res.cookie('refresh_token', refresh_token, { 
                httpOnly:true,
                secure: environment === 'production',
                sameSite: environment === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/'
            })
            return res.status(200).json({
                ms: 'Login google successfully',
                ec: 0,
                dt: { 
                    id: checkUser.id, 
                    name: checkUser.username, 
                    email: checkUser.email, 
                    picture: checkUser.avatar 
                }
            })
        } catch(e) {
            console.log('error', e)
            return res.status(400).json({
                ms: 'Login fail',
                ec: 1,
            })
        }
    },

    readById: async (req,res,next) => {
        const { id } = req.params
        try{
            const user = await db.User.findOne({ 
                where: { id: id },
                include: [
                    { 
                        model: db.Role,
                        
                    }
                ],
            })
            if(user) {
                return res.status(200).json({
                    ms: 'Get user',
                    ec: 0,
                    dt: user
                }) 
            }
            return res.status(404).json({
                ms: 'Not found users',
                ec: 0,
            }) 
        }catch(e){
            return next(e)
        }
    },
    read: async (req,res,next) => {
        try{
            console.log('associations', db.Role.associations)
            const users = await db.User.findAll({ 
                include: [
                    { 
                        model: db.Role,
                        include: [
                            {   
                                model: db.Permisstion,
                                //  through: {
                                //     attributes: [] // không lấy thông tin trung gian nếu không cần
                                // }
                            }
                        ]
                    }
                ],
                order: [
                    [db.Sequelize.literal(`Role.id = '1'`), 'DESC'],
                    ['createdAt', 'DESC'],
                ]
            })
            if(users.length > 0) {
                return res.status(200).json({
                    ms: 'Get all user',
                    ec: 0,
                    dt: users
                }) 
            }
            return res.status(404).json({
                ms: 'Not found users',
                ec: 0,
            }) 
        }catch(e){
            return next(e)
        }
    },
    create: async (req,res,next) => {
        console.log(req.body)
        const { username, email, roleId, permissionId } = req.body

        try{
            const [user, created] = await db.User.findOrCreate({ 
                where: { username: username },
                defaults: {
                    username,
                    email,
                    role_id: roleId
                }
            })
            
            if(!created) {
                return res.status(409).json({
                    ms: 'Tên đăng nhập đã tồn tại',
                    ec: 1,
                }) 
            }
            
            // const { id } = user.dataValues
            // let permissionList 
            // if(permissionId.length > 0) {
            //     permissionList = permissionId.map(numberId => (
            //         {
            //             role_id: id,
            //             permisstion_id: numberId
            //         }
            //     ))
            //     await db.User.bulkCreate(permissionList)
            // }
            
            return res.status(201).json({
                ms: 'Tạo thành công',
                ec: 0,
            }) 

        }catch(e){
            return next(e)
        }
    },
    update: async (req,res,next) => {
        console.log(req.body)
        const { id, username, email, roleId } = req.body
        try{
            const users = await db.User.update(
            { 
                username,
                email,
                role_id: roleId
            },
            { where: { id } },
        )
            // console.log(users)
            if(!users) {
                return res.status(404).json({
                    ms: 'Không tìm thấy người dùng',
                    ec: 1,
                }) 
            }
            return res.status(201).json({
                ms: 'Cập nhật thành công',
                ec: 0,
                dt: users
            }) 
        }catch(e){
            console.log(e)
            return next(e)
        }
    },
    remove: async (req,res,next) => {
        const { id } = req.params
        console.log(id)
        try{
            await db.User.destroy({ where: { id } })
            return res.status(200).json({
                ms: 'Xóa thành công',
                ec: 0,
            }) 
        }catch(e){
            return next(e)
        }
    },
}

module.exports = authController