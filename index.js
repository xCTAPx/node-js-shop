const express = require('express')
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const mongoose = require('mongoose')

const mainRoute = require('./routes/main')
const addRoute = require('./routes/add')
const goodsRoute = require('./routes/goods')
const cartRoute = require('./routes/cart')
const ordersRoute = require('./routes/orders')
const loginRoute = require('./routes/login')

const varMiddleware = require('./middlewares/variables')
const userMiddleware = require('./middlewares/user')

const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)


const DB_URL = 'mongodb+srv://vadim:R1hbF7N5pidzxsPD@cluster0.gth8d.mongodb.net/store?retryWrites=true&w=majority'

const PORT = process.env.PORT || 3000


const store = new MongoDBStore({
    uri: DB_URL,
    collection: 'sessions'
})

store.on('error', e => {
    console.log(e)
})

const app = express()

const hbs = exphbs.create({
    extname: 'hbs',
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

app.use(session({
    secret: 'default',
    saveUninitialized: true,
    resave: true,
    store
}))

app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', mainRoute)
app.use('/add', addRoute)
app.use('/goods', goodsRoute)
app.use('/cart', cartRoute)
app.use('/orders', ordersRoute)
app.use('/login', loginRoute)

app.use((req, res) => {
    res.status(404).send('Error 404')
})

const start = async () => {
    try {
        mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true})

        app.listen(PORT, () => {
            console.log(`Server has been started on port ${PORT}`)
        })
    } catch (e) {
        throw new Error(e)
    }
}

start()