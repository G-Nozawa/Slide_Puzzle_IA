let stateList = [];

function isInList(board){
    for(i = 0; i < stateList.length; i++){
        if(stateList[i].toString() === board.toString()){
            return true;
        }
    }
    return false;
}

function tableCreate(num) {
    let div = document.getElementById("divSolution");
    div.innerHTML = "";
    let table = document.createElement('table');
    table.id = num.toString();
    table.style.border = '1px solid black';
  
    for (let i = 0; i < 3; i++) {
      let tr = tbl.insertRow();
      for (let j = 0; j < 3; j++) {
        let td = tr.insertCell();
        td.appendChild(document.createTextNode(`Cell I${i}/J${j}`));
        td.style.border = '1px solid black';
      }
    }
    body.appendChild(tbl);
}
  

function findEmptySpace(board){
    let i;
    for(i = 0; i < 9; i++){
        if(board[i] == 9){
            return i;
        }
    }
}


//check if the puzzle has been solved
function isSolved(board){
    let i;
    let solved = [1,2,3,4,5,6,7,8,9];
    //check all pieces, but doesn't check the empty space
    return solved.toString() === board.toString();
}

//move piece from the correspondent direction to the empty space (pos)
function movePiece(pos, direction, board){
    let newPos;
    switch(direction){
        //Move the piece to the upper square
        case 0:
            newPos = pos - 3;
            board[pos] = board[newPos];
            board[newPos] = 9;
            break;
        //Move the piece to the lower square
        case 1:
            newPos = pos + 3;
            board[pos] = board[newPos];
            board[newPos] = 9;
            break;
        //Move the piece to the left square
        case 2:
            newPos = pos - 1;
            board[pos] = board[newPos];
            board[newPos] = 9;
            break;
        //Move the piece to the right square
        case 3:
            newPos = pos + 1;
            board[pos] = board[newPos];
            board[newPos] = 9;
            break;
        //This case shouldn't happen, so just end the program
        default:
            console.log("ERROR AT MOVING PIECE");
            exit();
    }
    return newPos;
}

//return an array with all the possible moves of the empty space
function listPossibleMoves(board, emptyPos){
    let possibleMoves = [];
    let i = 0;
    //a move is valid if the piece stays on the board after moving it
    //check if moving up is valid
    if((emptyPos - 3) >= 0){
        possibleMoves.push(0);
    }
    //check if moving down is valid
    if((emptyPos + 3) < 9){
        possibleMoves.push(1);
    }
    //check if moving left is valid
    if( ((emptyPos%3) - 1) >= 0){
        possibleMoves.push(2);
    }
    //check if moving right is valid
    if( ((emptyPos%3) + 1) < 3){
        possibleMoves.push(3);
    }
    return possibleMoves;
}

function calculateDistance(board){
    let i, d = 0;
    for(i = 0; i < 9; i++){
        if(board[i] != 9){
            d += Math.abs(i+1 - board[i]);
        }
    }
    return d;
}

function chooseBoard(possibleBoards, d){
    let i;
    let best = 0;
    //check if all the moves have been tested once
    let possibleMoves = 0, exhausted = 1;
    let lowestDistance = 999;
    for(i = 0; i < possibleBoards.length; i++){
        if(isSolved(possibleBoards[i])){
            return i;
        }
        if(d[i] < lowestDistance){
            if(!isInList(possibleBoards[i])){
                best = i;
                lowestDistance = d[i];
                exhausted = 0;
            }
        }
        possibleMoves++;
    }
    //if all moves have been tested, choose a random possible move
    if(exhausted){
        best = Math.floor(Math.random()*possibleMoves);
        //printf("position has been exhausted, choosing random position %d\n", best);
    }
    return best;
}

//get the values in the slide puzzle
function getValues(name) {
    let board = [];
    var table = document.getElementById(name);
    for (var r = 0, n = table.rows.length; r < n; r++) {
        for (var c = 0, m = table.rows[r].cells.length; c < m; c++) {
            board.push(parseInt(table.rows[r].cells[c].innerHTML));
        }
    }
    return board;
}

//display the current values inside the board
function displayBoard(board, name){
    var table = document.getElementById(name);
    console.log(table);
    if(table == null){
        var table = tableCreate(1);
    }
    for (var r = 0, n = table.rows.length; r < n; r++) {
        for (var c = 0, m = table.rows[r].cells.length; c < m; c++) {
            table.rows[r].cells[c].innerHTML = board[3*r + c].toString();
        }
    }
}

function listPossibleBoards(board, possibleBoards){
    let emptyPos = findEmptySpace(board);
    let possibleMoves = listPossibleMoves(board, emptyPos);
    let i;
    for(i = 0; i < possibleMoves.length; i++){
        possibleBoards[i] = [...board];
        movePiece(emptyPos, possibleMoves[i], possibleBoards[i]);
    }
    return possibleBoards;
}

