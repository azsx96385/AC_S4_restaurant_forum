//餐廳controller | 負責處理前台使用者的動作
const db = require("../models");
const Restaurant = db.Restaurant;
const Category = db.Category;
const Comment = db.Comment;
const User = db.User;

const restController = {
  getRestaurants: (req, res) => {
    //分頁頁碼設定
    let offset = 0;
    let pageLimit = 10;
    //取得querystring
    let categoryId = "";
    let whereQuery = {};
    //設定頁碼
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit;
    }
    //設定ORM where條件
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId);
      whereQuery["CategoryId"] = categoryId;
    }
    //----------------------------------------------
    Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset: offset,
      limit: pageLimit
    }).then(results => {
      //每次根據偏移量，取出資料
      let page = Number(req.query.page) || 1; //將page querystring 數字化 | 沒有資料預設1
      let pages = Math.ceil(results.count / pageLimit); //總資料除以單頁資料量 -> 取得頁碼

      let totalPage = Array.from({ length: pages }).map(
        (item, index) => index + 1
      );

      let prev = page - 1 < 1 ? page : page - 1; //上頁頁碼| 公式本頁-1 如果小於1 則預設1
      let next = page + 1 > pages ? pages : page + 1; // 下頁頁碼| 公式 本頁+1 如果大於總頁數 則預設最後一頁
      console.log(results);
      const data = results.rows.map(data => ({
        ...data.dataValues, //展開運算子
        description: data.dataValues.description.substring(0, 50)
      }));
      //生成類別nav
      Category.findAll().then(categories => {
        return res.render("restaurants", {
          restaurants: data,
          categories,
          categoryId,
          page,
          totalPage,
          prev,
          next
        });
      });
    });
  },
  getRestaurant: (req, res) => {
    let id = req.params.id;

    Restaurant.findByPk(id, {
      include: [Category, { model: Comment, include: [User] }]
    }).then(restaurant => {
      return res.render("restaurant", { restaurant });
    });
  }
};

module.exports = restController;
