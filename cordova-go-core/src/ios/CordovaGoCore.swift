import DashcamCore
  
      @objc(CordovaGoCore) class CordovaGoCore : CDVPlugin {
  
      @objc(LoadUser:)
      func LoadUser(command: CDVInvokedUrlCommand) {
          var pluginResult = CDVPluginResult(
              status: CDVCommandStatus_ERROR
          )
          var error: NSError?
          self.commandDelegate.run(inBackground: ({
            
                let resp = DashcamCoreLoadUser(command.arguments[0] as! String, &error).data(using: .utf8)!

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
                
            self.commandDelegate!.send(
                pluginResult,
                callbackId: command.callbackId
            )
          }))
      }
  }