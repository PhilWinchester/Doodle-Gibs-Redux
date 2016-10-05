console.log("JAVASCRIPT LOADED");

$(function(){
  console.log("DOM LOADED");
  var enemyList = [];


  var castle = new Castle();
  $("body").append(castle);
  // $(".menu").eq(0).css("background-image", "url(../images/Match.png)");
  // $(".menu").eq(1).css("background-image", "url(../images/Straw.png)");

  $(".menu").on("click", function(){
    if (event.target.id === "menu_straw") {
      var unit = new Straw();
    } else if (event.target.id === "menu_match") {
      var unit = new Match();
    }

    //append to list of user units

    $("body").append(unit);
  })

  for (var i = 0; i < 5; i++) {
    let unit = new Eraserman();
    let unit2 = new Match();
    let unit3 = new Straw();

    enemyList.push(unit);

    $("body").append(unit);
    $("body").append(unit2);
    $("body").append(unit3);
  };

  window.setInterval(function() {
    enemyList.map(march());
  }, 200)
});

// window.setInterval(function() {
//     $('#result').text(collision($('#base'), $('#div2')));
// }, 200);

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
    console.log($unit1.attr("id"));
    return false;
  } else {
    console.log("COLLISION");
    return true;
  }
}

/*~~~~~~~~~~~~~CLASSES~~~~~~~~~~~~~*/
class Unit {
  constructor(){
    console.log("made Unit");
  }
  onCollision(collider){
    console.log(collider.attr("id"));
    if (collider.attr("class") === "enemy"){
      console.log("damaging");
    }
  }
}
class Eraserman extends Unit {
  constructor(){
    super();
    console.log("made Eraserman");
    this.movementX = .1;

    this.unit = $("<div>");
    this.unit.attr("class", "erase");
    this.unit.offset({"left": $(window).width() * this.movementX, "top": $(window).height() * .4});
    // this.unit.offset({"left": "10vw", "top": "40vh"});

    return this.unit;
  }
  march(){
    this.movementX += .1
    this.unit.offset({"left": $(window).width() * this.movementX});
  }
}
class Match extends Unit {
  constructor(){
    super();
    console.log("made Match");

    this.unit = $("<div>")
    this.unit.attr("class", "match")
    this.unit.offset({"left": $(window).width() * .2, "top": $(window).height() * .4});
    // this.unit.offset({"left": "20vw", "top": "40vh"});

    return this.unit;
  }
}
class Straw extends Unit {
  constructor() {
    super();
    console.log("made Straw");

    this.unit = $("<div>")
    this.unit.attr("class", "straw")
    this.unit.offset({"left": $(window).width() * .3, "top": $(window).height() * .4});
    // this.unit.offset({"left": "30vw", "top": "40vh"});

    return this.unit;
  }
}
class Castle {
  constructor() {
    console.log("made Castle");

    this.unit = $("<div>")
    this.unit.attr("id", "castle")
    this.unit.offset({"left": "85vw", "top": "40vh"});

    return this.unit;
  }
}
