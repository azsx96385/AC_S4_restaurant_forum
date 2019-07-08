//分流器|router
let express = require("express");
let router = express.Router();

//引入 API版本 | 餐廳controller 藉此得到我們設定好的餐廳處理動作
let adminController = require("../controllers/api/apiadminController");
// let resController = require("../controllers/restController");
// let adminController = require("../controllers/adminController");
// let userController = require("../controllers/userController");
// let commentController = require("../controllers/commentController");
// let passport = require("../config/passport");

router.get("/admin/restaurants", adminController.getRestaurants);
module.exports = router;
