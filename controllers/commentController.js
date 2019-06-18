//評論 controller | 負責處理評論 CRUD

const db = require("../models");
const Comment = db.Comment;

const commentController = {
  postComment: (req, res) => {
    Comment.create({
      text: req.body.text,
      UserId: req.user.id,
      RestaurantId: req.body.restaurantId
    }).then(comment => {
      res.redirect(`/restaurants/${req.body.restaurantId}`);
    });
  }
};

module.exports = commentController;
