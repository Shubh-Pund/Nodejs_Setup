'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class country_masters extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.state_masters, {
        foreignKey: "country_id",
        as: "state_masters",
      });
      this.hasMany(models.city_masters, {
        foreignKey: "country_id",
        as: "city_masters",
      });
    }
  }
  country_masters.init({
    country_name: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'country_masters',
  });
  return country_masters;
};