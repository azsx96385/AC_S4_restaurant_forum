'use strict';
module.exports = (sequelize, DataTypes) => {
  const Restaurant = sequelize.define('Restaurant', {
    name: DataTypes.STRING,
    tel: DataTypes.STRING,
    address: DataTypes.STRING,
    opening_hours: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    CategroyId: DataTypes.INTERGER,
  }, {});
  Restaurant.associate = function (models) {
    Restaurant.belongsTo(models.Categroy)
  };
  return Restaurant;
};