//分流器|router
let express = require("express");
let router = express.Router();

//引入 餐廳controller 藉此得到我們設定好的餐廳處理動作
let resController = require("../controllers/restController");
let adminController = require("../controllers/adminController");
let userController = require("../controllers/userController");
let commentController = require("../controllers/commentController");
let passport = require("../config/passport");

//上傳圖片用
const multer = require("multer");
const upload = multer({ dest: "temp/" });

//[驗證中介層]-------------------

const authenticate = (req, res, next) => {
  //驗證是否有 passport isAuthenticated
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/signin");
};
const authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      return next();
    }
    return res.redirect("/");
  }
  res.redirect("/signin");
};
//----------------------------
//使用者訪問首頁-重新導向 /restaurant
router.get("/", authenticate, (req, res) => {
  res.redirect("restaurants");
});
// 使用者 到達 /restaurant , 呼叫controller 的 getRestaurants 處理後續動作
router.get("/restaurants", authenticate, resController.getRestaurants);
router.get("/restaurants/top", authenticate, resController.getTopRestaurant);
router.get("/restaurants/feeds", authenticate, resController.getFeeds);
router.get("/restaurants/:id", authenticate, resController.getRestaurant);
router.get(
  "/restaurants/:id/dashboard",
  authenticate,
  resController.getDashboard
);
//[使用者|追蹤功能]=====================================================
router.post("/following/:userId", authenticate, userController.addFollowing);
router.delete(
  "/following/:userId",
  authenticate,
  userController.removeFollowing
);
//[使用者|加入移除最愛]=====================================================

router.post(
  "/favorite/:restaurantId",
  authenticate,
  userController.addFavorite
);
router.delete(
  "/favorite/:restaurantId",
  authenticate,
  userController.removeFavorite
);
//[使用者|標記喜愛]=====================================================
router.post("/like/:restaurantId", authenticate, userController.markLike);
router.delete("/like/:restaurantId", authenticate, userController.markUnlike);

//[使用者評論]=====================================================
router.post("/comments", authenticate, commentController.postComment);
router.delete(
  "/comments/:id",
  authenticatedAdmin,
  commentController.deleteComment
);

//[使用者註冊]-----------
router.get("/signup", userController.signUpPage);
router.post("/signup", userController.signUp);
//[使用者登入]-----------
router.get("/signin", userController.signInPage);
router.post(
  "/signin",
  passport.authenticate("local", {
    failureRedirect: "/signin",
    failureFlash: true
  }),
  userController.signIn
);
//[使用者登出]-----------
router.get("/logout", userController.logout);
//======================================================================================
//[User profile]-----------------------------------------
router.get("/users/top", authenticate, userController.getTopUser);
router.get("/users/:id", authenticate, userController.getUser);
router.get("/users/:id/edit", authenticate, userController.editUser);
router.put(
  "/users/:id",
  authenticate,
  upload.single("image"),
  userController.putUser
);

//======================================================================================
//[餐廳的ＣＲＵＤ]-----------------------------------------
//管理者檢視所有餐廳
router.get("/admin", authenticatedAdmin, (req, res) => {
  res.redirect("/admin/restaurants");
});
router.get(
  "/admin/restaurants",
  authenticatedAdmin,
  adminController.getRestaurants
);
//管理者新增一筆餐廳資料
router.get(
  "/admin/restaurants/create",
  authenticatedAdmin,
  adminController.createRestaurant
);
router.post(
  "/admin/restaurants",
  authenticatedAdmin,
  upload.single("image"),
  adminController.postRestaura
);
//管理者檢視單筆資料
router.get(
  "/admin/restaurants/:id",
  authenticatedAdmin,
  adminController.getRestaurant
);
//管理者更新單筆資料
router.get(
  "/admin/restaurants/:id/edit",
  authenticatedAdmin,
  adminController.editRestaurant
);
router.put(
  "/admin/restaurants/:id",
  authenticatedAdmin,
  upload.single("image"),
  adminController.putRestaurant
);
//管理者刪除單筆資料
router.delete(
  "/admin/restaurants/:id",
  authenticatedAdmin,
  adminController.deleteRestaurant
);
//[使用者管理介面]-----------------------------------------
router.get("/admin/users", authenticatedAdmin, adminController.getUsers);
router.put("/admin/users/:id", authenticatedAdmin, adminController.putUsers);

//======================================================================================
//[Category的ＣＲＵＤ]-----------------------------------------
//瀏覽所有分類
router.get(
  "/admin/categories",
  authenticatedAdmin,
  adminController.getCategories
);
//新增一筆分類
router.post(
  "/admin/categories",
  authenticatedAdmin,
  adminController.postCategory
);
//瀏覽編輯分類的表單
router.get(
  "/admin/categories/:id",
  authenticatedAdmin,
  adminController.getCategories
);
//更新一筆分類
router.put(
  "/admin/categories/:id",
  authenticatedAdmin,
  adminController.putCategory
);
//刪除一筆分類
router.delete(
  "/admin/categories/:id",
  authenticatedAdmin,
  adminController.deleteCategory
);
module.exports = router;
