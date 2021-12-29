const express = require('express');
var router = express.Router();
const dreambox = require('../dreambox-ctrl');
const config = require('../config');
const ffmpegUtils = require('../ffmpeg-utils.js')

router.get('/', function(req, res, next){
    let response = res;
    ffmpegUtils.ffmpegCleanup();

    dreambox.init(config.host).then((ret) => {
        dreambox.getMovies().then((ret) => {
            console.log(ret);
            response.render('records', {title:"dreambox-streamer", services:ret.e2movie, config:config});
       })
    }).catch(function(reason) {
        response.send(reason);
    });;
})

module.exports = router;