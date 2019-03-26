var exec = require("cordova/exec")

var CordovaGoCore = {
  /**
   * @description LoadClips will load clips form Dashcam
   * @param {string} userId
   * @returns {string}
   */
  LoadUser: function(userId) {
    return new Promise(function(resolve, reject) {
      exec(resolve, reject, "CordovaGoCore", "LoadUser", [userId])
    })
  }
}
module.exports = CordovaGoCore
