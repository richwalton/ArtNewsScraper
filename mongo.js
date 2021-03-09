const mongoose = require('mongoose');
const mongoArtData = 'mongodb+srv://richwalton:Z7QpJbEqnRS5ib3D@cluster0.dyuho.mongodb.net/art_news_database?retryWrites=true&w=majority'

module.exports = async () => {
    await mongoose.connect(mongoArtData, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    return mongoose
}