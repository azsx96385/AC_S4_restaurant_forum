//餐廳controller | 負責處理前台使用者的動作

const restController = {
  getRestaurants: (req, res) => {
    return res.render('restaurant')
  }
}
module.exports = restController