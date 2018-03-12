module.exports = function(sequelize, DataTypes) {
  var Form = sequelize.define("Form", {
    mainid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    },
    gender: {
      type: DataTypes.STRING
    },
    age: {
      type: DataTypes.INTEGER
    },
    img: {
      type: DataTypes.BLOB
    },
    primaryLocation: {
      type: DataTypes.STRING
    },
    weightlift: {
      type: DataTypes.BOOLEAN
    },
    run: {
      type: DataTypes.BOOLEAN
    },
    walk: {
      type: DataTypes.BOOLEAN
    },
    swim: {
      type: DataTypes.BOOLEAN
    },
    surf: {
      type: DataTypes.BOOLEAN
    },
    bike: {
      type: DataTypes.BOOLEAN
    },
    yoga: {
      type: DataTypes.BOOLEAN
    },
    pilates: {
      type: DataTypes.BOOLEAN
    },
    cardio: {
      type: DataTypes.BOOLEAN
    },
    dance: {
      type: DataTypes.BOOLEAN
    },
    rock: {
      type: DataTypes.BOOLEAN
    },
    gymnastics: {
      type: DataTypes.BOOLEAN
    },
    bowl: {
      type: DataTypes.BOOLEAN
    },
    rowing: {
      type: DataTypes.BOOLEAN
    },
    tennis: {
      type: DataTypes.BOOLEAN
    },
    baseball: {
      type: DataTypes.BOOLEAN
    },
    basketball: {
      type: DataTypes.BOOLEAN
    },
    football: {
      type: DataTypes.BOOLEAN
    },
    soccer: {
      type: DataTypes.BOOLEAN
    },
    rugby: {
      type: DataTypes.BOOLEAN
    },
    volleyball: {
      type: DataTypes.BOOLEAN
    },
    golf: {
      type: DataTypes.BOOLEAN
    },
    hockey: {
      type: DataTypes.BOOLEAN
    },
    ice: {
      type: DataTypes.BOOLEAN
    },
    skateboard: {
      type: DataTypes.BOOLEAN
    },
    maxpress: {
      type: DataTypes.INTEGER
    },
    maxsquat: {
      type: DataTypes.INTEGER
    },
    miles: {
      type: DataTypes.INTEGER
    },
    bio: {
      type: DataTypes.STRING
    }
  });
  return Form;
};
