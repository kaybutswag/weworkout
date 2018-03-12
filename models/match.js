module.exports = function(sequelize, DataTypes) {
  var Match = sequelize.define("Match", {
    mainid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    myMatches:{
    	type:DataTypes.STRING
    }
  });
  return Match;
};