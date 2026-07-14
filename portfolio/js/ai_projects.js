// =========================================
// CS50 AI Playground
// Tic Tac Toe
// Part 1
// =========================================


// ---------- Constants ----------

const X = "X";
const O = "O";
const EMPTY = null;


// ---------- Game State ----------

let board = [];
let user = null;
let aiTurn = false;


// ---------- HTML ----------

const cells = document.querySelectorAll(".cell");

const playXBtn = document.getElementById("play-x");
const playOBtn = document.getElementById("play-o");

const playerSelection = document.getElementById("player-selection");
const gameArea = document.getElementById("game-area");

const restartBtn = document.getElementById("restart");

const statusText = document.getElementById("game-status");


// =========================================
// Project Tabs
// =========================================

const projectButtons = document.querySelectorAll(".project-btn");

const projectSections = document.querySelectorAll(".project-section");


projectButtons.forEach(button => {

    button.addEventListener("click", () => {

        projectButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        projectSections.forEach(section =>
            section.classList.remove("active-section")
        );

        button.classList.add("active");

        document
            .getElementById(button.dataset.project + "-section")
            .classList.add("active-section");

    });

});


// =========================================
// Initial Board
// =========================================

function initialState() {

    return [

        [EMPTY, EMPTY, EMPTY],

        [EMPTY, EMPTY, EMPTY],

        [EMPTY, EMPTY, EMPTY]

    ];

}


// =========================================
// Start Game
// =========================================

playXBtn.onclick = () => {

    startGame(X);

};

playOBtn.onclick = () => {

    startGame(O);

};



function startGame(side){

    user = side;

    board = initialState();

    aiTurn = false;

    playerSelection.classList.add("hidden");

    gameArea.classList.remove("hidden");

    updateBoard();

    updateStatus();

    checkAITurn();

}



// =========================================
// Draw Board
// =========================================

function updateBoard(){

    cells.forEach(cell=>{

        const r = Number(cell.dataset.row);

        const c = Number(cell.dataset.col);

        cell.textContent = board[r][c] || "";

    });

}



// =========================================
// Update Status
// =========================================

function updateStatus(){

    if(terminal(board)){

        const win = winner(board);

        if(win===null){

            statusText.textContent = "Game Over : Tie.";

        }

        else{

            statusText.textContent =
                `Game Over : ${win} wins.`;

        }

        return;

    }

    const current = player(board);

    if(current===user){

        statusText.textContent =
            `Play as ${user}`;

    }

    else{

        statusText.textContent =
            "Computer thinking...";

    }

}



// =========================================
// User Click
// =========================================

cells.forEach(cell=>{

    cell.addEventListener("click", ()=>{

        if(terminal(board))
            return;

        if(player(board)!==user)
            return;

        const r = Number(cell.dataset.row);

        const c = Number(cell.dataset.col);

        if(board[r][c]!==EMPTY)
            return;

        board = result(board,[r,c]);

        updateBoard();

        updateStatus();

        checkAITurn();

    });

});



// =========================================
// AI Move
// =========================================

function checkAITurn(){

    if(terminal(board))
        return;

    if(player(board)!==user){

        setTimeout(()=>{

            const move = minimax(board);

        if(move !== null){

            board = result(board, move);

        }

        updateBoard();

        updateStatus();

        },500);

    }

}



// =========================================
// Restart
// =========================================

restartBtn.onclick=()=>{

    board=initialState();

    user=null;

    aiTurn=false;

    gameArea.classList.add("hidden");

    playerSelection.classList.remove("hidden");

};


// =========================================
// PART 2
// AI Logic (Translated from Python)
// =========================================


// -----------------------------------------
// Returns current player
// -----------------------------------------

function player(board){

    let x = 0;
    let o = 0;

    for(let i=0;i<3;i++){

        for(let j=0;j<3;j++){

            if(board[i][j]===X)
                x++;

            else if(board[i][j]===O)
                o++;

        }

    }

    if(x-o===0)
        return X;

    if(x-o===1)
        return O;

    if(x-o===-1)
        return X;

}



// -----------------------------------------
// Available actions
// -----------------------------------------

function actions(board){

    if(terminal(board))
        return [];

    let free=[];

    for(let i=0;i<3;i++){

        for(let j=0;j<3;j++){

            if(board[i][j]===EMPTY){

                free.push([i,j]);

            }

        }

    }

    return free;

}



