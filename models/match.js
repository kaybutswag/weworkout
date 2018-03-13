module.exports = function(sequelize, DataTypes) {
  var Match = sequelize.define("Match", {
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    myMatches:{
    	type: DataTypes.STRING
    }
  });

  return Match;

};