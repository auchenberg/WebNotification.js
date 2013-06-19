;(function(window) {

  var notification = window.Notification,
      prefixed = window.webkitNotifications;

  var utils = {
    isFunction: function(obj) {
      return typeof obj === 'function';
    }
  }

  function WebNotification(title, options) {
    return new notification(title, options);
  }

  WebNotification.getPermission = function() {

    if (notification) {

      // Official W3C Web Notifications API
      if (notification.permission) {
        return notification.permission
      }

      // Old Safari API
      if (utils.isFunction(notification.permissionLevel)) {
        return notification.permissionLevel();
      }
    }

    // Old prefixed WebKit API
    if (prefixed && utils.isFunction(prefixed.checkPermission)) {
      switch (prefixed.checkPermission()) {
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

    // Prefixed first, then native
    if (prefixed && utils.isFunction(prefixed.requestPermission)) {
      prefixed.requestPermission(_onPermissionRequested);
    } else if (notification && utils.isFunction(notification.requestPermission)) {
      notification.requestPermission(_onPermissionRequested);
    } else {
      throw 'requestPermission not supported';
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

