FROM node:13-alpine3.10 AS build_img
RUN mkdir -p /app/node/fb-api  
RUN addgroup -S appgroup && adduser --disabled-password -S -G appgroup appuser
RUN npm install -g pm2 rimraf
RUN chmod -R a=rwx /app/node/fb-api
COPY package.json /app/node/fb-api
WORKDIR /app/node/fb-api

COPY . ./
RUN mkdir ./logs/

RUN mkdir -p /app/node/fb-api/ecosystem-pm2/
RUN cp ecosystem.config.js /app/node/fb-api/ecosystem-pm2/ecosystem.config.js
RUN chown -R appuser:appgroup ./
USER appuser
RUN npm cache clean -f && npm install
RUN npm run build:webpack:dev
RUN ls -lt

FROM build_img as NODE_APP
WORKDIR /app/node/fb-api
RUN cat /app/node/fb-api/ecosystem-pm2/ecosystem.config.js
RUN whoami
USER appuser
EXPOSE 3002
CMD ["pm2-runtime","--json", "ecosystem.config.js"]
# Include nginx conf to run your instances - but the best practise is to make use of kubernetes ingress


