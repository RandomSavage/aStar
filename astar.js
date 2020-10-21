// A* or f(n) = g(n) + h(n)

// const { NO_COLOR_PATTERN } = require("karma/lib/constants");

// const { deflateRaw } = require("zlib"); WTF
function removeFromArray(array, element) {
  // going backwards so no element is skipped
  for(let i = array.length - 1; i >= 0; i--){
    if(array[i] == element) {
      array.splice(i, 1);
    }
  }
}

function heuristic(a, b) {
  //euclidean distance
  // var d = dist(a.i, a.j, b.i, b.j);
  // taxi_cab or manhattan distance which is difference btwn x and y
  let d = abs(a.i - b.i) + abs(a.j - b.j);
  return d;
}

var cols = 25;
var rows = 25;
var grid = new Array(cols);

var openSet = [];
var closedSet = [];
var start;
var end;
var w, h;
var path = [];
var nosolution = false;

function Spot(i, j) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;
  this.wall = false;

  //creates obstacles and you can increase the obstacle count with the second number in the iff
  if(random(1) < 0.4){
    this.wall = true;
  }


  this.show = function(col) {
    fill(col);
    if(this.wall){
      fill(0);
    }
    noStroke();
    rect(this.i * w, this.j * h, w - 1, h - 1);
  }

  this.addNeighbors = function(grid) {
    var i = this.i;
    var j = this.j;
    // these are the four neighbors within a grid
    if(i < cols - 1){
      this.neighbors.push(grid[i + 1][j]);
    }
    
    if(i > 0){
      this.neighbors.push(grid[i - 1][j]);
    }
    
    if(j < rows - 1){
      this.neighbors.push(grid[i][j + 1]);
    }
    
    if(j > 0){
      this.neighbors.push(grid[i][j - 1]);
    }
  }
}


function setup() {
  createCanvas(400, 400);
  console.log('A*');
  w = width / cols;
  h = height / rows;


//making a 2d array
for(let i = 0; i < cols; i++) {
  grid[i] = new Array(rows);
}

for(let i = 0; i < cols; i++) {
  for(let j = 0; j < rows; j++){
    grid[i][j] = new Spot(i, j);
  }
}

for(let i = 0; i < cols; i++) {
  for(let j = 0; j < rows; j++){
    grid[i][j].addNeighbors(grid);
  }
}

start = grid[0][0];
end = grid[cols - 1][rows - 1];

start.wall = false;
end.wall = false;

openSet.push(start);
// console.log(start)
// console.log(grid);

}

// loop here but this is a p5 example so it uses draw()
function draw() {
  
  if(openSet.length > 0) {
    var lowestIndex = 0;
    for(let i = 0; i < openSet.length; i++) {
      if(openSet[i].f < openSet[lowestIndex].f){
        lowestIndex = i;
      }
      // console.log(lowestIndex)
    }

    var current = openSet[lowestIndex];
    console.log(current);
    if(current === end) {
      // // find the path
      // path = [];
      // let temp = current;
      // path.push(temp);
      // while(temp.previous){
      //   path.push(temp.previous);
      //   temp = temp.previous;
      // }
      noLoop();
      console.log('DONE!');
    }
    //openSet.remove(current); pseudo code.. LOL, no remove method in js
    removeFromArray(openSet, current);
    closedSet.push(current);
    console.log(closedSet)
    var neighbors = current.neighbors;
    for(var i = 0; i < neighbors.length; i++){
      var neighbor = neighbors[i];

      if(!closedSet.includes(neighbor) && !neighbor.wall){
       var tempG = current.g + 1;
       if(openSet.includes(neighbor)){
        if(tempG < neighbor.g){
          neighbor.g = tempG;
         }
        }else{
          neighbor.g = tempG;
          openSet.push(neighbor);
        }
        neighbor.h = heuristic(neighbor, end);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.previous = current;
        // console.log('howdy neighbor');
      }
    }
  } else{
    console.log('No solution');
    nosolution = true;
    noLoop();
    // no solution
  }
  background(0);

  for(var i = 0; i < cols; i++) {
    for(var j = 0; j < rows; j++){
      grid[i][j].show(color(255));
    }
  }

  for(var i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(255, 0, 0));
  }

  for(var i = 0; i < openSet.length; i++) {
    openSet[i].show(color(0, 255, 0));
  }

  // find the path
  if(!nosolution){
    path = [];
    console.log(current);
    var temp = current;
    path.push(temp);
    console.log('yay');
    console.log(temp);
    while(temp.previous){
      path.push(temp.previous);
      temp = temp.previous;
    }
  }
  

  for(let i = 0; i < path.length; i++) {
    path[i].show(color(0, 0, 255));
  }
  const x = "testx";
  // console.log(x);
  // console.log(path[i]);
}


