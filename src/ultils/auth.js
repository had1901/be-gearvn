const bcrypt = require('bcrypt')
const saltRounds = 10

const hashPassword = async password => {
    const hash = await bcrypt.hash(password, saltRounds)
    return hash
}

const checkPassword = async (password, hashedPassword) => {
    const check = await bcrypt.compare(password, hashedPassword)
    return check
}

module.exports = { hashPassword, checkPassword }