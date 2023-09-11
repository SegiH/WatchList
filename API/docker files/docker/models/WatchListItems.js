const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('WatchListItems', {
    WatchListItemID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    WatchListItemName: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    WatchListTypeID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    IMDB_URL: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    IMDB_Poster: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    ItemNotes: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Archived: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'WatchListItems',
    //schema: 'dbo',
    timestamps: false
  });
};
