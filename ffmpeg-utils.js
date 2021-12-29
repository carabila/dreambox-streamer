module.exports = {
	proc: null,
	ffmpegCleanup: function () {
		console.log('closing ffmpeg process');
		if(this.proc){
			this.proc.kill();
			this.proc = null;
		}
	}
}