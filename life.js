// the BUTTONS
var nextBtn = document.getElementById('nextBtn');
var stopBtn = document.getElementById('stopBtn');
var restartBtn = document.getElementById('restartBtn');
var slider = document.getElementsByTagName('input')[0];
var cellSize = document.getElementById('cellSize');
    
// actions for the buttons
slider.addEventListener('mouseup', ()=>{
    cellSize.innerHTML = 'Cell size: ' + slider.value;

    // reinit the variables
    ROW = slider.value;
    COL = slider.value;
    cols = Math.floor(HEIGHT / slider.value);
    rows = Math.floor(WIDTH / slider.value);

    // start over again
    gen = 0;
    fillGrid();
    loop();
});
nextBtn.addEventListener('click', nextGen);
var stop = false;
stopBtn.addEventListener('click', () => {
    if (stop === true){
        stop = false;
        loop();    
    }
    else if (stop === false)
        stop = true;
});
restartBtn.addEventListener('click', () => {
    gen = 0;
    fillGrid();
    loop();
});

// global variables
var HEIGHT = 600;
var WIDTH = 600;
var cols = Math.floor(HEIGHT / slider.value);
var rows = Math.floor(WIDTH / slider.value);
var ROW = slider.value;
var COL = slider.value;
var gen = 0;
var neighbors = 0;

var grid = createArray(rows);
var mirrorGrid = createArray(rows);

var canvas = document.getElementById('main');
var ctx = canvas.getContext('2d');
ctx.fillStyle = 'black';
                
fillGrid();
loop();

function createArray(rows){
    var arr = [];
    for (var i = 0; i < rows; i++)
        arr[i] = [];

    return arr;
}

// random filling of the grid
function fillGrid(){
    for (var i = 0; i < rows ; i++){
        for (var j = 0; j < cols ; j++){
            rand = Math.floor(Math.random(1) * 2);
            rand === 1 ? grid[i][j] = 1 : grid[i][j] = 0 ;
        }
    }
}

// drawing the grid
function drawGrid() {
    ctx.clearRect(0, 0, HEIGHT, WIDTH); // clear the canvas ahead of each redraw
    for (var j = 1; j < rows-1; j++) // iterate through rows
        for (var k = 1; k < cols-1; k++) //iterate through columns
            if (grid[j][k] === 1)
                ctx.fillRect(j*ROW, k*COL, ROW, COL);
}

function nextGen(){
    gen++;
    for (var i = 1; i < rows - 1; i++)
        for (var j = 1; j < cols - 1; j++){
            // checks for all neighbors in the grid (not the canvas)
            neighbors = 0;
            neighbors+=grid[i][j-1];
            neighbors+=grid[i][j+1];
            neighbors+=grid[i-1][j];
            neighbors+=grid[i-1][j+1];
            neighbors+=grid[i-1][j-1];
            neighbors+=grid[i+1][j];
            neighbors+=grid[i+1][j+1];
            neighbors+=grid[i+1][j-1];

            // check rule conditions for each cell
            // in the active grid
            // apply changes in the mirrorGrid
            if (grid[i][j] === 0){ // if the cell is DEAD
                switch(neighbors){
                    case 3: mirrorGrid[i][j] = 1; // has 3 neighbors, turn it ON
                    break;
                    default: mirrorGrid[i][j] = 0; // otherwise leave it dead
                }
            } else if (grid[i][j] === 1) // if the cell is ALIVE
                switch(neighbors){
                    case 0:
                    case 1: mirrorGrid[i][j] = 0; // dies of loneliness
                    break;
                    case 2:
                    case 3: mirrorGrid[i][j] = 1; // carrieson living
                    break;
                    default: mirrorGrid[i][j] = 0; // dies of overcrowding
                }
        }
        
        //mirror edges to create wraparound effect
        for (var pixel = 1; pixel < rows - 1; pixel++) { //iterate through rows
            //top and bottom
            mirrorGrid[pixel][0] = mirrorGrid[pixel][rows - 3];
            mirrorGrid[pixel][rows - 2] = mirrorGrid[pixel][1];
            //pixel and right
            mirrorGrid[0][pixel] = mirrorGrid[rows - 3][pixel];
            mirrorGrid[rows - 2][pixel] = mirrorGrid[1][pixel];
        }
            
        // copy mirrorGrid to grid
        var temp = grid;
        grid = mirrorGrid;
        mirrorGrid = temp;

        drawGrid();
}

function loop(){
    nextGen();
    drawGrid();
    if (stop===false)
        requestAnimationFrame(loop);
    else
        ;
}