// -----------------------------------------
// Result of move
// -----------------------------------------

function result(board,action){

    const copy = board.map(row=>[...row]);

    const r = action[0];
    const c = action[1];

    if(copy[r][c]!==EMPTY){

        throw new Error("Invalid Action");

    }

    copy[r][c]=player(board);

    return copy;

}



// -----------------------------------------
// Winner
// -----------------------------------------

function winner(board){

    // rows

    for(let i=0;i<3;i++){

        if(board[i][0]===X &&
           board[i][1]===X &&
           board[i][2]===X)

            return X;

        if(board[i][0]===O &&
           board[i][1]===O &&
           board[i][2]===O)

            return O;

    }


    // columns

    for(let j=0;j<3;j++){

        if(board[0][j]===X &&
           board[1][j]===X &&
           board[2][j]===X)

            return X;

        if(board[0][j]===O &&
           board[1][j]===O &&
           board[2][j]===O)

            return O;

    }


    // diagonal

    if(

        board[0][0]===X &&
        board[1][1]===X &&
        board[2][2]===X

    )
        return X;

    if(

        board[0][0]===O &&
        board[1][1]===O &&
        board[2][2]===O

    )
        return O;


    if(

        board[0][2]===X &&
        board[1][1]===X &&
        board[2][0]===X

    )
        return X;


    if(

        board[0][2]===O &&
        board[1][1]===O &&
        board[2][0]===O

    )
        return O;

    return null;

}



// -----------------------------------------
// Terminal
// -----------------------------------------

function terminal(board){

    if(winner(board)!==null)
        return true;

    for(let i=0;i<3;i++){

        for(let j=0;j<3;j++){

            if(board[i][j]===EMPTY)
                return false;

        }

    }

    return true;

}



// -----------------------------------------
// Utility
// -----------------------------------------

function utility(board){

    const win = winner(board);

    if(win===X)
        return 1;

    if(win===O)
        return -1;

    return 0;

}

// =========================================
// PART 3
// Minimax
// =========================================


// -----------------------------------------
// Minimax
// -----------------------------------------

function minimax(board){

    // Same behaviour as your Python version:
    // random first move

    if(JSON.stringify(board) === JSON.stringify(initialState())){

        const i = Math.floor(Math.random()*3);
        const j = Math.floor(Math.random()*3);

        return [i,j];

    }

    if(terminal(board))
        return null;

    const play = player(board);

    const moves = actions(board);

    // Just like your Python code:
    // return the first move whose evaluation
    // equals the board evaluation.

    for(const move of moves){

        if(

            minimaxHelper(result(board, move))

            ===

            minimaxHelper(board)

        ){

            return move;

        }

    }

    // These lines are never reached in practice,
    // but they mirror your original implementation.

    if(play===O)
        return moves[0];

    if(play===X)
        return moves[0];

}



// -----------------------------------------
// Recursive helper
// -----------------------------------------

function minimaxHelper(board){

    if(terminal(board))
        return utility(board);

    const current = player(board);

    if(current===X){

        let MAX = -10000;

        for(const move of actions(board)){

            const child = result(board, move);

            const value = minimaxHelper(child);

            MAX = Math.max(MAX, value);

        }

        return MAX;

    }

    else{

        let MIN = 10000;

        for(const move of actions(board)){

            const child = result(board, move);

            const value = minimaxHelper(child);

            MIN = Math.min(MIN, value);

        }

        return MIN;

    }

}

/*====================================================
                MINESWEEPER
====================================================*/

// ----------------------------------------------------
// Constants
// ----------------------------------------------------

const MS_HEIGHT = 8;
const MS_WIDTH = 8;
const MS_MINES = 8;


// ----------------------------------------------------
// Assets
// ----------------------------------------------------

const FLAG_IMG = "images/flag.png";
const MINE_IMG = "images/mine.png";


// ----------------------------------------------------
// HTML
// ----------------------------------------------------

const msBoard = document.getElementById("minesweeper-board");

const aiMoveBtn = document.getElementById("ai-move-btn");

const resetMSBtn = document.getElementById("reset-minesweeper");

const gameResult = document.getElementById("game-result");

const knowledgeBox = document.getElementById("knowledge-list");

const minesCount = document.getElementById("mines-count");


// ----------------------------------------------------
// Game State
// ----------------------------------------------------

