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
      console.log(results); //result 是 該類別該頁的餐廳資料
      const data = results.rows.map(data => ({
        ...data.dataValues, //展開運算子
        //編輯原本-description資料
        description: data.dataValues.description.substring(0, 50),
        //新加入一屬性
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(
          data.id
        ),
        //加入 like 屬性
        markedLike: req.user.LikedRestaurants.map(d => d.id).includes(data.id)
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
      include: [
        Category,
        { model: Comment, include: [User] },
        { model: User, as: "FavoritedUsers" },
        { model: User, as: "LikedUsers" }
      ]
    }).then(restaurant => {
      //瀏覽次數邏輯-將點閱數+1後再送出
      restaurant.viewCounts += 1;
      //取出目前使用者的最愛清單

      restaurant.save({ fields: ["viewCounts"] }).then(restaurant => {
        let isFavorited = req.user.FavoritedRestaurants.map(d => d.id).includes(
          restaurant.id
        );
        let markedLike = req.user.LikedRestaurants.map(d => d.id).includes(
          restaurant.id
        );
        return res.render("restaurant", {
          restaurant,
          isFavorited,
          markedLike
        });
      });
    });
  },
  getFeeds: (req, res) => {
    //目標: 取回跟ccategory 關聯的 res 資料
    //目標: 取回跟res ， user 關聯的 comment 資料
    return Restaurant.findAll({
      limit: 10,
      order: [["createdAt", "DESC"]],
      include: [Category]
    }).then(restaurants => {
      //取到最新新增的res 資料
      Comment.findAll({
        limit: 10,
        include: [Restaurant, User],
        order: [["createdAt", "DESC"]]
      }).then(comments => {
        return res.render("feeds", { restaurants, comments });
      });
    });
  },
  getDashboard: (req, res) => {
    //目標: 調出單一餐廳的所有評論| 餐廳對評論-1對多
    return Restaurant.findByPk(req.params.id, {
      include: [Comment, Category]
    }).then(restaurant => {
      restaurant.save({ fields: ["viewCounts"] }).then(restaurant => {
        res.render("dashboard", { restaurant });
      });
    });
  },
  getTopRestaurant: (req, res) => {
    res.render('topRestaurant')
  }
};

module.exports = restController;
