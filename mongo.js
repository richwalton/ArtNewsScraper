const mongoose = require('mongoose');

require('dotenv').config()
const port = process.env.PORT || 3000;
app.listen(port);

module.exports = async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    return mongoose
}