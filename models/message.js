module.exports = function(sequelize, DataTypes) {
  var Message = sequelize.define("Message", {
    chat_messages: {
      type: DataTypes.STRING
    }
  });
  // Match.associate=function(models){
  //   Match.belongsTo(models.User);
  // };
  return Message;

};