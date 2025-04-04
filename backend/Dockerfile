FROM node:14-alpine
WORKDIR /app
COPY package.json ./
RUN yarn install --frozen-lockfile
COPY . ./
RUN yarn build
EXPOSE 3000
CMD ["dist/app.js"]