let msGame = null;
let msAI = null;

let revealed = new Set();

let flags = new Set();

let lost = false;


// ====================================================
// Helpers
// ====================================================

function key(r,c){

    return `${r},${c}`;

}

function parseKey(str){

    return str.split(",").map(Number);

}

function syncAIMines(){

    if(!msAI || !msGame)
        return;

    for(const mine of msAI.mines){

        if(revealed.has(mine))
            continue;

        flags.add(mine);

        msGame.minesFound.add(mine);

    }

}

function isMinesweeperOver(){

    return lost || (msGame && msGame.won());

}


// ====================================================
// Generate Board
// ====================================================

function generateBoard(){

    msBoard.innerHTML="";

    for(let i=0;i<MS_HEIGHT;i++){

        for(let j=0;j<MS_WIDTH;j++){

            const cell=document.createElement("div");

            cell.className="ms-cell ms-hidden";

            cell.dataset.row=i;

            cell.dataset.col=j;

            // left click

            cell.addEventListener("click",()=>{

                revealCell(i,j);

            });

            // right click

            cell.addEventListener("contextmenu",(e)=>{

                e.preventDefault();

                toggleFlag(i,j);

            });

            msBoard.appendChild(cell);

        }

    }

}
function revealCell(r,c){

    if(isMinesweeperOver())
        return;

    const id=key(r,c);

    if(flags.has(id))
        return;

    if(revealed.has(id))
        return;

    if(msGame.isMine([r,c])){

        lost=true;

        drawBoard();

        return;

    }

    const count=msGame.nearbyMines([r,c]);

    revealed.add(id);

    // AI hook (implemented later)

    if(msAI){

        msAI.addKnowledge([r,c],count);

        syncAIMines();

    }

    drawBoard();

}
function toggleFlag(r,c){

    if(isMinesweeperOver())
        return;

    const id=key(r,c);

    if(revealed.has(id))
        return;

    if(msAI && msAI.mines.has(id))
        return;

    if(flags.has(id)){

        flags.delete(id);

        msGame.minesFound.delete(id);

    }
    else{

        flags.add(id);

        msGame.minesFound.add(id);

    }

    drawBoard();

}
function drawBoard(){

    const cells=document.querySelectorAll(".ms-cell");

    cells.forEach(cell=>{

        const r=Number(cell.dataset.row);

        const c=Number(cell.dataset.col);

        const id=key(r,c);

        cell.innerHTML="";

        cell.className="ms-cell";

        // mine

        if(lost && msGame.isMine([r,c])){

            const img=document.createElement("img");

            img.src=MINE_IMG;

            cell.appendChild(img);

            cell.classList.add("ms-revealed");

            return;

        }

        // flag

        if(flags.has(id)){

            const img=document.createElement("img");

            img.src=FLAG_IMG;

            cell.appendChild(img);

            cell.classList.add("ms-hidden");

            return;

        }

        // hidden

        if(!revealed.has(id)){

            cell.classList.add("ms-hidden");

            return;

        }

        cell.classList.add("ms-revealed");

        const count=msGame.nearbyMines([r,c]);

        cell.textContent=count;

        if(count>0){


            cell.classList.add("number"+count);

        }

    });

    updateGameResult();

}
function updateGameResult(){

    if(lost){

        gameResult.textContent="Lost";

        return;

    }

    if(msGame && msGame.won()){

        gameResult.textContent="Won";

        return;

    }

    gameResult.textContent="";

}
function updateMineCount(){

    if(!minesCount || !msGame)
        return;

    minesCount.textContent = `Mines: ${MS_MINES}`;

}
function resetMinesweeper(){

    revealed.clear();

    flags.clear();

    lost=false;

    msGame=new Minesweeper();

    msAI=new MinesweeperAI();

    generateBoard();

    updateMineCount();

    drawBoard();

}

/*====================================================
            MINESWEEPER GAME ENGINE
====================================================*/

class Minesweeper {

    constructor(height = 8, width = 8, mines = 8) {

        this.height = height;
        this.width = width;

        this.mines = new Set();

        this.board = [];

        // Create empty board
        for (let i = 0; i < this.height; i++) {

            let row = [];

            for (let j = 0; j < this.width; j++) {

                row.push(false);

            }

            this.board.push(row);

        }

        // Randomly place mines
        while (this.mines.size < mines) {

            let i = Math.floor(Math.random() * height);
            let j = Math.floor(Math.random() * width);

            let id = key(i, j);

            if (!this.mines.has(id)) {

                this.mines.add(id);

                this.board[i][j] = true;

            }

        }

        // Same as Python
        this.minesFound = new Set();

    }



