const fs = require('fs');
const path = require('path');

module.exports = {
	proc: null,
	dirname: null,
	ffmpegCleanup: function () {
		if(this.proc){
			this.proc.kill();
			this.proc = null;
			console.log('closing ffmpeg process');

			fs.readdirSync(this.dirname).forEach(fileName => {
				let fullName = path.join(this.dirname, fileName);
				try{
					fs.unlinkSync(fullName);
				}
				catch(e) {
					console.log('cannot delete '+fullName);
				}
			});
		}
	}
}