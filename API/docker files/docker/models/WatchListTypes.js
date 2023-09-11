const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('WatchListTypes', {
    WatchListTypeID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    WatchListTypeName: {
      type: DataTypes.STRING(80),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'WatchListTypes',
    //schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_WatchListTypes",
        unique: true,
        fields: [
          { name: "WatchListTypeID" },
        ]
      },
    ]
  });
};
