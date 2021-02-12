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
const profileRoute = require('./routes/profile')

const varMiddleware = require('./middlewares/variables')
const userMiddleware = require('./middlewares/user')

const keys = require('./keys')

const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csurf = require('csurf')
const flash = require('connect-flash')

const PORT = process.env.PORT || 3000

const store = new MongoDBStore({
    uri: keys.DB_URL,
    collection: 'sessions'
})

store.on('error', e => {
    console.log(e)
})

const app = express()

const hbs = exphbs.create({
    extname: 'hbs',
    defaultLayout: 'main',
    helpers: require('./utils/hbs-helpres.js'),
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

app.use(session({
    secret: keys.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    store
}))

app.use(csurf())
app.use(varMiddleware)
app.use(userMiddleware)
app.use(flash())

app.use('/', mainRoute)
app.use('/add', addRoute)
app.use('/goods', goodsRoute)
app.use('/cart', cartRoute)
app.use('/orders', ordersRoute)
app.use('/login', loginRoute)
app.use('/profile', profileRoute)

app.use((req, res) => {
    res.status(404).send('Error 404')
})

const start = async () => {
    try {
        mongoose.connect(keys.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})

        app.listen(PORT, () => {
            console.log(`Server has been started on port ${PORT}`)
        })
    } catch (e) {
        throw new Error(e)
    }
}

start()