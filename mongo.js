const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://richwalton:Z7QpJbEqnRS5ib3D@cluster0.dyuho.mongodb.net/art_news_database?retryWrites=true&w=majority'

module.exports = async () => {
    await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    return mongoose
}