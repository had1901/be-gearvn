

const handleError = (error, req, res, next) => {
    console.log('Lỗi tập trung', error)
    return res.status(400).json({
        ms: error.message,
        success: false
    })
}

module.exports = handleError