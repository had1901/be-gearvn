const express = require('express')
const router = express.Router()

const chatbotController = require('../controller/chatbotController.js')




const chatbotRouter = (app) => {
    router.post("/chat", chatbotController.chatbot)

    return app.use('/api', router)
}


module.exports = chatbotRouter