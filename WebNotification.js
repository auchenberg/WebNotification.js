/** @license
 * WebNotification.js <https://github.com/auchenberg/WebNotification.js/>
 * Released under the MIT license
 * Author: Kenneth Auchenberg
 * Version: 0.1.0
 */

;(function(window) {

  var nativeNotification = window.Notification,
      prefixedNotification = window.webkitNotifications;

  var utils = {
    isFunction: function(obj) {
      return typeof obj === 'function';
    }
  }

  function WebNotification(title, options) {
    return new nativeNotification(title, options);
  }

  WebNotification.getPermission = function() {

    if (nativeNotification) {

      // Official W3C Web Notifications API
      if (nativeNotification.permission) {
        return nativeNotification.permission
      }

      // Old Safari API
      if (utils.isFunction(nativeNotification.permissionLevel)) {
        return nativeNotification.permissionLevel();
      }
    }

    // Old prefixedNotification WebKit API
    if (prefixedNotification && utils.isFunction(prefixedNotification.checkPermission)) {
      switch (prefixedNotification.checkPermission()) {
        case 0:
          return 'granted'
          break;
        case 1:
          return 'default'
          break;
        case 2:
          return 'denied'
          break;
      }
    }

    return 'default';
  };

  WebNotification.requestPermission = function(callback) {
    var context = this;

    function _onPermissionRequested() {
      context.permission = context.getPermission();

      if (callback) {
        callback.call(this);
      }
    };

    // Native first, then prefxied
    if (nativeNotification && utils.isFunction(nativeNotification.requestPermission)) {
      nativeNotification.requestPermission(_onPermissionRequested);
    } else if (prefixedNotification && utils.isFunction(prefixedNotification.requestPermission)) {
      prefixedNotification.requestPermission(_onPermissionRequested);
    } else {
      throw 'Could not call requestPermission';
    }

  };

  WebNotification.isSupported = function() {

    if (notification) {
      return true;
    } else {
      return prefixed ? true : false;
    }

    return false;
  };

  WebNotification.permission = WebNotification.getPermission();


  if (typeof define === 'function' && define.amd) {
    define(function() {
      return (window.WebNotification = WebNotification);
    });
  } else {
    window.WebNotification = WebNotification;
  }

})(this);

