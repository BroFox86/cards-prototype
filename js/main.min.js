function handleMouseEvents(cardNmb) {

  // Hooks
  var cardWrapper = "[data-toggle='card']" + ":nth-child(" + cardNmb + ")",
      cardBtn     = "[data-target='cardBtn']",
      cardDesc    = "[data-replace='desc']",
      cardFeature = "[data-get='feature']",
      cardFooter  = "[data-replace='footer']";

  // Initial content
  var descText = $(cardWrapper)
      .find(cardDesc)
      .text();

  var footerContent;

  /////////////////////////
  // Handle click events //
  /////////////////////////

  $(cardWrapper).on("click", $(cardBtn), function(e) {
    e.preventDefault();

    // Check if the element is selected
    if ($(this).attr("data-click-state") == 1) {
      // Clean extra stats
      $(this)
        .attr("data-click-state", 0)
        .removeClass("is-selected")
        .removeClass("has-note");

      // Restore initial values
      $(this)
        .find(cardFooter)
        .text("")
        .append(footerContent);
      $(this)
        .find(cardDesc)
        .text(descText);
    } else {
      // Add selected state
      $(this)
        .attr("data-click-state", 1)
        .addClass("is-selected");

      // Save initial content of the node
      footerContent = $(this)
        .find(cardFooter)
        .children()
        .detach();

      var selectedText = $(this).find(cardFooter).data("text");

      // Add the text to card footer
      $(this)
        .find(cardFooter)
        .text(selectedText);
    }
  });

  //////////////////////////////
  // Handle mouseleave events //
  //////////////////////////////

  $(cardWrapper).on("mouseleave", function() {
    if ($(this).attr("data-click-state") == 1) {
      $(this)
        .addClass("has-note")
        .find(cardDesc)
        .text("Котэ не одобряет?");
    }
  });

  ///////////////////////////
  // Handle disable states //
  ///////////////////////////

  function disabledCard() {

    var featureText = $(cardWrapper)
        .find(cardFeature)
        .text();

    $(cardWrapper)
      .off("click")
      .find(cardFooter)
      .html("Печалька, " + featureText + " закончился.");
  }

  // Check if card is disabled when the page is load
  if ($(cardWrapper).hasClass("is-disabled") == true) {
    disabledCard();
  }

  ////////////////////////////////////////////////////
  // Add the mutations observer for disabled states //
  ////////////////////////////////////////////////////

  // Select the node that will be observed for mutations
  var targetNode = $(cardWrapper)[0];

  // Create the observer
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {

      var disabled = $(cardWrapper).hasClass("is-disabled");

      if (mutation.attributeName == "class" && disabled == true) {
        disabledCard();
      }
    });
  });

  // Start observing the target node for configured mutations
  observer.observe(targetNode, { attributes: true });
}

// Get the number of cards
var cards = $("[data-toggle='card']").length;

// Add the event listener to each of the card
for (var i = 1; i <= cards; i++) {
  handleMouseEvents(i);
}
