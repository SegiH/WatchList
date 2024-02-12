const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
     return sequelize.define('IMDBPosters', {
          IMDBPosterID: {
               autoIncrement: true,
               type: DataTypes.INTEGER,
               allowNull: false,
               primaryKey: true
          },
          WatchListItemID: {
               type: DataTypes.INTEGER,
               allowNull: false
          },
          PosterURL: {
               type: DataTypes.TEXT,
               allowNull: false
          },
          PosterData: {
               type: DataTypes.BLOB,
               allowNull: true
          }
     }, {
          sequelize,
          tableName: 'IMDBPosters',
          timestamps: false,
          indexes: [
               {
                    name: "PK_IMDBPosters",
                    unique: true,
                    fields: [
                         { name: "IMDBPosterID" },
                    ]
               },
          ]
     });
};
