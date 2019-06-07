const express = require('express')
const handlebars = require('express-handlebars')
const app = express();
const port = 3001

//設定伺服器
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})

//設定樣版引擎
app.engine('handlebars', handlebars())
app.set('view engine', 'handlebars')
