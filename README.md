## myhome-mqtt-bridge

Docker image to stream tv channels in HLS.

```sh
docker run \
  --name dreambox-streamer \
  -e DM_HOST='10.0.10.33' \
  -e DM_AUDIO_BITRATE=256 \
  -p 80:8080 \
  carabila/dreambox-streamer:latest
```
