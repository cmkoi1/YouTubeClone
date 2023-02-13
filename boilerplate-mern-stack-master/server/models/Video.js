const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
    //필드 정의
    writer: {
        type: Schema.Types.ObjectId, //작성자의 Id를 넣으면
        ref: 'User' //User.js에서 정보를 다 불러올 수 있음
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String
    },
    privacy: {
        type: Number //값이 0 아니면 1이니까
    },
    filePath: {
        type: String
    },
    category: {
        type: String
    },
    views: {
        type: Number,
        default: 0 //view 수가 0부터 시작하기 때문
    },
    duration: {
        type: String
    },
    thumbnail: {
        type: String
    }


}, { timestamps: true }) //만든날과 업데이트날 표시


const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }