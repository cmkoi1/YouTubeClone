const express = require('express');
const router = express.Router();

const { Subscriber } = require("../models/Subscriber");

//=================================
//             Subscribe
//=================================


router.post('/subscribeNumber', (req, res) => {

    Subscriber.find({ 'userTo': req.body.userTo })
    .exec((err, subscribe) => { //userTo를 구독하는 모든 case가 들어있음. 3명이 구독하면 3개의 case
        if(err) return res.status(400).send(err);
        return res.status(200).json({ success: true, subscribeNumber: subscribe.length })
    })

});


router.post('/subscribed', (req, res) => {

    Subscriber.find({'userTo': req.body.userTo, 'userFrom': req.body.userFrom })
    .exec((err, subscribe) => { //length가 1이면 구독을 하고 있다는 것. 0이면 구독 x
        if(err) return res.status(400).send(err);
        let result = false //구독 x
        if(subscribe.length !== 0) { //length가 0이 아니라면
            result = true //구독 중
        }
        res.status(200).json({ success: true, subscribed: result })
    })

});


router.post('/unSubscribe', (req, res) => {
    //구독 취소이므로 userTo와 userFrom을 찾아 없애줌
    Subscriber.findOneAndDelete({ userTo: req.body.userTo, userFrom: req.body.userFrom })
        .exec((err, doc) => {
            if(err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true, doc })
        })

});


router.post('/subscribe', (req, res) => {
    //구독이므로 DB에 userTo와 userFrom을 저장
    const subscribe = new Subscriber(req.body)

    subscribe.save((err, doc) => {
        if(err) return res.json({ success: false, err })
        res.status(200).json({ success: true })
    })

});


module.exports = router;