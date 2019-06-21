//使用者controller | 負責處理user 註冊登入處理
const bcrypt = require("bcrypt-nodejs");
const db = require("../models");
const User = db.User;
const Comment = db.Comment;
const Restaurant = db.Restaurant;
const Favorite = db.Favorite;
const Like = db.Like;
const imgur = require("imgur-node-api");
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
const multer = require("multer");
const upload = multer({ dest: "temp/" });

const userController = {
  signUpPage: (req, res) => {
    return res.render("signup");
  },

  signUp: (req, res) => {
    let { name, email, password, passwordCheck } = req.body;
    //確認密碼ㄧ致
    if (password !== passwordCheck) {
      req.flash("error_messages", "錯誤｜密碼不一致");

      return res.redirect("/signup");
    } else {
      User.findOne({ where: { email: email } }).then(userdata => {
        if (userdata) {
          req.flash("error_messages", "錯誤｜使用者已經註冊");
          res.redirect("/signup");
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(
              req.body.password,
              bcrypt.genSaltSync(10),
              null
            )
          }).then(user => {
            return res.redirect("/signin");
          });
        }
      });
    }
  },
  signInPage: (req, res) => {
    return res.render("signin");
  },
  signIn: (req, res) => {
    req.flash("success_messages", "成功訊息｜成功登入");
    res.redirect("/restaurants");
  },
  logout: (req, res) => {
    req.flash("success_messages", "成功訊息｜成功登出");
    req.logout();
    res.redirect("/signin");
  },
  getUser: (req, res) => {
    let userId = req.params.id;
    User.findByPk(userId, { include: Comment }).then(user => {
      let resIdListAll = [];
      let restaurants = [];
      user.Comments.forEach(comment => {
        resIdListAll.push(comment.RestaurantId);
      });
      let resIdListNoreapt = resIdListAll.filter(function(element, index, arr) {
        return arr.indexOf(element) === index;
      });
      resIdListNoreapt.forEach(resId => {
        Restaurant.findByPk(resId).then(resdata => {
          console.log("-------------------", resdata);
          restaurants.push(resdata);
        });
      });

      res.render("userprofile", { user, restaurants });
    });
  },
  editUser: (req, res) => {
    let userId = req.params.id;
    User.findByPk(userId).then(user => {
      res.render("edituserprofile", { user });
    });
  },
  putUser: (req, res) => {
    let userId = req.params.id;
    const { file } = req;
    console.log("req.body.name", req);
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        if (err) console.log(err);
        return User.findByPk(userId).then(user => {
          user
            .update({
              name: req.body.name,
              image: file ? img.data.link : restaurant.image
            })
            .then(user => {
              req.flash("success_message", "成功訊息|用戶資料已更新");
              res.redirect(`/users/${userId}`);
            });
        });
      });
    } else {
      return User.findByPk(userId).then(user => {
        user.update({ name: req.body.name, image: user.image }).then(user => {
          req.flash("success_message", "成功訊息|用戶資料已更新");
          res.redirect(`/users/${userId}`);
        });
      });
    }
  },
  addFavorite: (req, res) => {
    let UserId = req.user.id;
    let RestaurantId = req.params.restaurantId;
    return Favorite.create({ UserId, RestaurantId }).then(data => {
      res.redirect("back");
    });
  },
  removeFavorite: (req, res) => {
    let UserId = req.user.id;
    let RestaurantId = req.params.restaurantId;
    return Favorite.findOne({ where: { UserId, RestaurantId } }).then(data => {
      data.destroy().then(data => {
        return res.redirect("back");
      });
    });
  },
  markLike: (req, res) => {
    let UserId = req.user.id;
    let RestaurantId = req.params.restaurantId;
    return Like.create({ UserId, RestaurantId }).then(data => {
      res.redirect("back");
    });
  },
  markUnlike: (req, res) => {
    let UserId = req.user.id;
    let RestaurantId = req.params.restaurantId;
    return Like.findOne({ where: { UserId, RestaurantId } }).then(data => {
      data.destroy().then(data => {
        return res.redirect("back");
      });
    });
  }
};

module.exports = userController;
