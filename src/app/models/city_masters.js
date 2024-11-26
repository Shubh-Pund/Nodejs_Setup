'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class city_masters extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.state_masters, {
        foreignKey: "state_id",
        as: "state_masters",
      });
      this.belongsTo(models.country_masters, {
        foreignKey: "country_id",
        as: "country_masters",
      });
    }
  }
  city_masters.init({
    country_id: DataTypes.INTEGER,
    state_id: DataTypes.INTEGER,
    city_name: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'city_masters',
  });
  return city_masters;
};