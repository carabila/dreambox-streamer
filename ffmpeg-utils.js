module.exports = {
	proc: null,
	ffmpegCleanup: function () {
		if(this.proc){
			this.proc.kill();
			this.proc = null;
			console.log('closing ffmpeg process');
		}
	}
}