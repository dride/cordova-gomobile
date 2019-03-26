var exec = require("child_process").execSync;
var fs = require("fs");
var rimraf = require("rimraf");
var ncp = require("ncp");

const camelCase = require("camelcase");

var packageName = require("../package.json").name;

exec(
  "cd sdk && gomobile bind -target=" +
    process.argv[2] +
    " " +
    camelCase(packageName),
  function(err, stdout, stderr) {
    console.log(stdout);
  }
);

if (process.argv[2] == "ios") {
  rimraf.sync("./cordova-go-core/sdk/GoCore.framework");
  ncp(
    "./sdk/GoCore.framework",
    "./cordova-go-core/sdk/GoCore.framework",
    err => {
      if (err) throw err;
      console.log("GoCore.framework was copied to cordova plugin");
    }
  );
}
if (process.argv[2] == "android") {
  rimraf.sync("./cordova-go-core/sdk/goCore.aar");
  fs.copyFile(
    "./sdk/goCore.aar",
    "./cordova-go-core/sdk/goCore.aar",
    err => {
      if (err) throw err;
      console.log("goCore.aar was copied to cordova plugin");
    }
  );
}
