(function ($) {
  'use strict';

  $.fn.sticky = function (className) {
    className = className || 'sticky';

    return this.each(function () {
      var $element = $(this);
      var offsetTop = $element.offset().top;
      var allow = (document.body.scrollHeight - offsetTop) >= window.outerHeight;

      window.scrollBreakpoint(function () {
        return this.scrollY > offsetTop && allow;
      }, function (isTrue) {
        // This code will be executed exactly once when you'll reach the breakpoint.
        $element[(isTrue ? 'add' : 'remove') + 'Class'](className);
      });
    });
  };
})(jQuery);
