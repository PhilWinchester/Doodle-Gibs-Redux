console.log("JAVASCRIPT LOADED");

$(function(){
  console.log("DOM LOADED");
  $('#div2').draggable();

  $(".menu").eq(0).css("background-image", "url(images/Match.png)");
  $(".menu").eq(1).css("background-image", "url(images/Straw.png)");

  $(".menu").on("click", function(){
    let unit = $("<div>");
    let divLeft = $(this).offset().left;
    let divTop = $(this).offset().top;

    unit.attr("id",event.target.id);
    // unit.css({})
    unit.offset({"left" : divLeft, "top" : ""});
    unit.draggable();

    $("body").append(unit);
  })
});

function collision($unit1, $unit2) {
  var left1 = $unit1.offset().left;
  var top1 = $unit1.offset().top;
  var height1 = $unit1.outerHeight(true);
  var width1 = $unit1.outerWidth(true);
  var bottom1 = top1 + height1;
  var right1 = left1 + width1;

  var left2 = $unit2.offset().left;
  var top2 = $unit2.offset().top;
  var height2 = $unit2.outerHeight(true);
  var width2 = $unit2.outerWidth(true);
  var bottom2 = top2 + height2;
  var right2 = left2 + width2;

  if (bottom1 < top2 || top1 > bottom2 ||
     right1 < left2 || left1 > right2) {
    return false;
  } else {
    console.log("COLLISION");
    return true;
  }
}
