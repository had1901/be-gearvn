
const fs = require('fs/promises')


async function renameFiles(req, res, next) {
    try {
      const files = await fs.readdir('./src/migrations');
      if(!files) return
      const fileModule = files.filter(file => file.endsWith('.js'))
      fileModule.map(async (file) => {
        const transformFile = file.split('.')[0]
        await fs.rename(`./src/migrations/${transformFile}.js`, `./src/migrations/${transformFile}.cjs`)
      })
      next()
    } catch (err) {
      console.error('Lỗi đọc thư mục:', err)
      next(err)
    }
  }
  
module.exports = renameFiles