console.log("SCRIPTS LOADED");

$(function(){
  console.log("DOM LOADED");
  var enemyObjList = [];
  var strawObjList = [];
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
        var newUnit = new Straw(grid);
        strawObjList.push(newUnit);
      } else if (newDom.attr("class") === "match") {
        console.log("match");
        var newUnit = new Match(grid);
      }

      var colNum = $(this).data().colNum;
      var rowNum = $(this).data().rowNum;
      newUnit.setCoords(colNum,rowNum);
      console.log(newUnit.getCoords());

      var boxCoords = grid.getCenter(colNum, rowNum)
      newDom.css({"left":Math.floor(boxCoords[0])+"px", "top":Math.floor(boxCoords[1])+"px"})
      gridObj[colNum][rowNum].append(newDom);

      // unitObjList.push(newUnit);
    }
  });

  for (var i = 0; i < 2; i++) {
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
      for (var i = 0; i < enemyObjList.length; i++) {
        enemyObjList[i].march(castle);
      }
      for (var j = 0; j < strawObjList.length; j++) {
        strawObjList[j].shoot();
        // for (var j = 0; j < spitballDomList.length; j++) {
        //   var gridCoords = strawObjList[i].getCoords();
        //   var boxCoords = grid.getCenter((gridCoords[0] - j),gridCoords[1]);
        //   console.log(spitballDomList[j]);
        //   spitballDomList[j].css({"left":Math.floor(boxCoords[0])+"px", "top":Math.floor(boxCoords[1])+"px"});
        // }
      }
    }, 1000);
  }
  // var spitballTimer = function(event){
  //   if (spitballTimerId) {
  //     return;
  //   }
  //   spitballTimerId = setInterval(function(){
  //     if ($(".spitball").length) {
  //       console.log("spitball moving");
  //       var xCoord = $(".spitball").offset().left;
  //       xCoord = Math.floor(xCoord -= 5)
  //       $(".spitball").css({"left": String(xCoord) + "px"});
  //     }
  //   }, 2000);
  // }
  var stopTimer = function(event) {
    clearInterval(timerId);
    timerId = null;
    spitballTimerId = null;
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
  march(castle){
    let gridList = this.grid.getGrid();

    if (this.x != gridList.length - 1) {
      // console.log(String(this.x) + " : " + String(gridList.length - 1));
      if (gridList[this.x + 1][this.y].children().attr("class") === "straw") {
        console.log("straw ahead");

        gridList[this.x + 1][this.y].empty();
      } else if (gridList[this.x + 1][this.y].children().attr("class") === "match") {
        console.log("match ahead");
        this.unit.remove();
        gridList[this.x +1][this.y].empty();
      }

      this.x += 1;
      var boxCoords = this.grid.getCenter(this.x,this.y);
      this.unit.css({"left":Math.floor(boxCoords[0])+"px", "top":Math.floor(boxCoords[1])+"px"});
    } else {
      var health = castle.damage();
      let castleDom = castle.getCastle();
      castleDom.text("Health: " + health);
      if (health < 0) {
        // alert("GAME OVER");
        castleDom.remove();
      }
    }
  }
}
class Match extends Unit {
  constructor(grid){
    super();
    this.grid = grid;
  }
  explode(){
    console.log("exploding");
  }
}
class Straw extends Unit {
  constructor(grid){
    super();
    this.grid = grid;
    this.gridObj = this.grid.getGrid();
  }
  shoot(){
    console.log("shooting");

    var spitball = $("<div>");
    spitball.attr("class","spitball");
    // var boxCoords = this.grid.getCenter(this.x,this.y);
    // spitball.css({"left":Math.floor(boxCoords[0])+"px", "top":Math.floor(boxCoords[1])+"px"});
    this.gridObj[this.x][this.y].append(spitball);

    // boxCoords = this.grid.getCenter(this.x - 1,this.y);
    // $(".spitball").css({"left":Math.floor(boxCoords[0])+"px", "top":Math.floor(boxCoords[1])+"px"});
    this.gridObj[this.x - 1][this.y].append(spitball);
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
  damage(){
    this.health -= 1;
    console.log(this.health);
    return this.health
  }
}
