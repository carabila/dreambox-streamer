FROM node:lts-alpine
ENV NODE_ENV=production
ENV DM_HOST '10.0.10.33'
ENV DM_AUDIO_BITRATE 256
ENV DM_STREAM_TIMEOUT 20
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
RUN apk add  --no-cache ffmpeg
COPY . .
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
