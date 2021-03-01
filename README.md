# node-js-shop
Simple shop written with nodeJS. It's my first project on NodeJS.

Simple shop website where user can register, login and interract with goods. User has opportunity add new products, edit his own products and add to cart all availavle goods and then make order. User can check information about his orders, check his orders history. Also user can edit his profile (avatar can doesn't save because Heroku has some problem with static files on trial version which I use for deploying this app).

App is written on NodeJS & Handlebars. Database - MongoDB (Atlas). Also some other libraries are used here, for example: 'helmet' for adding some headers, 'csrf' for adding csrf tokens and more security when user sends post requests, 'compression' for decrease response sizes and etc.

App is deployed here: https://nodejs-market.herokuapp.com
