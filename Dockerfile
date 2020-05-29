FROM node:alpine

WORKDIR '/app'

ENV DM_HOST '10.0.10.33'
ENV DM_AUDIO_BITRATE 256

COPY package.json .
RUN npm install
RUN apk add  --no-cache ffmpeg

COPY . .

CMD ["npm", "run", "start"]