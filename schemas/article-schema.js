const mongoose = require('mongoose');

const reqString = { 
    type: String,
    required: true
};

const articleSchema = mongoose.Schema({
    source: String,
    linkUrl: String,
    imgUrl: String,
    title: String,
    descript: String
})

module.exports.artNewsP = mongoose.model('artNewsP', articleSchema, 'artNewsPaper');
module.exports.artNews = mongoose.model('artNews', articleSchema, 'artNews');
module.exports.artNet = mongoose.model('artNet', articleSchema, 'artNet');
module.exports.hyperAll = mongoose.model('hyperAll', articleSchema, 'hyperAllergic');
module.exports.artsy = mongoose.model('artsy', articleSchema, 'artsy')
module.exports.artForums = mongoose.model('artForum', articleSchema, 'artForum');