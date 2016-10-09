console.log("SCRIPTS LOADED");

$(function(){
  console.log("DOM LOADED");
  var enemyObjList = [];
  var unitObjList = [];
  var timerId;

  var grid = new Grid();
  var gridObj = grid.getGrid();

  var castle = new Castle();
  var castleDom = castle.getCastle();
  $("body").append(castleDom);

  $(".menu").draggable({
    helper: "clone",
    grid: [5,5],
    start: function(){
      var elemClass = String($(this).attr("id")).split("_")[1];

      $(".menu").eq($(".menu").length - 1).addClass(elemClass);
      $(".menu").eq($(".menu").length - 1).removeClass("menu");
    }
  });

  $(".box").droppable({
    drop: function(e,ui){
      var newDom = $(ui.helper).clone();
      newDom.removeClass("ui-draggable ui-draggable-dragging ui-draggable-handle");

      if (newDom.attr("class") === "straw") {
        console.log("straw");
        var newUnit = new Straw();
      } else if (newDom.attr("class") === "match") {
        console.log("match");
        var newUnit = new Match();
      }

      var colNum = $(this).data().colNum;
      var rowNum = $(this).data().rowNum;
      newUnit.setCoords(colNum,rowNum);
      console.log(newUnit.getCoords());

      var boxCoords = grid.getCenter(colNum, rowNum)
      newDom.css({"left":Math.floor(boxCoords[0])+"px", "top":Math.floor(boxCoords[1])+"px"})
      gridObj[colNum][rowNum].append(newDom);

      unitObjList.push(newUnit);
    }
  });

  for (var i = 0; i < 5; i++) {
    let eraseObj = new Eraserman(grid);
    let eraseDom = eraseObj.getUnit();

    var yCoord = Math.floor(Math.random() * gridObj[0].length);
    eraseObj.setCoords(0,yCoord);

    var boxCoords = grid.getCenter(0,yCoord);
    eraseDom.css({"left":Math.floor(boxCoords[0])+"px", "top":Math.floor(boxCoords[1])+"px"});
    gridObj[0][yCoord].append(eraseDom);

    enemyObjList.push(eraseObj);
  };

  //timer start stop for debugging purposes
  var startTimer = function(event) {
    if (timerId) {
      return;
    }
    timerId = setInterval(function(){
      console.log("starting timer");
      for (var i = 0; i < enemyObjList.length; i++) {
        enemyObjList[i].march();
      }
    }, 1000);
  }
  var stopTimer = function(event) {
    clearInterval(timerId);
    timerId = null;
    console.log('stop Timer');
  }
  $("#castle").on("click",function(event) {
    if (timerId) {
      stopTimer();
    } else {
      startTimer();
    }
  });
});

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
  getNeighbors(){
    return []
  }
}
class Eraserman extends Unit {
  constructor(grid){
    super();
    this.grid = grid;

    this.unit = $("<div>");
    this.unit.attr("class", "erase");
  }
  getUnit(){
    return this.unit;
  }
  march(){
    let gridList = this.grid.getGrid();
    // console.log("Column: " + (this.x + 2) + " Row: " + this.y);
    // gridList[this.x + 2][this.y].css("background-color","rgba(255,0,0,.5)");
    // console.log(gridList[this.x + 2][this.y].children().attr("class"));

    if (gridList[this.x + 1][this.y].children().attr("class") === "straw" ||
      gridList[this.x + 1][this.y].children().attr("class") === "match") {
      console.log("WATCH OUT");
      // console.log("Row: " + (this.x + 1) + " : " + "Column: " + this.y);
      gridList[this.x + 1][this.y].empty();
    }
    this.x += 1;

    var boxCoords = this.grid.getCenter(this.x,this.y);
    this.unit.css({"left":Math.floor(boxCoords[0])+"px", "top":Math.floor(boxCoords[1])+"px"});
  }
}
class Match extends Unit {
  constructor(){
    super();
  }
}
class Straw extends Unit {
  constructor() {
    super();
  }
}
class Castle {
  constructor() {
    this.health = 10;

    this.unit = $("<div>")
    this.unit.attr("id", "castle")
    this.unit.offset({"left": "85vw", "top": "40vh"});
    this.unit.text("Health: " + 10)
  }
  getCastle(){
    return this.unit;
  }
}
