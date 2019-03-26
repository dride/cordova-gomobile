var fs = require("fs");

function buildiOS(sourceMap) {
  var swift = `import DashcamCore
  
      @objc(CordovaGoCore) class CordovaGoCore : CDVPlugin {
  `;

  Object.keys(sourceMap).forEach(function(k) {
    //prep params
    var par = "";
    var varDesc = "";
    for (var i = 0; i < sourceMap[k].Params.length; i++) {
      par +=
        "command.arguments[" +
        i +
        "] as! " +
        jsUcfirst(sourceMap[k].Params[i].PType) +
        ", ";
    }

    par = par.slice(0, -2);
    varDesc = varDesc.slice(0, -1);
    if (sourceMap[k].Return == "bool") {
      par += par ? ", &resp" : "&resp";
    }
    if (sourceMap[k].Return) {
      par += par ? ", &error" : "&error";
    }

     swift += `
      @objc(${sourceMap[k].Name}:)
      func ${sourceMap[k].Name}(command: CDVInvokedUrlCommand) {
          var pluginResult = CDVPluginResult(
              status: CDVCommandStatus_ERROR
          )
          var error: NSError?
          self.commandDelegate.run(inBackground: ({
            ${
              sourceMap[k].Return == "string"
                ? `
                let resp = DashcamCore${
                  sourceMap[k].Name
                }(${par}).data(using: .utf8)!

              if (error != nil){
                pluginResult = CDVPluginResult(
                    status: CDVCommandStatus_ERROR,
                    messageAs: error?.localizedDescription
                )
              }else{
                  do{
                      let jsonArray =  try JSONSerialization.jsonObject(with: resp, options : .allowFragments) as? [Dictionary<String,Any>]
                      pluginResult = CDVPluginResult(
                          status: CDVCommandStatus_OK,
                          messageAs: jsonArray
                      )
                  } catch{
                      pluginResult = CDVPluginResult(
                          status: CDVCommandStatus_ERROR,
                          messageAs: "JsonParseFailed"
                      )
                  }
                }
                `
                : `
                var resp: ObjCBool = true;
                DashcamCore${sourceMap[k].Name}(${par})
                if (error != nil){
                  pluginResult = CDVPluginResult(
                      status: CDVCommandStatus_ERROR,
                      messageAs: error?.localizedDescription
                  )
                }else{
                  pluginResult = CDVPluginResult(
                      status: CDVCommandStatus_OK,
                      messageAs: true
                  )
                }
                `
            }
            self.commandDelegate!.send(
                pluginResult,
                callbackId: command.callbackId
            )
          }))
      }
  `;
  });

  swift += "}";

  fs.writeFile(
    "./cordova-go-core/src/ios/CordovaGoCore.swift",
    swift,
    function(err) {
      if (err) {
        return console.log(err);
      }

      console.log("[IOS] The file was saved!");
    }
  );
}

function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports.buildiOS = buildiOS;
