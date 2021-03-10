const express = require('express')
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const app = express();
app.listen(port);

require('dotenv').config()

module.exports = async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://richwalton:Z7QpJbEqnRS5ib3D@cluster0.dyuho.mongodb.net/art_news_database?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    return mongoose
}