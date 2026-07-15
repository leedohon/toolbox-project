(function () {
  'use strict';
  function isMobileInteraction() {
    return window.matchMedia('(max-width: 767px)').matches || window.matchMedia('(pointer: coarse)').matches;
  }
  function focus(element, options) {
    if (!element || isMobileInteraction()) return false;
    element.focus(options);
    return true;
  }
  function focusAndSelect(element, options) {
    if (!focus(element, options)) return false;
    if (typeof element.select === 'function') element.select();
    return true;
  }
  window.ToolboxUX = { isMobileInteraction, focus, focusAndSelect };
}());