function scrambleBoard(){
    let board = getValues("puzzleTable");
    let j, maxIt = 50;
    for(j = 0; j < maxIt; j++){
        let emptyPos = findEmptySpace(board);
        let possibleBoards = [];
        possibleBoards = listPossibleBoards(board, possibleBoards);
        let randomPos = Math.floor(Math.random()*possibleBoards.length);
        //copy the random movement to the board
        board = possibleBoards[randomPos];
    }
    displayBoard(board, "puzzleTable");
    stateList = [];
    return board;
}

//uses one deep layer to solve the puzzle
function solveOneLayer(){
    let board = getValues("puzzleTable");
    let moveCount = 0;
    stateList.push(board);
    while(!isSolved(board)){
        let possibleBoards = [];
        possibleBoards = listPossibleBoards(board, possibleBoards);
        let d = [];
        for(i = 0; i < possibleBoards.length; i++){
            d.push(calculateDistance(possibleBoards[i]));
        }
        let best = chooseBoard(possibleBoards, d);
        //copy the best solution to the board
        board = possibleBoards[best];
        stateList.push(board);
        moveCount++;
        displayBoard(board, "solutionTable");
    }
    num = document.getElementById("NumberMoves");
    num.setInnerHTML = moveCount.toString();
    stateList = [];
    return moveCount;
}

function solveTwoLayers(){
    let board = getValues("puzzleTable");
    let moveCount = 0;
    stateList.push(board);
    while(!isSolved(board)){
        let possibleBoardsFirstLayer = [];
        let possibleBoardsSecondLayer = [];
        possibleBoardsFirstLayer = listPossibleBoards(board, possibleBoardsFirstLayer);
        let d = [];
        for(i = 0; i < possibleBoardsFirstLayer.length; i++){
            let j;
            possibleBoardsSecondLayer.push(listPossibleBoards(possibleBoardsFirstLayer[i], []));
            for(j = 0; j < possibleBoardsSecondLayer[i].length; j++){
                //get the least distance value from each board
                let temp = calculateDistance(possibleBoardsSecondLayer[i][j]);
                if(j == 0){
                    d[i] = temp;
                }else if(temp < d[i]){
                    d[i] = temp;
                }
            }    
        }
        let best = chooseBoard(possibleBoardsFirstLayer, d);
        //copy the best solution to the board
        board = possibleBoardsFirstLayer[best];
        stateList.push(board);
        moveCount++;
        displayBoard(board, "solutionTable");
    }
    num = document.getElementById("NumberMoves");
    num.setInnerHTML = moveCount.toString();
    stateList = [];
    return moveCount;
}

function calculateMyDistance(board){
    let i, d = 0;
    //Prioritize solving the top and left side, and then solve the lower rigth square  
    for(i = 0; i < 9; i++){
        if(board[i] != 9){
            if(i%3 == 0){
                d += 27*abs(i+1 - board[i]);
            }else if(i < 3){
                d += 27*abs(i+1 - board[i]);
            }else if(i%3 == 1){
                d += 9*abs(i+1 - board[i]);
            }else if(i < 6){
                d += 9*abs(i+1 - board[i]);
            }else{
                d += abs(i+1 - board[i]);
            }
        }
    }
    return d;
}

//2 layer depth search, but the prioritizes the construction of the top and left squares
function solveMyMethod(){
    let board = getValues("puzzleTable");
    let moveCount = 0;
    stateList.push(board);
    while(!isSolved(board)){
        let possibleBoardsFirstLayer = [];
        let possibleBoardsSecondLayer = [];
        possibleBoardsFirstLayer = listPossibleBoards(board, possibleBoardsFirstLayer);
        let d = [];
        for(i = 0; i < possibleBoardsFirstLayer.length; i++){
            let j;
            possibleBoardsSecondLayer.push(listPossibleBoards(possibleBoardsFirstLayer[i], []));
            for(j = 0; j < possibleBoardsSecondLayer[i].length; j++){
                //get the least distance value from each board
                let temp = calculateMyDistance(possibleBoardsSecondLayer[i][j]);
                if(j == 0){
                    d[i] = temp;
                }else if(temp < d[i]){
                    d[i] = temp;
                }
            }    
        }
        let best = chooseBoard(possibleBoardsFirstLayer, d);
        //copy the best solution to the board
        board = possibleBoardsFirstLayer[best];
        stateList.push(board);
        moveCount++;
        displayBoard(board, "solutionTable");
    }
    num = document.getElementById("NumberMoves");
    num.setInnerHTML = moveCount.toString();
    stateList = [];
    return moveCount;
}

