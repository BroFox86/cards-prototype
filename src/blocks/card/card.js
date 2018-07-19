function handleMouseEvents(cardNmb) {
  "use strict";

  var card    = "[data-target='card']" + ":nth-child(" + cardNmb + ")",
      btn     = "[data-trigger='cardBtn']",
      desc    = "[data-replace='cardDesc']",
      feature = "[data-get='cardFeature']",
      footer  = "[data-replace='cardFooter']";

  // Initial content
  var descText = $(card)
    .find(desc)
    .text();

  var footerContent,
      isClicked = false;

  /* Handle click events */

  $(card).on("click", $(btn), function(e) {
    e.preventDefault();

    if (isClicked == false) {
      isClicked = true;
      $(this).addClass("is-selected");
      
      // Save the initial content
      footerContent = $(this)
        .find(footer)
        .children()
        .detach();

      var selectedText = $(this)
        .find(footer)
        .data("text");

      $(this)
        .find(footer)
        .text(selectedText);
    } else {
      isClicked = false;

      $(this)
        .removeClass("is-selected")
        .removeClass("has-note");

      // Restore the initial content
      $(this)
        .find(footer)
        .text("")
        .append(footerContent);
      $(this)
        .find(desc)
        .text(descText);
    }
  });

  /* Handle mouseleave events */

  $(card).on("mouseleave", function() {
    if (isClicked == true) {
      $(this)
        .addClass("has-note")
        .find(desc)
        .text("Котэ не одобряет?");
    }
  });

  /* Handle disabled states */

  if ($(card).hasClass("is-disabled") == true) {
    var featureText = $(card)
      .find(feature)
      .text();

    $(card)
      .off("click")
      .find(footer)
      .html("Печалька, " + featureText + " закончился.");
  }
}

/* Add the event listener to each of the card */

var cards = $("[data-target='card']").length;

for (var i = 1; i <= cards; i++) {
  handleMouseEvents(i);
}