## dreambox-streamer

Docker container to stream tv channels in HLS.

```sh
docker run \
  --name dreambox-streamer \
  -e DM_HOST='10.0.10.33' \
  -e DM_AUDIO_BITRATE=256 \
  -e DM_STREAM_TIMEOUT=3600 \
  -p 80:8080 \
  carabila/dreambox-streamer:latest
```
DM_STREAM_TIMEOUT: kill ffmepeg streaming process if no client connected, after timeout in seconds.