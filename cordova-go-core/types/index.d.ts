interface CordovaGoCore {
  /**
   * @description LoadClips will load clips form Dashcam
   * @param {any} userId
   * @returns {Promise<string>}
   */
  LoadUser(userId: any): Promise<any>
}
