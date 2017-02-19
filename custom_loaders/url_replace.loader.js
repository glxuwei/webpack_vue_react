var urlConfig = require('../config/url.js');
var map = urlConfig.map;

module.exports = function (source) {
  this.cacheable();
  var type = this.query.replace(/\?env=/, '');
  var basePath = urlConfig[type];
  for (var key in map) {
    source = source.replace(new RegExp(key, 'g'), basePath + map[key][type])
  }
  return source;
}
