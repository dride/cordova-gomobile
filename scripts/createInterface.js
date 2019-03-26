require("node-go-require");
var buildIos = require("./buildIos");
var buildCordova = require("./buildCordova");
var buildAndroid = require("./buildAndroid");
var buildTypes = require("./buildTypes");

var exec = require("child_process").execSync;
var fs = require("fs");

var devices = ["yi", "mi"];

//create fresh sourceMap
exec("cd src/parse && go run parse", function(err, stdout, stderr) {
  console.log(stdout);
});

var sourceMap = require("../sourceMap.json");

buildCordova.buildCordova(sourceMap);
buildIos.buildiOS(sourceMap);
buildAndroid.buildAndroid(sourceMap);
buildTypes.buildTypes(sourceMap);
