module.exports = {
	//const host = process.env.DM_HOST;
	//const audioBitRate = process.env.DM_AUDIO_BITRATE;
	//const streamTimeout = process.env.DM_STREAM_TIMEOUT;

	host: process.env.DM_HOST || '10.0.10.33',
	audioBitRate: process.env.DM_AUDIO_BITRATE || 56,
	streamTimeout: process.env.DM_STREAM_TIMEOUT || 20
};
