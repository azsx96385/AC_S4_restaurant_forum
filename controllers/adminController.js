//admincontroller | 負責處理後台管理者的邏輯
const fs = require('fs')
const db = require('../models')
const Restaurant = db.Restaurant

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
      fs.readFile(file.path, (err, data) => {
        if (err) console.log(err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Restaurant.create({
            name, tel, address, opening_hours, description,
            image: file ? `/upload/${file.originalname}` : null
          }).then(restaurant => {
            req.flash('success_messages', '成功訊息｜成功新增一筆餐廳資料')
            return res.redirect('/admin/restaurants')
          })
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
      fs.readFile(file.path, (err, data) => {
        if (err) console.log(err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Restaurant.findByPk(resId).then(restaurant => {
            restaurant.update({
              name, tel, address, opening_hours, description,
              image: file ? `/upload/${file.originalname}` : null
            }).then(restaurant => {
              req.flash('success_messages', '成功訊息｜餐廳資料已經成功更新')
              res.redirect('/admin/restaurants')
            })
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
  }

}
module.exports = adminController