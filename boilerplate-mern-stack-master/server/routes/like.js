const express = require('express');
const router = express.Router();

const { Like } = require("../models/Like");
const { Dislike } = require("../models/Dislike");

//=================================
//             Like
//=================================

router.post("/getLikes", (req, res) => {

    let variable = {}

    if(req.body.videoId) {
        variable = { videoId: req.body.videoId }
    } else {
        variable = { commentId: req.body.commentId }
    }

    Like.find(variable)
        .exec((err, likes) => {
            if(err) return res.status(400).send(err)
            res.status(200).json({ success: true, likes })
        })

});

router.post("/getDislikes", (req, res) => {

    let variable = {}

    if(req.body.videoId) {
        variable = { videoId: req.body.videoId }
    } else {
        variable = { commentId: req.body.commentId }
    }

    Dislike.find(variable)
        .exec((err, dislikes) => {
            if(err) return res.status(400).send(err)
            res.status(200).json({ success: true, dislikes })
        })

});

router.post("/upLike", (req, res) => {

    let variable = {}

    if(req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variable = { commentId: req.body.commentId, userId: req.body.userId }
    }

    //Like collection에다가 클릭 정보 넣기
    const like = new Like(variable)

    like.save((err, likeResult) => {
        if(err) return resjson({ success: false, err })

        //Dislike가 이미 클릭되었을 때, Dislike 1 줄이기
        Dislike.findOneAndDelete(variable)
            .exec((err, disLikeResult) => {
                if(err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true })
            })

    })

});

router.post("/unLike", (req, res) => {

    let variable = {}

    if(req.body.videoId) { //비디오 혹은 코멘트 아이디와 유저 아이디가 매칭되어야 함
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variable = { commentId: req.body.commentId, userId: req.body.userId }
    }

    Like.findOneAndDelete(variable)
        .exec((err, result) => {
            if(err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true })
        })

});

router.post("/unDislike", (req, res) => {

    let variable = {}

    if(req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variable = { commentId: req.body.commentId, userId: req.body.userId }
    }

    Dislike.findOneAndDelete(variable)
        .exec((err, result) => {
            if(err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true })
        })

});

router.post("/upDislike", (req, res) => {

    let variable = {}

    if(req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variable = { commentId: req.body.commentId, userId: req.body.userId }
    }

    //Dislike collection에다가 클릭 정보 넣기
    const dislike = new Dislike(variable)

    dislike.save((err, likeResult) => {
        if(err) return resjson({ success: false, err })

        //Like가 이미 클릭되었을 때, Like 1 줄이기
        Like.findOneAndDelete(variable)
            .exec((err, likeResult) => {
                if(err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true })
            })

    })

});

module.exports = router;