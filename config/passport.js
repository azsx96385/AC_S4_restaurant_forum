const passport = require("passport");
const localStrategy = require("passport-local");
const bcrypt = require("bcrypt-nodejs");
const db = require("../models");
const User = db.User;

//設定 passport local strategy
passport.use(
  new localStrategy(
    {
      //客製化-userfiled
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true //為了在驗證處理可以使用 req 做 flash
    },
    (req, username, password, cb) => {
      //驗證處理｜資料庫有使用者 ｜ 使用者密碼正確
      User.findOne({ where: { email: username } }).then(user => {
        //資料庫查無使用者
        if (!user)
          return cb(
            null,
            false,
            req.flash("error_messages", "錯誤訊息｜此帳號尚未註冊")
          );
        //比對密碼是否相同
        if (!bcrypt.compareSync(password, user.password))
          return cb(
            null,
            false,
            req.flash("error_messages", "錯誤訊息｜密碼錯誤")
          );
        return cb(null, user);
      });
    }
  )
);

//序列化處理|
passport.serializeUser((user, cb) => {
  cb(null, user.id); //如果驗證通過，這裡只將user id 存到記憶體
});
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [
      { model: db.Restaurant, as: "FavoritedRestaurants" },
      { model: db.Restaurant, as: "LikedRestaurants" }
    ]
  }).then(user => {
    //如果要從記憶體，取出user data，使用id到資料庫調用資料
    return cb(null, user);
  });
});

module.exports = passport;
