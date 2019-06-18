//引入 餐廳controller 藉此得到我們設定好的餐廳處理動作
let resController = require("../controllers/restController");
let adminController = require("../controllers/adminController");
let userController = require("../controllers/userController");
let commentController = require("../controllers/commentController");

//上傳圖片用
const multer = require("multer");
const upload = multer({ dest: "temp/" });

module.exports = (app, passport) => {
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
  app.get("/", authenticate, (req, res) => {
    res.redirect("restaurants");
  });
  // 使用者 到達 /restaurant , 呼叫controller 的 getRestaurants 處理後續動作
  app.get("/restaurants", authenticate, resController.getRestaurants);
  app.get("/restaurants/:id", authenticate, resController.getRestaurant);

  //[使用者評論]=====================================================
  app.post("/comments", authenticate, commentController.postComment);

  //[使用者註冊]-----------
  app.get("/signup", userController.signUpPage);
  app.post("/signup", userController.signUp);
  //[使用者登入]-----------
  app.get("/signin", userController.signInPage);
  app.post(
    "/signin",
    passport.authenticate("local", {
      failureRedirect: "/signin",
      failureFlash: true
    }),
    userController.signIn
  );
  //[使用者登出]-----------
  app.get("/logout", userController.logout);
  //======================================================================================
  //[餐廳的ＣＲＵＤ]-----------------------------------------
  //管理者檢視所有餐廳
  app.get("/admin", authenticatedAdmin, (req, res) => {
    res.redirect("/admin/restaurants");
  });
  app.get(
    "/admin/restaurants",
    authenticatedAdmin,
    adminController.getRestaurants
  );
  //管理者新增一筆餐廳資料
  app.get(
    "/admin/restaurants/create",
    authenticatedAdmin,
    adminController.createRestaurant
  );
  app.post(
    "/admin/restaurants",
    authenticatedAdmin,
    upload.single("image"),
    adminController.postRestaura
  );
  //管理者檢視單筆資料
  app.get(
    "/admin/restaurants/:id",
    authenticatedAdmin,
    adminController.getRestaurant
  );
  //管理者更新單筆資料
  app.get(
    "/admin/restaurants/:id/edit",
    authenticatedAdmin,
    adminController.editRestaurant
  );
  app.put(
    "/admin/restaurants/:id",
    authenticatedAdmin,
    upload.single("image"),
    adminController.putRestaurant
  );
  //管理者刪除單筆資料
  app.delete(
    "/admin/restaurants/:id",
    authenticatedAdmin,
    adminController.deleteRestaurant
  );
  //[使用者管理介面]-----------------------------------------
  app.get("/admin/users", authenticatedAdmin, adminController.editUser);
  app.put("/admin/users/:id", authenticatedAdmin, adminController.putUser);

  //======================================================================================
  //[Category的ＣＲＵＤ]-----------------------------------------
  //瀏覽所有分類
  app.get(
    "/admin/categories",
    authenticatedAdmin,
    adminController.getCategories
  );
  //新增一筆分類
  app.post(
    "/admin/categories",
    authenticatedAdmin,
    adminController.postCategory
  );
  //瀏覽編輯分類的表單
  app.get(
    "/admin/categories/:id",
    authenticatedAdmin,
    adminController.getCategories
  );
  //更新一筆分類
  app.put(
    "/admin/categories/:id",
    authenticatedAdmin,
    adminController.putCategory
  );
  //刪除一筆分類
  app.delete(
    "/admin/categories/:id",
    authenticatedAdmin,
    adminController.deleteCategory
  );
};
