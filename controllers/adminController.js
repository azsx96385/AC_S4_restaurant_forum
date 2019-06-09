//admincontroller | 負責處理後台管理者的邏輯
const fs = require('fs')
const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll().then(restaurants => {
      return res.render('admin/restaurants', { restaurants })
    })
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },
  postRestaura: (req, res) => {
    //驗證資料漏填
    let { name, tel, address, opening_hours, description } = req.body
    if (!name && !tel && !address && !opening_hours && !description) {
      req.flash('error_messages', '錯誤訊息｜資料漏填')
      //return res.redirect('/admin/restaurants/create')
      return res.redirect('back')
    }
    //檢查有沒有上傳圖片
    let { file } = req
    if (file) {
      //讀出圖片檔 ｜因為upload.single('image') ｜中介層關係｜資料暫存在 /tem
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        if (err) console.log(err)
        return Restaurant.create({
          name, tel, address, opening_hours, description,
          image: file ? img.data.link : restaurant.image,
        }).then(restaurant => {
          req.flash('success_messages', '成功訊息｜成功新增一筆餐廳資料')
          return res.redirect('/admin/restaurants')
        })

      })
    } else {
      //生成資料物件，存入資料庫
      Restaurant.create({
        name, tel, address, opening_hours, description,
        image: null
      }).then(resData => {
        req.flash('success_messages', '成功訊息｜成功新增一筆餐廳資料')
        return res.redirect('/admin/restaurants')
      })
    }
  },
  getRestaurant: (req, res) => {
    //取得餐廳資料 id
    let resId = req.params.id
    //使用model 調用資料
    Restaurant.findByPk(resId).then(restaurant => {
      return res.render('admin/restaurant', { restaurant })
    })
  },
  editRestaurant: (req, res) => {
    //取得餐廳資料 id
    let resId = req.params.id
    //使用model 調用資料
    Restaurant.findByPk(resId).then(restaurant => {
      return res.render('admin/create', { restaurant })
    })

  },
  putRestaurant: (req, res) => {
    //驗證資料漏填
    let { name, tel, address, opening_hours, description } = req.body
    //調出資料，做更新
    let resId = req.params.id //取得餐廳資料 id
    if (!name && !tel && !address && !opening_hours && !description) {
      req.flash('error_messages', '錯誤訊息｜資料漏填')
      return res.redirect('back')
    }
    //驗證上傳資料 ｜ 有無包含圖片檔案
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        if (err) console.log(err)
        return Restaurant.findByPk(resId).then(restaurant => {
          restaurant.update({
            name, tel, address, opening_hours, description,
            image: file ? img.data.link : restaurant.image,
          }).then(restaurant => {
            req.flash('success_messages', '成功訊息｜餐廳資料已經成功更新')
            res.redirect('/admin/restaurants')
          })
        })

      })
    } else {
      return Restaurant.findByPk(resId).then((restaurant) => {
        restaurant.update({ name, tel, address, opening_hours, description, image: restaurant.image }).then(restaurant => {
          req.flash('success_messages', '成功訊息｜餐廳資料已經成功更新')
          res.redirect('/admin/restaurants')
        })

      })

    }




  },
  deleteRestaurant: (req, res) => {
    //調出資料，做刪除
    let resId = req.params.id //取得餐廳資料 id
    return Restaurant.findByPk(resId).then((restaurant) => {
      console.log(restaurant)
      restaurant.destroy().then(restaurant => {
        req.flash('success_messages', '成功訊息｜成功刪除一筆資料')
        res.redirect('/admin/restaurants')
      })
    })
  },
  editUser: (req, res) => {
    return User.findAll().then(users => {
      return res.render('admin/users', { users })
    })
  },
  putUser: (req, res) => {
    //取得id
    const userid = req.params.id
    //取得資料-更新儲存
    User.findByPk(userid).then(userdata => {
      let { name, email, password, isAdmin } = userdata
      if (isAdmin) {
        userdata.update({ name, email, password, isAdmin: false }).then(userdata => {
          req.flash('success_messages', `成功訊息｜已將${name}身份改為User`)
          return res.redirect('/admin/users')
        })
      } else {
        userdata.update({ name, email, password, isAdmin: true }).then(userdata => {
          req.flash('success_messages', `成功訊息｜已將${name}身份改為Admin `)
          return res.redirect('/admin/users')
        })

      }

    })

  }
  ,
  putIsAdmin: (req, res) => {
    //取得id
    const userid = req.params.id
    //取得資料-更新儲存
    User.findByPk(userid).then(userdata => {
      let { name, email, password, isAdmin } = userdata
      userdata.update({ name, email, password, isAdmin: true }).then(userdata => {
        req.flash('success_messages', `成功訊息｜已將${name}身份改為Admin`)
        return res.redirect('/admin/users')
      })
    })

  },
  putIsUser: (req, res) => {
    //取得id
    const userid = req.params.id
    //取得資料-更新儲存
    User.findByPk(userid).then(userdata => {
      let { name, email, password, isAdmin } = userdata
      userdata.update({ name, email, password, isAdmin: false }).then(userdata => {
        req.flash('success_messages', `成功訊息｜已將${name}身份改為User`)
        return res.redirect('/admin/users')
      })
    })

  }

}
module.exports = adminController