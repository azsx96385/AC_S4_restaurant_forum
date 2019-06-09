const express = require('express')
const handlebars = require('express-handlebars')
const bdParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const methodOverride = require('method-override')
const app = express()
const db = require('./models')
const dotenv = require('dotenv')
const port = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

//設定伺服器
app.listen(port, () => {
  db.sequelize.sync()
  console.log(`Example app listening on port ${port}!`)
})
//session 設定
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())

//bodyparser
app.use(bdParser.urlencoded({ extended: true }));

//設定樣版引擎
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//passport 設定
app.use(passport.initialize())
app.use(passport.session())
//over write 
app.use(methodOverride('_method'))
//靜態檔案設定
app.use('/upload', express.static(__dirname + '/upload'))

//路由區
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next();
})
require('./routes/index')(app, passport)