    // =====================================
    // Is Mine
    // =====================================

    isMine(cell) {

        let r = cell[0];
        let c = cell[1];

        return this.board[r][c];

    }



    // =====================================
    // Nearby Mines
    // =====================================

    nearbyMines(cell) {

        let count = 0;

        let r = cell[0];
        let c = cell[1];

        for (let i = r - 1; i <= r + 1; i++) {

            for (let j = c - 1; j <= c + 1; j++) {

                if (i === r && j === c)
                    continue;

                if (
                    i >= 0 &&
                    i < this.height &&
                    j >= 0 &&
                    j < this.width
                ) {

                    if (this.board[i][j]) {

                        count++;

                    }

                }

            }

        }

        return count;

    }



    // =====================================
    // Won?
    // =====================================

    won() {

        if (this.minesFound.size !== this.mines.size)
            return false;

        for (const mine of this.mines) {

            if (!this.minesFound.has(mine))
                return false;

        }

        return true;

    }



    // =====================================
    // Debug
    // =====================================

    printBoard() {

        console.clear();

        for (let i = 0; i < this.height; i++) {

            let row = "";

            for (let j = 0; j < this.width; j++) {

                row += this.board[i][j] ? "X " : ". ";

            }

            console.log(row);

        }

    }

}

/*====================================================
                SENTENCE
====================================================*/

class Sentence {

    constructor(cells, count){

        this.cells = new Set(cells);

        this.count = count;

    }

    // =====================================
    // String
    // =====================================

    toString(){

        return `{ ${[...this.cells].join(", ")} } = ${this.count}`;

    }

    // =====================================
    // Known Mines
    // =====================================

    knownMines(){

        if(this.cells.size === this.count){

            return new Set(this.cells);

        }

        return new Set();

    }

    // =====================================
    // Known Safes
    // =====================================

    knownSafes(){

        if(this.count === 0){

            return new Set(this.cells);

        }

        return new Set();

    }

    // =====================================
    // Mark Mine
    // =====================================

    markMine(cell){

        if(this.cells.has(cell)){

            this.cells.delete(cell);

            this.count--;

        }

    }

    // =====================================
    // Mark Safe
    // =====================================

    markSafe(cell){

        if(this.cells.has(cell)){

            this.cells.delete(cell);

        }

    }

}
function renderKnowledge(){

    if(!knowledgeBox || !msAI){

        if(knowledgeBox)
            knowledgeBox.textContent="";

        return;

    }

    if(msAI.knowledge.length===0){

        knowledgeBox.textContent="Knowledge Base Empty";

        return;

    }

    knowledgeBox.innerHTML="";

    msAI.knowledge.forEach(sentence=>{

        const div=document.createElement("div");

        div.textContent=sentence.toString();

        knowledgeBox.appendChild(div);

    });

}

/*====================================================
                MINESWEEPER AI
====================================================*/

class MinesweeperAI {

    constructor(height = 8, width = 8) {

        this.height = height;
        this.width = width;

        // Same as Python
        this.movesMade = new Set();

        this.mines = new Set();

        this.safes = new Set();

        this.knowledge = [];

    }


    // =====================================
    // Mark Mine
    // =====================================

    markMine(cell) {

        if (this.mines.has(cell))
            return;

        this.mines.add(cell);

        for (const sentence of this.knowledge) {

            sentence.markMine(cell);

        }

    }


    // =====================================
    // Mark Safe
    // =====================================

    markSafe(cell) {

        if (this.safes.has(cell))
            return;

        this.safes.add(cell);

        for (const sentence of this.knowledge) {

            sentence.markSafe(cell);

        }

    }


    // =====================================
    // Get Neighbours
    // =====================================

    neighbours(cell) {

        const r = cell[0];
        const c = cell[1];

        let neighbours = [];

        for (let i = r - 1; i <= r + 1; i++) {

            for (let j = c - 1; j <= c + 1; j++) {

                if (i === r && j === c)
                    continue;

                if (
                    i >= 0 &&
                    i < this.height &&
                    j >= 0 &&
                    j < this.width
                ) {

                    neighbours.push([i, j]);

                }

            }

        }

        return neighbours;

    }
    // =====================================
    // Add Knowledge
    // =====================================

