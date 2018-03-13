module.exports = function(sequelize, DataTypes) {
  var Match = sequelize.define("Match", {
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    myMatches:{
    	type: DataTypes.STRING
    },
    myLikes:{
      type: DataTypes.STRING
    }
  });
  Match.associate=function(models){
    Match.belongsTo(models.User);
  };
  return Match;

};