FROM node:13.13-alpine3.11 AS NODE_BUILD
RUN apk update && apk add --update git openssh
RUN npm i -g pm2

RUN mkdir -p /home/node/fb-api
# Create a seperate node user
RUN addgroup -S app && adduser --disabled-password -S -G app app
RUN chown -R app /home/node/fb-api
COPY package.json /home/node/fb-api/
WORKDIR /home/node/fb-api
RUN npm i
COPY . ./
RUN ls -lt
#Create a ditectory called logs for wiring log files
RUN mkdir ./logs
RUN chown -R app:app ./logs/
RUN chown -R app:app ./cert-keys/
RUN ls -lt ./cert-keys/
RUN  npm cache clean -f && npm i
USER app
RUN ls -lt
RUN npm run build:webpack:dev
RUN ls -lt
EXPOSE 3002
CMD ["pm2-runtime", "ecosystem.config.js"]
#CMD ["pm2", "ecosystem.config.js"]


