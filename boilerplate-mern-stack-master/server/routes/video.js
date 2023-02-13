const express = require('express');
const router = express.Router();
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");

const { Video } = require("../models/Video");
const { auth } = require("../middleware/auth");
const { Subscriber } = require("../models/Subscriber");

//STORAGE MULTER CONFIG
let storage = multer.diskStorage({
    destination: (req, file, cb) => { //파일을 올리면 어디다 저장할지 설명
        cb(null, "uploads/"); //boilerplate-mern-stack-master/uploads 폴더에 저장
    },
    filename: (req, file, cb) => { //어떤 파일 이름으로 저장할 것인지
        cb(null, `${Date.now()}_${file.originalname}`);
    }, //ex) 202301110409_hello
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') { //파일 형식. 비디오만
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true)
    }
});

const uploads = multer({ storage: storage }).single("file"); //파일을 하나만 받음

//=================================
//             Video
//=================================

router.post('/uploadfiles', (req, res) => { //index에서 경로를 받아옴. req를 통해 파일을 받음

    //비디오를 서버에 저장
    uploads(req, res, err => {
        if(err) {  //VideoUploadPage.js의 onDrop 부분이 처리
            return res.json({ success: false, err })
        }
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename })
    }) //url은 uploads 폴더의 경로를 보내 준다.

});


router.post('/uploadVideo', (req, res) => {

    //비디오 정보들을 저장한다.

    const video = new Video(req.body) //req.body는 모든 값이 담긴 것

    video.save((err, doc) => { //mongoDB 메소드로 저장
        if(err) return res.json({ success: false, err }) //실패
        res.status(200).json({ success: true }) //성공
    })

});


router.post('/getSubscriptionVideos', (req, res) => {

    // 자신의 아이디를 가지고 구독하는 사람들을 찾는다.
    Subscriber.find({ userFrom: req.body.userFrom })
        .exec((err, subscriberInfo) => { //subscriberInfo는 userFrom이 userTo를 구독하고 있는 정보
            if(err) return res.status(400).send(err);

            let subscribedUser = [];
            // subscribedUser 변수 안에 userTo 정보를 넣는 과정
            subscriberInfo.map((subscriber, i) => {
                subscribedUser.push(subscriber.userTo);
            })


            // 찾은 사람들의 비디오를 가지고 온다.
            Video.find({ writer: { $in: subscribedUser } })
            //writer: req.body.id 명령어 불가능, subscribedUser가 여러 명일 수 있기 때문.
            //$in을 이용하면 몇 명이든 subscribedUser에 있는 id를 가지고 writer를 찾을 수 있다.
                .populate('writer')
                .exec((err, videos) => {
                    if(err) return res.status(400).send(err);
                    res.status(200).json({ success: true, videos })
                })
        })

});


router.get('/getVideos', (req, res) => {

    //비디오를 DB에서 가져와서 클라이언트에 보낸다.
    
    Video.find() //비디오 컬렉션에 있는 모든 비디오 가져오기
        .populate('writer') //poulate을 해 줘야 writer의 모든 정보 가져오기 가능 안 하면 id만 가능
        .exec((err, videos) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({ success: true, videos})
        })

});


router.post('/getVideoDetail', (req, res) => {

    //비디오 id에 맞는 정보를 DB에서 가져와서 클라이언트에 보낸다.
    
    Video.findOne({ "_id" : req.body.videoId })
        .populate('writer')
        .exec((err, videoDetail) => {
            if(err) return res.status(400).send(err)
            return res.status(200).json({ success: true, videoDetail })
        })
    

});


router.post('/thumbnail', (req, res) => {

    //썸네일 생성하고 비디오 러닝타임도 가져오기

    let filePath = ""
    let fileDuration = ""

    //비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function (err, metadata) { //uploads 폴더에서 비디오 가져옴
        console.dir(metadata); //all meatadata
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration //비디오 러닝타임
    });

    //썸네일 생성
    ffmpeg(req.body.url) //클라이언트에서 온 비디오 저장 경로 (uploads/)
    .on('filenames', function (filenames) { //비디오 썸네일 파일 이름 생성
        console.log('Will generate ' + filenames.join(', '))
        console.log(filenames)

        filePath = "uploads/thumbnails/" + filenames[0]
    })
    .on('end', function () { //썸네일 생성 후의 행동
        console.log('Screenshots taken');
        return res.json({ success: true, url: filePath, fileDuration: fileDuration});
    }) //fileDuration는 러닝타임
    .on('error', function (err) { //에러 대처 방법
        console.error(err);
        return res.json({ success: false, err});
    })
    .screenshots({ //스크린샷 옵션
        //will take screenshots at 20%, 40%, 60%, and 80% or the video
        count: 3, //세 개의 썸네일을 찍을 수 있음
        folder: 'uploads/thumbnails', //썸네일 저장 폴더
        size: '320x240', //썸네일 사이즈
        //'%b': 원래 파일 이름 (filename w/o extension, 익스텐션은 빼고)
        filename: 'thumbnail-%b.png' 
    })


});

module.exports = router;