

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
  
    if ("LoadUser".equals(action)) {
      cordova.getThreadPool().execute(new Runnable() {
        public void run() {
        boolean success = false;
        try{
        String resp = GoCore.loadUser(args.getString(0));
        JSONArray result = new JSONArray();
        result = new JSONArray(resp);
        callbackContext.success(result);


      }catch (Exception e){
        callbackContext.error(e.getMessage());
      }
  }
});
return true;
    }
      
  // No action matched
  return false;
  }
}