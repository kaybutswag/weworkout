module.exports = function(sequelize, DataTypes) {
  var Match = sequelize.define("Match", {
    alt_id: {
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