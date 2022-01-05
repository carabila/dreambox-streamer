const express = require('express');
var router = express.Router();
const dreambox = require('../dreambox-ctrl');
const config = require('../config');

router.get('/', function(req, res, next){
    let response = res;

    dreambox.init(config.host).then((ret) => {
        dreambox.getBouquets().then((ret) => {
            console.log(ret);
            dreambox.getEpgNow(ret.e2service.e2servicereference).then((ret) => {
                console.log(ret);
                response.render('channels', {title:"dreambox-streamer", services:ret.e2event, config:config});
            });
        })
    }).catch(function(reason) {
        response.send(reason);
    });
})

module.exports = router;