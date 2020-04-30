let tiles = [];
let positions = [];
let started = false;


class GameSettings {    
    constructor() {
        this.boardSize = 4;
    }
    
    getLastTile() {
        return this.boardSize * this.boardSize - 1;
    }

    getPosPercent() {
        return 100 / this.boardSize;
    }

    getBgPosPercent() {
        return 100 / (this.boardSize - 1);
    }
}

let gs = new GameSettings();


class Counter {
    constructor(divId) {
        this.count = 0;
        this.divId = divId;
    }

    reset() {
        this.count = 0;
        document.getElementById(this.divId).innerHTML = '0';
    }

    inc() {
        this.count++;
        document.getElementById(this.divId).innerHTML = this.count;
    }
}
let counter = new Counter('counter');


function isCorrect(positions) {
    for (let i = 0; i < gs.boardSize; i++) {
        for (let j = 0; j < gs.boardSize; j++) {
            let id = i * gs.boardSize + j;
            let pos = positions[id];
            if (pos[0] != j || pos[1] != i) {
                return false;
            }

            if (i == gs.boardSize - 1 && j == gs.boardSize - 1) {
                return true;
            }
        }
    }
    return true;
}


function makeComplete() {
    for (let i = 0; i < gs.boardSize; i++) {
        for (let j = 0; j < gs.boardSize; j++) {

            let id = i * gs.boardSize + j;
            positions[id] = [j, i];
            if (i == gs.boardSize - 1 && j == gs.boardSize - 1) {
                break;
            }
            updatePos(tiles[id], j, i);
        }
    }
}


function updatePos(tile, x, y) {
    const posPercent = gs.getPosPercent();
    tile.style.top = (y * posPercent) + '%';
    tile.style.left = (x * posPercent) + '%';
}


function moveTile(id) {
    let pos = positions[id];
    let empty = positions[gs.getLastTile()];
    if (Math.abs(empty[0]-pos[0]) + Math.abs(empty[1]-pos[1]) == 1) {
        updatePos(tiles[id], empty[0], empty[1]);
        positions[id] = empty;
        positions[gs.getLastTile()] = pos;
        counter.inc()
    }
}



let clickCount = 0;
function genOnClick(id) {
    let c = function(e) {
        if (!started) {
            return;
        }
        clickCount++;
        moveTile(id);
        if (isCorrect(positions)) {
            started = false;
            updatePos(tiles[gs.getLastTile()], gs.boardSize - 1, gs.boardSize - 1);
            setTimeout(complete, 700);
        }
    };
    return c;
}


function complete() {
    tiles[gs.getLastTile()].className = getTileClasses();
}


function randomizeTiles() {
    let shuffle = [];
    for (let i = 0; i < positions.length; i++) {
        shuffle.push(i);
    }
    let x = gs.boardSize - 1;
    let y = gs.boardSize - 1;


    for (let j = 0; j < 10000; j++) {
        let d4 = Math.floor(Math.random() * 4);
        let aid = y * gs.boardSize + x;
        if (d4 == 0) {
            if (x > 0) {
                x--;
                let bid = y * gs.boardSize + x;
                shuffle[aid] = shuffle[bid];
                shuffle[bid] = positions.length - 1;
            }
        } else if (d4 == 1) {
            if (x < gs.boardSize - 1) {
                x++;
                let bid = y * gs.boardSize + x;
                shuffle[aid] = shuffle[bid];
                shuffle[bid] = positions.length - 1;
            }
        } else if (d4 == 2) {
            if (y > 0) {
                y--;
                let bid = y * gs.boardSize + x;
                shuffle[aid] = shuffle[bid];
                shuffle[bid] = positions.length - 1;
            }
        } else if (d4 == 3) {
            if (y < gs.boardSize - 1) {
                y++;
                let bid = y * gs.boardSize + x;
                shuffle[aid] = shuffle[bid];
                shuffle[bid] = positions.length - 1;
            }
        }

    }

    for (let i = 0; i < shuffle.length; i++) {
        let id = shuffle[i];
        let pos = [i % gs.boardSize, Math.floor(i / gs.boardSize)];
        positions[id] = pos;
        updatePos(tiles[id], pos[0], pos[1]);
    }

    // Hide last tile
    tiles[gs.getLastTile()].className = getTileClasses() + " hide";

    started = true;
}


function getTileClasses() {
    return "tile x" + gs.boardSize;
}

function init() {
    const queryString = window.location.search;
    const bg = (new URLSearchParams(queryString)).get("bg");
    let tilesDom = document.getElementById("tiles");
    for (let i = 0; i < gs.boardSize; i++) {
        for (let j = 0; j < gs.boardSize; j++) {
            let tile = document.createElement("div");
            tile.className = getTileClasses();
            updatePos(tile, j, i);
            let id = i * gs.boardSize + j;
            tile.onclick = genOnClick(id);
            positions.push([j, i]);

            const posPercent = gs.getBgPosPercent();
            tile.style.backgroundPosition =
                    (posPercent*j) + '% ' + (posPercent*i) + '%';
            if (bg) {
                tile.style.backgroundImage = 'url("' + bg + '")';
            }
            tilesDom.appendChild(tile);
            tiles.push(tile);
        }
    }
    setTimeout(randomizeTiles, 1500);
}


function movePath(path, idx) {
    if (idx >= path.length) {
        updatePos(tiles[gs.getLastTile()], gs.boardSize - 1, gs.boardSize - 1);
        setTimeout(complete, 700);
        return;
    }
    const targetPos = path[idx];

    for (let i = 0; i < positions.length; i++) {
        const pos = positions[i];
        if (pos[0] + pos[1] * gs.boardSize == targetPos) {
            moveTile(i);
            break;
        }
    }
    setTimeout(function() {
        movePath(path, idx + 1);
    }, 300);
}


function solve() {
    started = false;
    const startMs = new Date().getTime();
    const path = aiSolve(positions, gs.boardSize);
    console.log("AI process time: " + (new Date().getTime() - startMs) + "ms");
    console.log(path);
    if (path.length) {
        movePath(path, 0);
    }
}


window.onload = init;
