//餐廳controller | 負責處理前台使用者的動作
const db = require("../models");
const Restaurant = db.Restaurant;
const Category = db.Category;

const restController = {
  getRestaurants: (req, res) => {
    //取得querystring
    let categoryId = "";
    let whereQuery = {};
    //設定ORM where條件
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId);
      whereQuery["CategoryId"] = categoryId;
    }

    Restaurant.findAll({ include: Category, where: whereQuery }).then(
      restaurants => {
        const data = restaurants.map(data => ({
          ...data.dataValues, //展開運算子
          description: data.dataValues.description.substring(0, 50)
        }));
        //生成類別nav
        Category.findAll().then(categories => {
          return res.render("restaurants", {
            restaurants: data,
            categories,
            categoryId
          });
        });
      }
    );
  },
  getRestaurant: (req, res) => {
    let id = req.params.id;
    Restaurant.findByPk(id, { include: Category }).then(restaurant => {
      return res.render("restaurant", { restaurant });
    });
  }
};

module.exports = restController;
