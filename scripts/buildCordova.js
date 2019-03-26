var fs = require("fs");
var prettier = require("prettier");

function buildCordova(sourceMap) {
  var indexJs = `   var exec = require("cordova/exec");
  
  var CordovaGoCore = {
    `;

  Object.keys(sourceMap).forEach(function(k) {
    //prep params
    var par = "";
    var varDesc = "";
    for (var i = 0; i < sourceMap[k].Params.length; i++) {
      if (varDesc == "") {
        varDesc = "\n";
      }
      par += sourceMap[k].Params[i].Name + ",";
      varDesc +=
        "    * @param {" +
        sourceMap[k].Params[i].PType +
        "} " +
        sourceMap[k].Params[i].Name +
        "\n";
    }
    par = par.slice(0, -1);
    varDesc = varDesc.slice(0, -1);
    indexJs += `
         /**
          * @description ${sourceMap[k].Comment.slice(0, -1)}${varDesc}
          * @returns {${sourceMap[k].Return}}
          */
          ${sourceMap[k].Name}: function(${par}) {
              return new Promise(function(resolve, reject) {
                exec(resolve, reject, "CordovaGoCore", "${
                  sourceMap[k].Name
                }", [${par}]);
              });
            },
            `;
  });

  indexJs += `
}
  module.exports = CordovaGoCore;
  `;

  fs.writeFile(
    "./cordova-go-core/www/index.js",
    prettier.format(indexJs, { semi: false, parser: "babel" }),
    function(err) {
      if (err) {
        return console.log(err);
      }

      console.log("[JS] The file was saved!");
    }
  );
}

function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports.buildCordova = buildCordova;
