//const { channel } = require('diagnostics_channel');
const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const config = require('./config');
const channels = require('./routes/channels');
const records = require('./routes/records');
const ffmpegUtils = require('./ffmpeg-utils.js')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', channels);
app.use('/channels', channels);
app.use('/records', records);

app.use('/stream', express.static(path.join(__dirname, 'stream')));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/stream', function(req, res, next){
    let filepath = app.filepath;

    if (ffmpegUtils.proc != null) {
        ffmpegUtils.ffmpegCleanup();
    }

    new Promise((resolve,reject) => { 
        // make sure you set the correct path to your video file
        ffmpegUtils.proc = ffmpeg(req.query.play, { timeout: 432000 })
        //.size('720x?')
        .addOption(`-ss ${req.query.seek}`)
        .addOption('-map', '0:v:0')
        .addOption('-map', '0:a:1')
        // set video bitrate
        //.videoBitrate(1200)
        // set h264 preset
        .addOption('-preset','superfast')
        // set target codec
        .videoCodec('libx264')
        // set audio bitrate
        .audioBitrate(config.audioBitRate)
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
            console.log(err.message);
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
        console.log('streaming..');
        res.end();
    }).catch((reason) => {
        ffmpegUtils.ffmpegCleanup();
        console.log(reason);
        next(reason);
    });
});

io.on('connection', socket => {
    console.log('new client: ' + socket.id);
    socket.on('Hi', data => {
        if (ffmpegUtils.proc) {
            console.log('reset ffmpeg timeout');
            clearTimeout(app.timer);
            app.timer = setTimeout(ffmpegUtils.ffmpegCleanup, config.streamTimeout*1000);
        }
    });
    socket.on('disconnect', () => {
        console.log(socket.id + ' disconnected');
    });
});

server.listen(3000, () => {
    console.log('express listening on 3000');

    ffmpegUtils.proc = null;
    app.filepath = path.join(__dirname + '/stream/stream.m3u8');
    app.timer = null;

    let dirname = path.dirname(app.filepath);
    fs.readdirSync(dirname).forEach(fileName => {
        fs.unlinkSync(path.join(dirname, fileName));
    });
});
