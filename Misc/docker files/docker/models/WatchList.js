const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  function getDateValues(dateStr) {
    return dateStr;
  }

  return sequelize.define('WatchList', {
    WatchListID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    WatchListItemID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    StartDate: {
      type: 'DATETIME',
      allowNull: false
    },
    EndDate: {
      type: 'DATETIME',  
      allowNull: true
    },
    WatchListSourceID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Season: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Archived: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    Notes: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Rating: {
      type: DataTypes.DECIMAL(18,2),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'WatchList',
    //schema: 'dbo',
    //logging: console.log,
    timestamps: false,
    indexes: [
      {
        name: "PK_WatchList",
        unique: true,
        fields: [
          { name: "WatchListID" },
        ]
      },
    ]
  });
};
