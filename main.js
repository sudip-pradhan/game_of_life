console.log('hello world') //for luck

var cell_width;
var columns;
var rows;
var display_board;
var board;
var next;
var drw = 1;          // draw variable, 0 to erase, 1 to draw
var reset_flag = 1;
var start_flag = 0;
var steps = -1;       // negative for infinite 

var button1 = document.getElementById("input_button1");
var button2 = document.getElementById("input_button2");
var button3 = document.getElementById("input_button3");
var button4 = document.getElementById("input_button4");
var button5 = document.getElementById("input_button5");
button1.addEventListener('click', () => drw = 0);
button2.addEventListener('click', () => drw = 1);
button3.addEventListener('click', () => reset_flag = 1);
button4.addEventListener('click', () => start_flag = 1);
button5.addEventListener('click', () => steps = window.prompt("Enter number of steps (default infinite steps) enter a negitive number for infinite steps: "));


function setup() {
  // to draw cells on

  var width = 1300;
  var height = 500;

  createCanvas(width, height);

  // width and height of each cell
  cell_width = 20;
  // Calculate columns and rows
  columns = floor(width / cell_width);
  rows = floor(height / cell_width);

  // one array to display active cells and two bigger array to calculate the present and next states
  display_board = new Array(columns);
  for (let i = 0; i < columns; i++) {
    display_board[i] = new Array(rows);
  }

  next = new Array(columns + 20);
  board = new Array(columns + 20);
  for (i = 0; i < columns + 20; i++) {
    next[i] = new Array(rows + 20);
    board[i] = new Array(rows + 20);
  }
  init(); // function to initialize 
}


// function to draw cells on canvas
function draw() {
  background(255);

  // initialize if reset_flag is set
  if (reset_flag) {
    init();
    reset_flag = 0;
  }

  //function to draw input
  draw_input();

  if (start_flag && steps != 0) {
    //sleep(1000); //function for delay between states

    //function to generate next state
    generate();
    if (steps > 0) steps--;
  }

  //to copy states from computation board to display board
  for (let x = 10; x < columns + 10; x++) {
    for (let y = 10; y < rows + 10; y++) {
      display_board[x - 10][y - 10] = board[x][y];
    }
  }

  // to display cells on screen
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if ((display_board[i][j] == 1)) fill(0, 255, 255); // blue if alive
      else fill(255);                                    // white if dead
      stroke(0);
      rect((i) * cell_width, (j) * cell_width, cell_width - 1, cell_width - 1);
    }
  }

}
// function to initalize 
function init() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      display_board[i][j] = 0;
    } 
  }

  drw = 1;
  start_flag = 0;
  steps = -1;

  for (let i = 0; i < columns + 20; i++) {
    for (let j = 0; j < rows + 20; j++) {
      board[i][j] = 0;
      next[i][j] = 0;
    }
  }

}

// function to get the next state
function generate() {
  for (let x = 1; x < columns + 19; x++) {
    for (let y = 1; y < rows + 19; y++) {
      // Add up all the states in a 3x3 surrounding grid
      let neighbors = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          neighbors += board[x + i][y + j];
        }
      }

      //subtract current state as we added it while calculating neighbors
      neighbors -= board[x][y];
      // Rules of Life
      if ((board[x][y] == 1) && (neighbors < 2)) next[x][y] = 0;           // Loneliness
      else if ((board[x][y] == 1) && (neighbors > 3)) next[x][y] = 0;      // Overpopulation
      else if ((board[x][y] == 0) && (neighbors == 3)) next[x][y] = 1;     // Reproduction
      else next[x][y] = board[x][y];                                       // rest no change
    }
  }

  // Swap
  let temp = board;
  board = next;
  next = temp;

}
// function for delay
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
// function to take input from screen
function draw_input() {
  canvas.addEventListener('click', function (event) {
    var x_input = event.clientX - canvas.offsetLeft;
    var y_input = event.clientY - canvas.offsetTop;

    board[floor(x_input / cell_width) + 10][floor(y_input / cell_width) + 10] = drw;

    //console.log(num1+" "+floor(x_input / w) + " " + floor(y_input / w)+" "+board[floor(x_input / w)][floor(y_input / w)]);
  }, false);

}