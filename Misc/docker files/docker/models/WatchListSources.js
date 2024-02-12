const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('WatchListSources', {
    WatchListSourceID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    WatchListSourceName: {
      type: DataTypes.STRING(80),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'WatchListSources',
    //schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_WatchListSources",
        unique: true,
        fields: [
          { name: "WatchListSourceID" },
        ]
      },
    ]
  });
};
