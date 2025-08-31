
const { GoogleGenAI } = require("@google/genai")
const productController = require("./productController")
const db = require('../models/index.js')

const geminiAi = new GoogleGenAI({})


const category = [
    {
        category: 'PC',
        link: '/pages/pc-gvn'
    },
    {
        category: 'Laptop văn phòng',
        link: '/pages/laptop-van-phong'
    },
    {
        category: 'Laptop Gaming',
        link: '/pages/laptop-gaming'
    },
    {
        category: 'Màn hình',
        link: '/pages/man-hinh'
    },
    {
        category: 'Bàn phím',
        link: '/pages/ban-phim-may-tinh'
    },
]

let dataProduct = []
const prompt = `
Bạn là nhân viên tư vấn, chăm sóc khách hàng của website GearVN - chuyên cung cấp PC, Laptop và phụ kiện máy tính. website: https://gearvn-rust.vercel.app
Nếu tìm thấy sản phẩm người dùng cần tìm thì trả lời một cách ngắn gọn, trình bày đẹp mắt chuyên nghiệp. Uu tiên tìm kiếm và trả về data có sẵn.
Nếu không có thứ người dùng cần tìm thì trả lời là không có và tìm các sản phẩm cùng loại tương tự và tìm thông tin bên ngoài về cấu hình hoặc các thứ liên quan

Ưu tiên trả lời thông tin sản phẩm có sẵn từ database ở đây: ${JSON.stringify(dataProduct)}
`
const text = `
Phân tích câu sau và trả về JSON dạng:
{ "category": <sản phẩm viết cách nhau bởi dấu gạch ngang "-">, "price_range": <mức giá nếu có viết cách nhau bởi dấu gạch ngang "-">, "brand": <hãng nếu có viết cách nhau bởi dấu gạch ngang "-"> }
Nếu không thấy thì để null và trả về thông báo cho người dùng là không tìm thấy hoặc tìm các cấu hình phù hợp tương tự khác bên ngoài.
`
function cleanReply(text) {
  return text
    .replace(/[#*_`~>-]/g, "")       // bỏ ký tự markdown
    .replace(/🌐/g, "")              // bỏ emoji web
    .replace(/\n+/g, " ")            // thay xuống dòng bằng space
    .replace(/\s{2,}/g, " ")         // gom nhiều space thành 1
    .trim()
}

const chatbotController = {
    chatbot: async (req, res) => {
        const { message } = req.body
        console.log('message', message)
            try {
                // AI phân tích keyword câu hỏi
                // const intentRes = await geminiAi.models.generateContent({
                //     model: "gemini-2.5-flash",
                //     contents: [
                //             {
                //                 role: "user",
                //                 parts: [{ text: `
                //                     Phân tích câu hỏi và trả về JSON:
                //                     { "category": <sản phẩm>, "price_range": <giá>, "brand": <hãng> }
                //                     Nếu không có thì để null.
                //                     Giá trị của mỗi key sẽ viết thường và loại bỏ các dấu, viết liền cách nhau bằng dấu gạch ngang '-'
                //                     Câu hỏi: "${message}"` 
                //                 }]
                //             }
                //     ],
                //     config: {
                //         thinkingConfig: {
                //             thinkingBudget: 0, // Disables thinking
                //         }
                //     }
                // })
                // let raw = intentRes.candidates[0].content.parts[0].text

                // raw = raw.replace(/```json|```/g, "").trim()
                // const intent = JSON.parse(raw)
                // console.log('Câu hỏi', intent)
                // res.json({ reply: cleanReply(response.candidates[0].content.parts[0].text) })

                const products = await db.Product.findAll({
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
                            }) 
                dataProduct = products 
                const response = await geminiAi.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: [
                        { 
                            role: "user", 
                            parts: [{ text: `Thông tin sản phẩm: ${JSON.stringify(products)}. 
                                Hãy tư vấn cho khách một cách ngắn gọn thôi: Khách hỏi: ${message} thì hãy ưu tiên tìm kiếm thông tin từ trên website` }] 
                        },
                       
                    ],
                    config: {
                        thinkingConfig: {
                            thinkingBudget: 0, // Disables thinking
                        },
                        systemInstruction: prompt
                    }
                })
                res.json({ reply: cleanReply(response.candidates[0].content.parts[0].text) })
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
    }}

module.exports = chatbotController 