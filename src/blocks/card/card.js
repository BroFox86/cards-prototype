function handleMouseEvents(cardNmb) {
  "use strict";

  // Selectors
  var card    = "[data-target='card']" + ":nth-child(" + cardNmb + ")",
      btn     = "[data-trigger='cardBtn']",
      desc    = "[data-replace='cardDesc']",
      feature = "[data-get='cardFeature']",
      footer  = "[data-replace='cardFooter']";

  // Initial content
  var descText = $(card)
    .find(desc)
    .text();

  var footerContent;

  // Initial state
  var isClicked = false;

  /////////////////////////
  // Handle click events //
  /////////////////////////

  $(card).on("click", $(btn), function(e) {
    e.preventDefault();

    if (isClicked == false) {
      // Add selected state
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

      // Add text to card footer
      $(this)
        .find(footer)
        .text(selectedText);
    } else {
      // Restore states
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

  //////////////////////////////
  // Handle mouseleave events //
  //////////////////////////////

  $(card).on("mouseleave", function() {
    if (isClicked == true) {
      $(this)
        .addClass("has-note")
        .find(desc)
        .text("Котэ не одобряет?");
    }
  });

  ////////////////////////////
  // Handle disabled state  //
  ////////////////////////////

  // Check if the card is disabled
  if ($(card).hasClass("is-disabled") == true) {
    // Get the feature text
    var featureText = $(card)
      .find(feature)
      .text();

    // Apply the disabled state text
    $(card)
      .off("click")
      .find(footer)
      .html("Печалька, " + featureText + " закончился.");
  }
}

// Get the number of cards
var cards = $("[data-target='card']").length;

// Add the event listener to each of the card
for (var i = 1; i <= cards; i++) {
  handleMouseEvents(i);
}