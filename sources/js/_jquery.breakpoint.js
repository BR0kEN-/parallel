(function ($) {
  'use strict';

  /**
   * @type {jQuery}
   */
  var $window = $(window);

  /**
   * @constructor
   *
   * All breakpoints are imported from CSS (SCSS). An import occurs when when
   * page is loading and "html:before" has the "content" property with value
   * of next format: "'(desktop: 980px, tablet: 780px)'".
   *
   * @example
   * breakpoint.set(function(width, height) {
   *   // Default "resize" behavior of the window object.
   * });
   *
   * @example
   * breakpoint.set({to: '<BREAKPOINT>'}, function(width, height, value, name) {
   *   // Will run the callback function on "resize" event when the window
   *   // width will be less than value of "<BREAKPOINT>".
   * });
   *
   * @example
   * // Return breakpoint value.
   * breakpoint.get('<BREAKPOINT>');
   */
  function Breakpoint() {
    var points = Object.create(null);
    var content = getComputedStyle(document.querySelector('html'), ':before').getPropertyValue('content');

    if (content) {
      $.each(content.replace(/[()'"]/gi, '').split(', '), function() {
        // Scheme: "name: value".
        var data = this.split(': ');

        points[data[0]] = parseInt(data[1], 10);
      });
    }

    /**
     * @type {Object}
     */
    this.points = points;
  }

  // Create prototype without prototype.
  Breakpoint.prototype = Object.create(null);
  Breakpoint.prototype.constructor = Breakpoint;

  /**
   * Set a callback for breakpoint.
   *
   * @param {{to: string, from: string}|Function} map
   * @param {Function} callback
   *
   * @returns {Breakpoint}
   */
  Breakpoint.prototype.set = function (map, callback) {
    var self = this;
    var func = map instanceof Function ? map : function (width, height) {
      $.each(map, function (key, name) {
        var value = self.get(name);

        if (value > 0 && (('to' === key && width <= value) || ('from' === key && width >= value))) {
          callback.call(window, width, height, value, name);
        }
      });
    };

    // Execute function immediately to check initial sizes and bind it
    // on "resize" event.
    $window.bind('resize', (function resize() {
      func.call(window, $window.width(), $window.height());

      return resize;
    })());

    return self;
  };

  /**
   * Get the value of breakpoint by name.
   *
   * @param {String|Number} argument
   *   Breakpoint name or direct value.
   *
   * @returns {Number}
   *   Breakpoint value.
   */
  Breakpoint.prototype.get = function (argument) {
    if (this.points[argument]) {
      return this.points[argument];
    }

    // Try to transform an argument to decimal number.
    argument = parseInt(argument, 10);

    // If an argument could be transformed then store
    // it as a new value of a breakpoints.
    if (!isNaN(argument) && isFinite(argument)) {
      this.points[argument] = argument;

      return argument;
    }

    return 0;
  };

  window.Breakpoint = new Breakpoint();
})(jQuery);
