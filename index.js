const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const dreambox = require('./dreambox-ctrl');

const app = express();

const host = process.env.DM_HOST;
const audioBitRate = process.env.DM_AUDIO_BITRATE;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.ffmpegCleanup = function () {
    console.log('closing ffmpeg process');
    app.proc.kill();
    app.proc = null;
    //var dirname = path.dirname(app.filepath);
    //fs.readdirSync(dirname).forEach(fileName => {
    //    fs.unlinkSync(dirname +'/'+ fileName);
    //});
};


app.use('/stream', express.static(path.join(__dirname, 'stream')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next){

    let response = res;
    dreambox.init(host).then((ret) => {
        dreambox.getBouquets().then((ret) => {
            console.log(ret);
            dreambox.getServices(ret.e2service.e2servicereference).then((ret) => {
                console.log(ret);
                response.render('index', {title: "dreambox-streamer", services: ret.e2service});
            });
        })
    }).catch(function(reason) {
        response.send(reason);
    });;

    //res.render('index', {title: "dreambox-streamer"});

    //const fileDirectory = path.resolve(__dirname, '.', 'public');
    //res.sendFile('index.html', {root: fileDirectory}, (err) => {
    //    res.end();
    //})
})

app.get('/stream', function(req, res, next){
//app.use(function(req, res, next){


    let filepath = app.filepath;

    if (app.proc != null) {
        app.ffmpegCleanup();
    }

    new Promise((resolve,reject) => { 
        // make sure you set the correct path to your video file
        app.proc = ffmpeg('http://'+host+':8001/'+req.query.e2servicereference, { timeout: 432000 })
        //.size('720x?')
        .addOption('-map', '0:0')
        .addOption('-map', '0:1')
        // set video bitrate
        //.videoBitrate(1200)
        // set h264 preset
        .addOption('-preset','superfast')
        // set target codec
        .videoCodec('libx264')
        // set audio bitrate
        .audioBitrate(audioBitRate)
        // set audio codec
        .audioCodec('aac')
        .addOption('-f', 'hls')
        .addOption('-hls_allow_cache', 0)
        // set hls segments time
        .addOption('-hls_time', 2)
        // include all the segments in the list
        .addOption('-hls_list_size', 5)
        .addOption('-hls_flags', '+delete_segments+split_by_time')
        //.addOption('-pix_fmt', 'yuv420p')

        // setup event handlers
        .on('start', function(commandLine) {
            console.log('Spawned Ffmpeg with command: ' + commandLine);
        })
        .on('error', function(err) {
            console.log('an error happened: ' + err.message);
            reject(err);
        })
        // save to file
        .save(filepath);

        var watcher = fs.watch(path.dirname(filepath),function (event, who){
            if (event === 'rename' && who === path.basename(filepath)) {
                if (fs.existsSync(filepath)) {
                    console.log('stream created');
                    watcher.close()
                    resolve();
                }
            }
        });

    }).then((state) => {
        console.log('redirecting to stream');
        res.end();
        //res.redirect('/stream/stream.m3u8');
    }).catch((reason) => {
        console.log(reason);
    });

});

app.listen(8080, () => {
    console.log('listening on 8080');

    app.proc = null;
    app.filepath = path.join(__dirname + '/stream/stream.m3u8');
    app.timer = null;

    let dirname = path.dirname(app.filepath);
    fs.readdirSync(dirname).forEach(fileName => {
        fs.unlinkSync(path.join(dirname, fileName));
    });
    
}).on('connection', function(socket) {
    console.log('new client connection');
    if (app.timer) {
        clearTimeout(app.timer);
        app.timer = null;
    }
    if (app.proc)
        app.timer = setTimeout(app.ffmpegCleanup, 3600*1000);
});
