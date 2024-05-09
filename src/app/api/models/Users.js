module.exports = function (sequelize, DataTypes) {
     return sequelize.define('Users', {
          UserID: {
               type: DataTypes.INTEGER,
               allowNull: false,
               primaryKey: true,
               autoIncrement: true
          },
          Username: {
               type: DataTypes.STRING(200),
               allowNull: false
          },
          Realname: {
               type: DataTypes.STRING(200),
               allowNull: false
          },
          Password: {
               type: DataTypes.STRING(200),
               allowNull: false
          },
          Admin: {
               type: DataTypes.BOOLEAN,
               allowNull: false
          },
          Enabled: {
               type: DataTypes.BOOLEAN,
               allowNull: false
          }
     }, {
          sequelize,
          tableName: 'Users',
          timestamps: false
     });
};
