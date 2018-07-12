function handleMouseEvents(cardNmb) {
  "use strict";

  // Selectors
  var card        = "[data-target='card']" + ":nth-child(" + cardNmb + ")",
      cardBtn     = "[data-trigger='card']",
      cardDesc    = "[data-replace='desc']",
      cardFeature = "[data-get='feature']",
      cardFooter  = "[data-replace='footer']";

  // Initial content
  var descText = $(card)
    .find(cardDesc)
    .text();

  var footerContent;

  // Initial state
  var isClicked = false;

  /////////////////////////
  // Handle click events //
  /////////////////////////

  $(card).on("click", $(cardBtn), function(e) {
    e.preventDefault();

    if (isClicked == false) {
      // Add selected state
      isClicked = true;
      $(this).addClass("is-selected");
      
      // Save the initial content
      footerContent = $(this)
        .find(cardFooter)
        .children()
        .detach();

      var selectedText = $(this)
        .find(cardFooter)
        .data("text");

      // Add text to card footer
      $(this)
        .find(cardFooter)
        .text(selectedText);
    } else {
      // Restore states
      isClicked = false;

      $(this)
        .removeClass("is-selected")
        .removeClass("has-note");

      // Restore the initial content
      $(this)
        .find(cardFooter)
        .text("")
        .append(footerContent);
      $(this)
        .find(cardDesc)
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
        .find(cardDesc)
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
      .find(cardFeature)
      .text();

    // Apply the disabled state text
    $(card)
      .off("click")
      .find(cardFooter)
      .html("Печалька, " + featureText + " закончился.");
  }
}

// Get the number of cards
var cards = $("[data-target='card']").length;

// Add the event listener to each of the card
for (var i = 1; i <= cards; i++) {
  handleMouseEvents(i);
}