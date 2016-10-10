console.log("SCRIPTS LOADED");

/*
current state of the game
-you can lose
-you cannot win
-killing units does not always delete the object and/or the dom element
-the interaction between the elements is unclear and the game will stop
  working when some units die but now when others die

~~~~~~Things to add~~~~~~
- resources
- animations
- less overzelous goals

*/

//I know this is a big no no but I used it as a quick fix...sorry
var enemyObjList = [];

$(function(){
  console.log("DOM LOADED");
  var strawObjList = [];
  var timerId;
  var eraseData = 0;

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

  //timer start stop for debugging purposes
  var startTimer = function(event) {
    if (timerId) {
      return;
    }
    timerId = setInterval(function(){
      if (castle.getHealth() > 0) {
        let eraseObj = new Eraserman(grid);
        let eraseDom = eraseObj.getUnit();
        // eraseDom.data("unitNum",eraseData)
        eraseDom.attr("id","num" + eraseData)

        var yCoord = Math.floor(Math.random() * gridObj[0].length);
        if (gridObj[0][yCoord].children()) {
          yCoord = Math.floor(Math.random() * gridObj[0].length);
        }

        eraseObj.setCoords(0,yCoord);
        gridObj[0][yCoord].append(eraseDom);
        enemyObjList.push(eraseObj)
        eraseData++;
      }
      for (var i = 0; i < enemyObjList.length; i++) {
        enemyObjList[i].march(castle);
      }
      for (var j = 0; j < strawObjList.length; j++) {
        strawObjList[j].shoot();
      }
    }, 1000);
  }
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
    this.health = 5;
  }
  getUnit(){
    return this.unit;
  }
  damage(){
    this.health--;
    if (this.health < 0) {
      this.unit.remove();
      this.unit = null;
    }
  }
  march(castle){
    let gridList = this.grid.getGrid();

    if (this.x != gridList.length - 1) {
      // console.log(String(this.x) + " : " + String(gridList.length - 1));
      if (gridList[this.x + 1][this.y].children()) {
        if (gridList[this.x + 1][this.y].children().attr("class") === "straw") {
          console.log("straw ahead");

          gridList[this.x + 1][this.y].empty();
        } else if (gridList[this.x + 1][this.y].children().attr("class") === "match") {
          console.log("match ahead");
          this.unit.remove();
          this.unit = null;
          gridList[this.x + 1][this.y].empty();
        }

        this.x += 1;
        gridList[this.x][this.y].append(this.unit);
      }
    } else {
      var health = castle.damage();
      let castleDom = castle.getCastle();
      castleDom.text("Health: " + health);

      gridList[this.x][this.y].empty();
      // this.unit = null;
      if (health < 0) {
        castleDom.remove();
        alert("GAME OVER");
        stopTimer();
        // alert("GAME OVER");
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
    this.spitballObj = [];
  }
  shoot(){
    var gridObj = this.grid.getGrid();

    var spitballObj = new Spitball(this.grid);
    var spitballDom = spitballObj.getSpitball();

    spitballObj.setCoords(this.x, this.y);

    var boxCoords = this.grid.getCenter(this.x,this.y);
    gridObj[this.x][this.y].append(spitballDom);

    this.spitballObj.push(spitballObj);
    for (var i = 0; i < this.spitballObj.length; i++) {
      this.spitballObj[i].launch();
    }
  }
}
class Spitball extends Straw {
  constructor(grid){
    super();
    this.grid = grid;
    this.spitball = $("<div>");
    this.spitball.attr("class","spitball");
    this.counter = 0;
  }
  getSpitball(){
    return this.spitball;
  }
  launch(){
    var gridObj = this.grid.getGrid();
    if (this.x - this.counter >= 0) {
      gridObj[this.x - this.counter][this.y].append(this.spitball);
    }
    if (gridObj[this.x - this.counter][this.y].children().attr("class") === 'erase') {

      var str = gridObj[this.x - this.counter][this.y].children().attr("id");
      str = str[str.length - 1];
      enemyObjList.splice(str, 1);

      gridObj[this.x - this.counter][this.y].children().remove();

      this.spitball.remove();
      this.spitball = null;
    } else if (this.x - this.counter < 0){
      this.spitball.remove();
      this.spitball = null;
    }
    this.counter++;
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
  getHealth(){
    return this.health;
  }
  damage(){
    this.health -= 1;
    console.log(this.health);
    return this.health;
  }
}
