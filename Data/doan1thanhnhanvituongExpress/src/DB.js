require('dotenv').config();
module.exports = {
    DB: `mongodb+srv://${process.env.USERNAME_PASSWORD_DB}@cluster0.stocr.mongodb.net/Doan1?retryWrites=true&w=majority`
}
