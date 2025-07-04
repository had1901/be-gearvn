const multer = require('multer')


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'src/assets/products') // Thư mục lưu trữ tệp tin
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname + Date.now()) // Thay đổi tên file trước khi upload
    },
  })
  
const upload = multer({ 
  storage: storage, 
  limits: { fieldSize:  10 * 1024 * 1024 } 
})

module.exports = upload