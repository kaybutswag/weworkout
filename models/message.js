module.exports = function(sequelize, DataTypes) {
  var Message = sequelize.define("Message", {
    UserId: {
      type: DataTypes.INTEGER
    },
    FriendId:{
    	type: DataTypes.INTEGER
    },
    chat_messages: {
      type: DataTypes.STRING
    }
  });
  return Message;

};