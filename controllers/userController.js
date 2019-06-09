//使用者controller | 負責處理user 註冊登入處理
const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    let { name, email, password, passwordCheck } = req.body;
    //確認密碼ㄧ致
    if (password !== passwordCheck) {
      req.flash('error_messages', '錯誤｜密碼不一致')

      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: email } }).then(userdata => {
        if (userdata) {
          req.flash('error_messages', '錯誤｜使用者已經註冊')
          res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            return res.redirect('/signin')
          })
        }
      })
    }





  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功訊息｜成功登入')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '成功訊息｜成功登出')
    req.logout()
    res.redirect('/signin')
  },


}

module.exports = userController
