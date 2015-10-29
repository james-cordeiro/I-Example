Meteor.npmRequire = function(moduleName) {
  var module = Npm.require(moduleName);
  return module;
};

