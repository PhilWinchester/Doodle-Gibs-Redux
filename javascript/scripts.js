console.log("JAVASCRIPT LOADED");

$(function(){
  console.log("DOM LOADED");
  var enemyObjList = [];

  var grid = new Grid();
  var gridObj = grid.getGrid();

  var castle = new Castle();
  $("body").append(castle);

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
    let eraseObj = new Eraserman(grid);
    let eraseDom = eraseObj.getUnit();

    var yCoord = Math.floor(Math.random() * gridObj[0].length);
    var boxCoords = grid.getCenter(0,yCoord);

    console.log(Math.floor(boxCoords[0]) + " : " + Math.floor(boxCoords[1]));

    eraseDom.css({"left":Math.floor(boxCoords[0])+"px", "top":Math.floor(boxCoords[1])+"px"});

    enemyObjList.push(eraseObj);
    $(".grid").append(eraseDom);
  };
  // window.setInterval(function() {
  //   enemyObjList[0].march();
  // }, 1000)
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
class Grid {
  constructor(){
    this.grid = [];

    for (var x = 0; x < 15; x++) {
      var column = [];
      for (var y = 0; y < 10; y++) {
        var box = $("<div>");
        box.attr("class", "box");
        // box.data({colNum:x,rowNum:y})
        column.push(box);
        $(".grid").append(box);
      }
      this.grid.push(column);
    }
  }
  getGrid(){
    return this.grid;
  }
  getCenter(x,y){
    let box = this.grid[x][y];
    let offset = box.offset();
    let height = box.height();
    let width = box.width();

    let centerX = offset.left //+ width / 2;
    let centerY = offset.top //+ height / 2;

    return [centerX, centerY];
  }
}
class Unit {
  constructor(){
    this.x = 0;
    this.y = 0;
  }
  onCollision(collider){
    console.log(collider.attr("id"));
    if (collider.attr("class") === "enemy"){
      console.log("damaging");
    }
  }
  setCoords(x,y){
    this.x = x;
    this.y = y;
  }
  getCoords(){
    return [this.x, this.y];
  }
}
class Eraserman extends Unit {
  constructor(grid){
    super();
    this.grid = grid;

    this.unit = $("<div>");
    this.unit.attr("class", "erase");
    this.unit.offset({"left": $(window).width() * this.movementX, "top": $(window).height() * .4});
    // this.unit.draggable();
    // this.unit.offset({"left": "10vw", "top": "40vh"});
  }
  getUnit(){
    return this.unit;
  }
  march(){
    // this.unit.offset({"left": $(window).width() * this.movementX});
    this.x += 1;
    console.log(this.x);

    var boxCoords = this.grid.getCenter(this.x,this.y);

    console.log(Math.floor(boxCoords[0]) + " : " + Math.floor(boxCoords[1]));

    this.unit.css({"left":Math.floor(boxCoords[0])+"px", "top":Math.floor(boxCoords[1])+"px"});



  }
}
class Match extends Unit {
  constructor(){
    super();

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

    this.unit = $("<div>")
    this.unit.attr("class", "straw")
    this.unit.offset({"left": $(window).width() * .3, "top": $(window).height() * .4});
    // this.unit.offset({"left": "30vw", "top": "40vh"});

    return this.unit;
  }
}
class Castle {
  constructor() {
    // console.log("made Castle");

    this.unit = $("<div>")
    this.unit.attr("id", "castle")
    this.unit.offset({"left": "85vw", "top": "40vh"});

    return this.unit;
  }
}
