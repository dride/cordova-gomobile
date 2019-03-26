var fs = require("fs");
var prettier = require("prettier");

function buildTypes(sourceMap) {
  var indexJs = ` interface CordovaGoCore {`;
  Object.keys(sourceMap).forEach(function(k) {
    //prep params
    var par = "";
    var varDesc = "";
    for (var i = 0; i < sourceMap[k].Params.length; i++) {
      if (varDesc == "") {
        varDesc = "\n";
      }
      par +=
        sourceMap[k].Params[i].Name +
        ": " +
        goTypeToTS(sourceMap[k].Params[i].PType) +
        ",";
      varDesc +=
        "    * @param {" +
        goTypeToTS(sourceMap[k].Params[i].PType) +
        "} " +
        sourceMap[k].Params[i].Name +
        "\n";
    }
    par = par.slice(0, -1);
    varDesc = varDesc.slice(0, -1);
    indexJs += `
           /**
            * @description ${sourceMap[k].Comment.slice(0, -1)}${varDesc}
            * @returns {Promise<${sourceMap[k].Return}>}
            */
           ${sourceMap[k].Name}(${par}): Promise<any>;
              `;
  });

  indexJs += `
  }
    `;

  fs.writeFile(
    "./cordova-go-core/types/index.d.ts",
    prettier.format(indexJs, { semi: false, parser: "typescript" }),
    function(err) {
      if (err) {
        return console.log(err);
      }

      console.log("[TS] The file was saved!");
    }
  );
}

function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function goTypeToTS(type) {
  if (type == "bool") {
    return "boolean";
  }
  if (type == "string") {
    return "any";
  }
  if (type == "int") {
    return "Number";
  }

  return type;
}

module.exports.buildTypes = buildTypes;
