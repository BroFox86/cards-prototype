function handleMouseEvents(t){var e,a="[data-target='card']:nth-child("+t+")",s="[data-replace='desc']",i="[data-replace='footer']",d=$(a).find(s).text();if($(a).on("click",$("[data-trigger='card']"),function(t){if(t.preventDefault(),1==$(this).attr("data-click-state"))$(this).attr("data-click-state",0).removeClass("is-selected").removeClass("has-note"),$(this).find(i).text("").append(e),$(this).find(s).text(d);else{$(this).attr("data-click-state",1).addClass("is-selected"),e=$(this).find(i).children().detach();var a=$(this).find(i).data("text");$(this).find(i).text(a)}}),$(a).on("mouseleave",function(){1==$(this).attr("data-click-state")&&$(this).addClass("has-note").find(s).text("Котэ не одобряет?")}),1==$(a).hasClass("is-disabled")){var c=$(a).find("[data-get='feature']").text();$(a).off("click").find(i).html("Печалька, "+c+" закончился.")}}for(var cards=$("[data-target='card']").length,i=1;i<=cards;i++)handleMouseEvents(i);