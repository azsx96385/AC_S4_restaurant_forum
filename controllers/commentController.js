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
  },
  deleteComment: (req, res) => {
    let commentId = req.params.id;
    Comment.findByPk(commentId).then(comment => {
      comment.destroy().then(data => {
        req.flash("success_Messages", "評論已刪除");
        res.redirect(`/restaurants/${comment.RestaurantId}`);
      });
    });
  }
};

module.exports = commentController;
