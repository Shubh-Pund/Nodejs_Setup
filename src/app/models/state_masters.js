'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class state_masters extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.city_masters, {
        foreignKey: "state_id",
        as: "city_masters",
      });
      this.belongsTo(models.country_masters, {
        foreignKey: "country_id",
        as: "country_masters",
      });
    }
  }
  state_masters.init({
    country_id: DataTypes.INTEGER,
    state_name: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'state_masters',
  });
  return state_masters;
};