    addKnowledge(cell, count) {

        const current = key(cell[0], cell[1]);

        this.movesMade.add(current);

        this.markSafe(current);

        const neighbours = [];

        let tempCount = count;

        for (const n of this.neighbours(cell)) {

            const id = key(n[0], n[1]);

            if (this.mines.has(id)) {

                tempCount--;

                this.markMine(id);

                continue;

            }

            if (this.safes.has(id)) {

                this.markSafe(id);

                continue;

            }

            neighbours.push(id);

        }

        const sentence = new Sentence(

            neighbours,

            tempCount

        );

        this.knowledge.push(sentence);

        this.applyKnownFacts();

        const combinations = [];

        const knowledgeCopy = [...this.knowledge];

        for (let i = 0; i < knowledgeCopy.length; i++) {

            for (let j = i + 1; j < knowledgeCopy.length; j++) {

                combinations.push([knowledgeCopy[i], knowledgeCopy[j]]);

            }

        }

        for (const pair of combinations) {

            let smaller = null;

            let larger = null;

            if (

                pair[0] !== pair[1] &&

                pair[0].cells.size > 0 &&

                pair[1].cells.size > 0 &&

                this.knowledge.includes(pair[0]) &&

                this.knowledge.includes(pair[1])

            ) {

                if (this.isProperSubset(pair[0].cells, pair[1].cells)) {

                    smaller = pair[0];

                    larger = pair[1];

                }
                else if (this.isProperSubset(pair[1].cells, pair[0].cells)) {

                    smaller = pair[1];

                    larger = pair[0];

                }

            }

            if (!smaller || !larger)
                continue;

            const difference = [];

            for (const item of larger.cells) {

                if (!smaller.cells.has(item))
                    difference.push(item);

            }

            const newSentence = new Sentence(

                difference,

                larger.count - smaller.count

            );

            if (newSentence.count === 0 && newSentence.cells.size >= 1) {

                for (const safe of newSentence.cells)
                    this.markSafe(safe);

            }
            else if (newSentence.count === newSentence.cells.size) {

                for (const mine of newSentence.cells)
                    this.markMine(mine);

            }

            this.knowledge = this.knowledge.filter(item => item !== larger);

            this.knowledge.push(newSentence);

        }

        this.applyKnownFacts();

        this.knowledge = this.knowledge.filter(

            s => s.cells.size > 0

        );

        renderKnowledge();

    }
    applyKnownFacts() {

        for (const sentence of [...this.knowledge]) {

            for (const mine of sentence.knownMines()) {

                if (!this.mines.has(mine))
                    this.markMine(mine);

            }

            for (const safe of sentence.knownSafes()) {

                if (!this.safes.has(safe))
                    this.markSafe(safe);

            }

        }

    }
    isProperSubset(a, b) {

        if (a.size >= b.size)
            return false;

        for (const item of a) {

            if (!b.has(item))
                return false;

        }

        return true;

    }
    // =====================================
    // Safe Move
    // =====================================

    makeSafeMove() {

        for (const safe of this.safes) {

            if (

                !this.movesMade.has(safe) &&

                !revealed.has(safe) &&

                !flags.has(safe)

            ) {

                return safe;

            }

        }

        return null;

    }


    // =====================================
    // Random Move
    // =====================================

    makeRandomMove() {

        let choices = [];

        for (let i = 0; i < this.height; i++) {

            for (let j = 0; j < this.width; j++) {

                const id = key(i, j);

                if (

                    !this.movesMade.has(id) &&

                    !this.mines.has(id) &&

                    !revealed.has(id) &&

                    !flags.has(id)

                ) {

                    choices.push(id);

                }

            }

        }

        if (choices.length === 0)
            return null;

        return choices[

            Math.floor(Math.random() * choices.length)

        ];

    }

}

aiMoveBtn.onclick = () => {

    if (isMinesweeperOver())
        return;

    let move = msAI.makeSafeMove();

    if (move === null) {

        move = msAI.makeRandomMove();

    }

    if (move === null)
        return;

    const [r, c] = parseKey(move);

    revealCell(r, c);

};
resetMSBtn.onclick=()=>{

    resetMinesweeper();

};
resetMinesweeper();
