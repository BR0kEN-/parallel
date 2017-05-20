(function ($) {
  'use strict';

  /**
   * @constructor
   */
  function Theme() {
    /**
     * HTML <body> element.
     *
     * @type {jQuery}
     */
    this.$body = null;
    /**
     * Callback functions for "has", "add" and "remove" class events.
     *
     * @type {{has: {Object}, add: {Object}, remove: {Object}}}
     */
    this.callbacks = {
      has: {},
      add: {},
      remove: {}
    };

    /**
     * Needed to use an instance inside of other contexts.
     *
     * @type {Theme}
     */
    var self = this;

    // Take care about DOM ready.
    $(function () {
      self.$body = $('body');

      // Create jQuery events:
      // - addClass;
      // - removeClass;
      // - changeClass;
      $.each(['add', 'remove'], function (i, prefix) {
        var suffix = 'Class',
            method = prefix + suffix,
            original = $.fn[method];

        $.fn[method] = function (className) {
          var data = {
            type: prefix,
            className: className
          };

          $(this).trigger('change' + suffix, data).trigger(method, data);

          return original.apply(this, arguments);
        };
      });

      // Bind created events.
      self.$body.bind('addClass removeClass', function (event, data) {
        self.each(data.className, function (className) {
          self.execute(data.type, className);
        });
      });

      for (var className in self.callbacks.has) {
        if (self.callbacks.has.hasOwnProperty(className) && self.$body.hasClass(className)) {
          self.execute('has', className);
        }
      }
    });
  }

  // Create prototype without prototype.
  Theme.prototype = Object.create(null);
  Theme.prototype.constructor = Theme;

  /**
   * Register event callbacks.
   *
   * @param {String} type
   *   One of event types: "has", "add" or "remove".
   * @param {String} classNames
   *   CSS class that should be affected by event.
   * @param {Function} callback
   *   Callback that should be executed when event occurs.
   *
   * @returns {Theme}
   */
  Theme.prototype.register = function (type, classNames, callback) {
    if (callback instanceof Function && this.callbacks.hasOwnProperty(type)) {
      this.each(classNames, function (className) {
        this.callbacks[type][className] = this.callbacks[type][className] || [];
        this.callbacks[type][className].push(callback);
      });
    }

    return this;
  };

  /**
   * Execute event callback.
   *
   * @param {String} type
   *   One of event types: "has", "add" or "remove".
   * @param {String} className
   *   CSS class that should be affected by event.
   *
   * @returns {Theme}
   */
  Theme.prototype.execute = function (type, className) {
    if (typeof this.callbacks[type][className] === 'object') {
      for (var i = 0; i < this.callbacks[type][className].length; i++) {
        this.callbacks[type][className][i].call(null, this.$body, Drupal.settings, className);
      }
    }

    return this;
  };

  /**
   * Register callbacks for "has" event.
   *
   * @param {String} classNames
   * @param {Function} callback
   *
   * @returns {Theme}
   */
  Theme.prototype.has = function (classNames, callback) {
    return this.register('has', classNames, callback);
  };

  /**
   * Register callbacks for "add" event.
   *
   * @param {String} classNames
   * @param {Function} callback
   *
   * @returns {Theme}
   */
  Theme.prototype.add = function (classNames, callback) {
    return this.register('add', classNames, callback);
  };

  /**
   * Register callbacks for "remove" event.
   *
   * @param {String} classNames
   * @param {Function} callback
   *
   * @returns {Theme}
   */
  Theme.prototype.remove = function (classNames, callback) {
    return this.register('remove', classNames, callback);
  };

  /**
   * Split class names by single space or comma and execute callback.
   *
   * @param {String} classNames
   * @param {Function} callback
   */
  Theme.prototype.each = function (classNames, callback) {
    var self = this;

    $.each(classNames.split(/\s|,/), function () {
      callback.call(self, this);
    });
  };

  window.Theme = new Theme();
})(jQuery);
