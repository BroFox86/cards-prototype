"use strict";

var displayViewportSize = new ViewportIndicator([
  "position: fixed",
  "bottom: 0",
  "left: 1%",
  "z-index: 9999",
  "background: white",
  "color: blue"
]);

/**
 * Display viewport size on the screen.
 * @class
 * @param {string[]} styles - The array of styles that add to the indicator.
 * @author Daur Gamisonia <daurgam@gmail.com>
*/
function ViewportIndicator( styles ) {
  var stylesStr = "",
    indicator;

  // Generate styles string
  for ( var i = 0; i < styles.length; i++ ) {
    stylesStr += styles[i] + ";"
  }

  /*
   * Generate indicator and append it to body.
   */
  window.addEventListener("DOMContentLoaded", function() {

    indicator = document.createElement("div");

    indicator.id = "viewportIndicator";

    indicator.style.cssText = stylesStr;

    document.body.appendChild( indicator );
  });

  [ "DOMContentLoaded", "resize" ].forEach(function( item ) {
    window.addEventListener( item, displayViewportSize );
  });

  /*
   * Calculate viewport sizes of the page and insert the value to the indicator.
   */
  function displayViewportSize() {
    var scrollbar = window.innerWidth - document.documentElement.clientWidth,
      width = window.innerWidth,
      height = window.innerHeight;

    indicator.innerHTML = (width - scrollbar) + "x" + height;
  }
}