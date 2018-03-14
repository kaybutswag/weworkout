module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        len: [1]
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8]
      }
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        min: -90,
        max: 90
      }
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        min: -180,
        max: 180
      }
    }
  });
  User.associate=function(models){
    User.hasOne(models.Match);
    User.hasOne(models.Form);
  };
  return User;
};