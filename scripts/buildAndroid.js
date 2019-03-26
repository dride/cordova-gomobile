var fs = require("fs");

function buildAndroid(sourceMap) {
  var java = `

  package cordova.plugins;

  import org.apache.cordova.CordovaInterface;
  import org.apache.cordova.CordovaPlugin;
  import org.apache.cordova.CordovaWebView;
  import org.apache.cordova.CallbackContext;
  
  import org.json.JSONArray;
  import org.json.JSONException;
  import org.json.JSONObject;
  
  
  import android.util.Log;
  import goCore.GoCore;
  
  public class CordovaGoCore extends CordovaPlugin {
      @Override
      public void initialize(CordovaInterface cordova, CordovaWebView webView) {
          super.initialize(cordova, webView);
      }

      @Override
      public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
  `;

  Object.keys(sourceMap).forEach(function(k) {
    //prep params
    var par = "";
    var funcs = "";
    for (var i = 0; i < sourceMap[k].Params.length; i++) {
      //par += sourceMap[k].Params[i].Name + ",";
      par +=
        "args." +
        getVarGrabType(sourceMap[k].Params[i].PType) +
        "(" +
        i +
        "), ";
    }
    //remove final comma
    par = par.slice(0, -1);
    par = par.slice(0, -1);

    java += `
    if ("${sourceMap[k].Name}".equals(action)) {
      cordova.getThreadPool().execute(new Runnable() {
        public void run() {
        boolean success = false;
        try{${
          sourceMap[k].Return == "string"
            ? `
        String resp = GoCore.${jsLcfirst(sourceMap[k].Name)}(${par});
        JSONArray result = new JSONArray();
        result = new JSONArray(resp);
        callbackContext.success(result);

`
            : `
            DashcamCore.${jsLcfirst(sourceMap[k].Name)}(${par});
            callbackContext.success("");
            `
        }
      }catch (Exception e){
        callbackContext.error(e.getMessage());
      }
  }
});
return true;
    }
    `;
  });
  java += `  
  // No action matched
  return false;
  }
}`;

  fs.writeFile(
    "./cordova-go-core/src/android/cordova/plugins/CordovaGoCore.java",
    java,
    function(err) {
      if (err) {
        return console.log(err);
      }

      console.log("[Android] The file was saved!");
    }
  );
}

function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function jsLcfirst(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}
function getVarGrabType(type) {
  if (type == "string") {
    return "getString";
  }
  if (type == "bool") {
    return "getBoolean";
  }
  if (type == "int") {
    return "getInt";
  }
  return "";
}

module.exports.buildAndroid = buildAndroid;
