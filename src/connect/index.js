const { Sequelize } = require("sequelize")
const dotenv = require('dotenv')

const environment = process.env.NODE_ENV || 'development'
dotenv.config({ path: `.env.${environment}` })

const connectDatabase = async () => {
    try {
        const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DB_USERNAME, process.env.PASSWORD, {
            host: process.env.HOST,
            dialect: process.env.DATABASE,
            port: process.env.DB_PORT,
            logging: false,
            define: {
                freezeTableName: true 
            },
            

        })
        await sequelize.authenticate()
        await sequelize.sync({ force: true })
        
        console.log('Connection database successfully.')
        console.log({
          'HOST:': process.env.HOST,
          'DATABASE:': process.env.DATABASE_NAME,
          'USERNAME:': process.env.DB_USERNAME,
          'PASSWORD:': process.env.PASSWORD,
        })
    } catch (e) {
        console.log(`Lỗi kết nối Database ${e}`)
    }
}
module.exports = connectDatabase