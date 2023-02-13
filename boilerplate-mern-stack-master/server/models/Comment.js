const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema({

    writer: { //작성자
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    postId: { //VideoId
        type: Schema.Types.ObjectId,
        ref: 'Video'
    },
    responseTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },    
    content: { //내용
        type: String
    }

}, { timestamps: true }) //만든날과 업데이트날 표시


const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment }