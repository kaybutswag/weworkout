module.exports = function(sequelize, DataTypes) {
  var Match = sequelize.define("Match", {
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    myMatches:{
    	type: DataTypes.TEXT("long")
    },
    myLikes:{
      type: DataTypes.TEXT("long")
    },
    myChats:{
      type: DataTypes.TEXT("long")
    }
  });
  Match.associate=function(models){
    Match.belongsTo(models.User);
  };
  return Match;

};