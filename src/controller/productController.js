
const { Op } = require('sequelize')
const db = require('../models/index.js')
const dotenv = require('dotenv')
const path = require('path')
const cloudinary = require('../config/cloudinaryConfig.js')
const { isArray } = require('util')
const environment = process.env.NODE_ENV || 'development'
dotenv.config({path: `.env.${environment}`})


const productController = {
    getAll: async (req,res,next) => {
        try{
            const products = await db.Product.findAll({
                // attributes: ['id', 'name', 'description', 'thumbnail', 'price', 'sale_price', 'flash_sale', 'sale_percent', 'stock_quantity', 'rating_count', 'category_id', 'brand_id'],
                include: [
                    { 
                        model: db.Brand,
                        attributes: ['id', 'name'] 
                    },
                    { 
                        model: db.Category,
                        attributes: ['id', 'tag', 'name', 'slug'] 
                    },
                    { 
                        model: db.Product_images,
                        attributes: ['id', 'product_id', 'url'] 
                    },
                ],
                logging: false,
                order: [['createdAt', 'DESC']]
                // nest: true,
                // raw: true,
            })  
            if(!products) {
                return res.status(400).json({
                    ms: 'No product',
                    ec: 1
                })
            } 
            return res.status(200).json({
                ms: 'Get all product',
                ec: 0,
                dt: products
            }) 
        } catch(e){
            return next(e)
        }
    },
    getById: async (req,res,next) => {
        const { id } = req.body
        try{
            const product = await db.Product.findOne({
                where: { id: id },
                attributes: ['id', 'name', 'description', 'thumbnail', 'price', 'sale_price', 'flash_sale', 'sale_percent', 'stock_quantity', 'rating_count', 'category_id', 'brand_id'],
                include: [
                    { 
                        model: db.Brand,
                        attributes: ['id', 'name'] 
                    },
                    { 
                        model: db.Category,
                        attributes: ['id', 'tag', 'name', 'slug'] 
                    },
                    { 
                        model: db.Product_images,
                        attributes: ['id', 'url'] 
                    },
                ],
                logging: false,
                // nest: true,
                // raw: true,
            })   
            if(!product) {
                return res.status(400).json({
                    ms: 'No product',
                    ec: 1
                })
            } 
            return res.status(200).json({
                ms: 'Get  product',
                ec: 0,
                dt: product
            }) 
        } catch(e){
            return next(e)
        }
    },
    getByCategory: async (req,res,next) => {
        console.log('query', req.query.category)
        const { category } = req.query
        try{
            const products = await db.Product.findAll({
                attributes: ['id', 'name', 'description', 'thumbnail', 'price', 'sale_price', 'flash_sale', 'sale_percent', 'stock_quantity', 'rating_count', 'category_id', 'brand_id'],
                include: [
                    { 
                        model: db.Brand,
                        attributes: ['id', 'name'] 
                    },
                    { 
                        model: db.Category,
                        attributes: ['id', 'tag', 'name', 'slug'],
                        where: { 
                            tag: {
                                [Op.like]: `%${category}%` 
                        }   } 
                    },
                ],
                logging: false,
                nest: true,
                raw: true,
            })   
            if(!products) {
                return res.status(400).json({
                    ms: 'No product',
                    ec: 1
                })
            } 
            return res.status(200).json({
                ms: 'Get all product',
                ec: 0,
                dt: products
            }) 
            
        } catch(e){
            return next(e)
        }
    },
    // updateProduct: async (req,res,next) => {
    //     // console.log('body',req.body)
    //     // console.log('files',req.files)
    //     const { id, name, description, description_short, flash_sale, price, sale_price, content, stock, Category, Brand } = req.body

    //     const files = req.files
    //     const optimize = {}
    //     console.log('Số lượng file:', req.files?.collection?.length)
    //     if (!req.files && !req.body) {
    //         return res.status(400).json({ 
    //             messages: 'No upload',
    //             ec: 1,
    //         })
    //     }
    //     const transactionInstance = await db.sequelize.transaction()
    //     try {
    //     // Upload avatar nếu có
    //     if (files.avatar) {
    //         const avatarUpload = await cloudinary.uploader.upload(files.avatar[0].path, {
    //             folder: 'gearvn/product-images/avatar',
    //             public_id: path.parse(files.avatar[0].originalname).name,
    //             overwrite: true,
    //             unique_filename: false,
    //             invalidate: true
    //         })

    //         optimize.avatar = cloudinary.url(avatarUpload.public_id, {
    //             fetch_format: 'auto',
    //             quality: 'auto',
    //             crop: 'fill',
    //             gravity: 'auto',
    //         }) + `?v=${Date.now()}`
    //     }

    //     // Upload collection nếu có
    //     if (files.collection) {
    //         const collectionUpload = await Promise.all(files.collection.map(file =>
    //             cloudinary.uploader.upload(file.path, {
    //                 folder: 'gearvn/product-images/collection',
    //                 public_id: path.parse(file.originalname).name,
    //                 overwrite: true,
    //                 unique_filename: false,
    //                 invalidate: true,
    //             })
    //         ))

    //         optimize.collection = collectionUpload.map(item =>
    //             cloudinary.url(item.public_id, {
    //                 fetch_format: 'auto',
    //                 quality: 'auto',
    //                 crop: 'fill',
    //                 gravity: 'auto',
    //                 width: 500,
    //                 height: 500,
    //             }) + `?v=${Date.now()}`
    //         )
    //     }

    //     // Cập nhật sản phẩm (tùy có avatar hay không)
    //     const updatedData = {
    //         name,
    //         description,
    //         price,
    //         sale_price,
    //         stock_quantity: stock,
    //         content: content || null,
    //         flash_sale
    //     }

    //     if (optimize.avatar) {
    //         updatedData.thumbnail = optimize.avatar
    //     }

    //     const [updatedProduct] = await db.Product.update(updatedData, 
    //         { where: { id } }, 
    //         { transaction: transactionInstance }
    //     )
    //     if (updatedProduct === 0) {
    //         return res.status(400).json({
    //             ms: 'Không tìm thấy sản phẩm cần cập nhật',
    //             ec: 1,
    //         })
    //     } 
    //     const product = await db.Product.findByPk(id)
    //     if(product.dataValues.id && optimize.collection) {

    //         // Xóa ảnh trước khi thêm ảnh mới
    //         console.log('Xóa collection', product.dataValues.id, optimize.collection)
    //         await db.Product_images.destroy({
    //             where: { product_id: product.dataValues.id },
    //             transaction: transactionInstance
    //         })

    //         // Thêm ảnh mới
    //         const collectionImage = optimize.collection.map(item => (
    //             {
    //                 url: item,
    //                 product_id: product.dataValues.id
    //             }
    //         ))
    //         console.log('Danh sách ảnh mới', collectionImage)

    //         if(collectionImage.length > 0) {
    //             console.log('Thêm mới collection')
    //             await db.Product_images.bulkCreate(collectionImage, { transaction: transactionInstance })
    //         }
    //     }
    //     console.log('Cập nhật xong')
    //     await transactionInstance.commit()
    //     return res.status(200).json({
    //         ms: 'Update sản phẩm thành công',
    //         ec: 0,
    //         dt: product
    //     })  
    //     } catch (e) {
    //         console.error('Update error', e)
    //         await transactionInstance.rollback()
    //         return next(e) 
    //     }
    // },
    // createNewProduct: async (req,res,next) => {
    //     console.log('body', req.body)
    //     console.log('files', req.files)
        
    //     const files = req.files
    //     let optimize = {}
    //     const avatarPublicIds = []
    //     const collectionPublicIds = []

    //     if (!Object.keys(req.body || {}).length) {
    //         return res.status(404).json({ 
    //             ms: 'Vui lòng gửi lên đầy đủ dữ liệu',
    //             ec: 1,
    //         })
    //     }
    //     const transactionInstance = await db.sequelize.transaction()

    //     const { name, description, description_short, flash_sale, price, sale_price, content, stock, Category, Brand } = req.body
    //     try{
    //         // Tải 1 ảnh và optimize
    //         if (files.avatar) {
    //             const avatarUpload = await cloudinary.uploader.upload(files.avatar[0].path, {
    //                 folder: 'gearvn/product-images/avatar',
    //                 public_id: path.parse(files.avatar[0].originalname).name,
    //                 // overwrite: true,
    //                 // unique_filename: false,
    //                 // invalidate: true
    //             })
    //             avatarPublicIds.push(avatarUpload.public_id)
    //             optimize.avatar = cloudinary.url(avatarUpload.public_id, {
    //                 fetch_format: 'auto',
    //                 quality: 'auto',
    //                 crop: 'fill',
    //                 gravity: 'auto',
    //             }) + `?v=${Date.now()}`
    //         }
    //         const dataUpload = {
    //                 name,
    //                 description,
    //                 price,
    //                 sale_price,
    //                 flash_sale: 0,
    //                 content,
    //                 stock_quantity: stock,
    //                 category_id: Category,
    //                 brand_id: Brand,
    //         }

    //         if(optimize.avatar) {
    //             dataUpload.thumbnail = optimize.avatar
    //         }

    //         // Tạo sản phẩm mới
    //         const createdProduct = await db.Product.create(dataUpload, { transaction: transactionInstance })
    //         if(!createdProduct) {
    //             await transactionInstance.rollback()
    //             return res.status(400).json({
    //                 ms: 'Tạo mới không thành công',
    //                 ec: 1,
    //             }) 
    //         }
            
    //         // Tải nhiều ảnh và optimize
    //         const { id } = createdProduct.dataValues
    //         if(id && files.collection && files.collection.length > 0) {
    //             const collectionUpload = await Promise.all(files.collection.map(file =>
    //                 cloudinary.uploader.upload(file.path, {
    //                     folder: 'gearvn/product-images/collection',
    //                     public_id: path.parse(file.originalname).name + Date.now(),
    //                 })
    //             ))

    //             collectionUpload.forEach(item => collectionPublicIds.push(item.public_id))
    //             optimize.collection = collectionUpload.map(item =>
    //                 cloudinary.url(item.public_id, {
    //                         fetch_format: 'auto',
    //                         quality: 'auto',
    //                         crop: 'fill',
    //                         gravity: 'auto',
    //                         width: 500,
    //                         height: 500,
    //                     }) + `?v=${Date.now()}`
    //             )
    //             // Thêm nhiều ảnh vào bảng liên kết Product
    //             const collectionImage = optimize.collection.map(item => (
    //                 {
    //                     url: item,
    //                     product_id: id
    //                 }
    //             ))
    //             if(collectionImage.length > 0) {
    //                 await db.Product_images.bulkCreate(collectionImage, {  transaction: transactionInstance })
    //             }
    //         }
    //         console.log('Tạo mới xong')
    //         await transactionInstance.commit()
    //         return res.status(200).json({
    //             ms: 'Tạo mới sản phẩm thành công',
    //             ec: 0,
    //             dt: createdProduct.dataValues
    //         })   
            
    //     } catch(e){
    //         console.log(e)
    //         await transactionInstance.rollback()

    //         // Xóa ảnh nếu lỗi chưa tạo được sản phẩm mới
    //         for (let public_id of [...avatarPublicIds, ...collectionPublicIds]) {
    //             try {
    //                 await cloudinary.uploader.destroy(public_id)
    //             } catch (err) {
    //                 console.warn('Không thể xóa ảnh:', public_id)
    //             }
    //         }
    //         return next(e)
    //     }
        
    // },
    
    updateProduct: async (req,res,next) => {
        console.log('body', req.body)
        if (!Object.keys(req.body || {}).length) {
            return res.status(404).json({ 
                ms: 'Vui lòng gửi lên đầy đủ dữ liệu',
                ec: 1,
            })
        }

        const { id, name, description, description_short, flash_sale, avatar, collection, price, sale_price, content, stock, Category, Brand } = req.body
        const transactionInstance = await db.sequelize.transaction()
        try{
            const updatedData = {
                name,
                description,
                price,
                sale_price,
                stock_quantity: stock,
                content: content || null,
                flash_sale,
                thumbnail: avatar,
                category_id: Category,
                brand_id: Brand
            }
            if(avatar) {
                updatedData.thumbnail = avatar
            }
            const [updatedProduct] = await db.Product.update(updatedData, 
                { where: { id } }, 
                { transaction: transactionInstance }
            )
            if (updatedProduct === 0) {
                return res.status(400).json({
                    ms: 'Không tìm thấy sản phẩm cần cập nhật',
                    ec: 1,
                })
            } 
            const product = await db.Product.findByPk(id)
            console.log('id', product.dataValues.id)
            if(product.dataValues.id && collection) {

                // Xóa ảnh trước khi thêm ảnh mới
                const remove = await db.Product_images.destroy({
                    where: { product_id: product.dataValues.id },
                    transaction: transactionInstance
                })
                console.log('Xóa', remove)
                if(remove) {
                    console.log('Đã xóa')
                }
                // Thêm ảnh mới
                const collectionImage = collection?.map(url => (
                    {
                        url,
                        product_id: product.dataValues.id
                    }
                ))
                console.log('Danh sách ảnh mới', collectionImage)

                if(collectionImage.length > 0) {
                    console.log('Thêm mới collection')
                    await db.Product_images.bulkCreate(collectionImage, { transaction: transactionInstance })
                }
            }
            await transactionInstance.commit()
            return res.status(200).json({
                ms: 'Client update',
                ec: 0
            })
        } catch(e) {
            console.log(e)
            await transactionInstance.rollback()
            return next(e)
        }
    },
    createNewProduct: async (req,res,next) => {
        console.log('body', req.body)

        if (!Object.keys(req.body || {}).length) {
            return res.status(404).json({ 
                ms: 'Vui lòng gửi lên đầy đủ dữ liệu',
                ec: 1,
            })
        }
        const { name, description, description_short, flash_sale, price, avatar, collection, sale_price, content, stock, Category, Brand } = req.body
        const transactionInstance = await db.sequelize.transaction()
        const data = {
                name,
                description,
                price, 
                sale_price,
                content,
                thumbnail: avatar,
                stock_quantity: stock,
                category_id: Category,
                brand_id: Brand,
        }
        try{
            const createdProduct = await db.Product.create(data, { transaction: transactionInstance })
            if(!createdProduct) {
                await transactionInstance.rollback()
                return res.status(400).json({
                    ms: 'Tạo mới không thành công',
                    ec: 1,
                }) 
            }
            const { id } = createdProduct.dataValues
            let collectionImage
            if(Array.isArray(collection) && collection.length > 0) {
                collectionImage = collection.map(url => (
                    {
                        url,
                        product_id: id
                    }
                ))
            } else {
                collectionImage = { url: collection, product_id: id }
            }
            
            if(collectionImage || collectionImage.length > 0) {
                await db.Product_images.bulkCreate(collectionImage, { transaction: transactionInstance })
            }

            await transactionInstance.commit()
            console.log('Tạo mới xong')
            return res.status(200).json({
                ms: 'Client create',
                ec: 0
            })
        } catch(e) {
            console.log(e)
            await transactionInstance.rollback()
            return next(e)
        }
    },
}

module.exports = productController