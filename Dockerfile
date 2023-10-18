FROM node:14.15.0

WORKDIR /var/www

ARG PORT
ENV PORT $PORT

COPY  package.json .

RUN npm install

COPY . .

EXPOSE ${PORT}

CMD ["npm", "start"]