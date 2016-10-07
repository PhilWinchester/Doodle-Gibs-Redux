console.log("JAVASCRIPT LOADED");

$(function(){
  console.log("DOM LOADED");
  var enemyObjList = [];

  var grid = new Grid();
  var gridObj = grid.getGrid();

  var castle = new Castle();
  $("body").append(castle);

  $(".menu").draggable({
    helper: "clone",
    grid: [5,5],
    // grid: [Math.floor($(window).width() / 15), Math.floor($(window).height() / 10)],
    start: function(){
      // console.log(String($(this).attr("id")));
      var elemClass = String($(this).attr("id")).split("_")[1];

      $(".menu").eq($(".menu").length - 1).addClass(elemClass);
      $(".menu").eq($(".menu").length - 1).removeClass("menu");
      // $(".menu").eq($(".menu").length - 1).removeAttr("menu_"+elemClass);
    },
    end: function(){
      console.log($(this).data());
    }
  });
  $(".box").droppable({
    drop: function(e,ui){
      var newUnit = $(ui.helper).clone();

      newUnit.removeClass("ui-draggable ui-draggable-dragging ui-draggable-handle");

      var colNum = $(this).data().colNum;
      var rowNum = $(this).data().rowNum;

      var boxCoords = grid.getCenter(colNum, rowNum)

      newUnit.css({"left":Math.floor(boxCoords[0])+"px", "top":Math.floor(boxCoords[1])+"px"})

      $(".grid").append(newUnit);
    }
  });

  for (var i = 0; i < 5; i++) {
    let eraseObj = new Eraserman(grid);
    let eraseDom = eraseObj.getUnit();

    var yCoord = Math.floor(Math.random() * gridObj[0].length);
    eraseObj.setCoords(0,yCoord);
    var boxCoords = grid.getCenter(0,yCoord);

    eraseDom.css({"left":Math.floor(boxCoords[0])+"px", "top":Math.floor(boxCoords[1])+"px"});

    enemyObjList.push(eraseObj);
    $(".grid").append(eraseDom);
  };
  window.setInterval(function() {
    for (var i = 0; i < enemyObjList.length; i++) {
      // enemyObjList[i].march();
    }
  }, 1000)
});

/*spawn units on row 15 column 10 and move them up if overlap*/

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

    for (var x = 0; x < 10; x++) {
      var column = [];
      for (var y = 0; y < 5; y++) {
        var box = $("<div>");
        box.attr("class", "box");
        box.data({colNum:x,rowNum:y})
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

    let centerX = offset.left; //+ width / 2;
    let centerY = offset.top; //+ height / 2;

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

    var boxCoords = this.grid.getCenter(this.x,this.y);
    this.unit.css({"left":Math.floor(boxCoords[0])+"px",
      "top":Math.floor(boxCoords[1])+"px"
    });
  }
  getUnit(){
    return this.unit;
  }
  march(){
    this.x += 1;

    var boxCoords = this.grid.getCenter(this.x,this.y);
    this.unit.css({"left":Math.floor(boxCoords[0])+"px", "top":Math.floor(boxCoords[1])+"px"});
  }
}
class Match extends Unit {
  constructor(){
    super();

    /*
    1 - spawns absolute fixed
    2 - on click becomes draggable
    3 - on release snaps to grid
    */

    this.unit = $("<div>")
    this.unit.attr("class", "match")
    this.unit.css({"left": $(window).width() * .2, "top": $(window).height() * .4});
    // this.unit.offset({"left": "20vw", "top": "40vh"});

    this.unit.draggable();

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
