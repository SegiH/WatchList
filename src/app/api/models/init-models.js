var DataTypes = require("sequelize").DataTypes;
var _Users = require("./Users");
var _WatchList = require("./WatchList");
var _WatchListItems = require("./WatchListItems");
var _WatchListSources = require("./WatchListSources");
var _WatchListTypes = require("./WatchListTypes");

function initModels(sequelize) {
     var Users = _Users(sequelize, DataTypes);
     var WatchList = _WatchList(sequelize, DataTypes);
     var WatchListItems = _WatchListItems(sequelize, DataTypes);
     var WatchListSources = _WatchListSources(sequelize, DataTypes);
     var WatchListTypes = _WatchListTypes(sequelize, DataTypes);

     return {
          Users,
          WatchList,
          WatchListItems,
          WatchListSources,
          WatchListTypes,
     };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
