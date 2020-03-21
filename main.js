let BOARD_SIZE = 3;
let TILE_SIZE = 150;
let LAST_TILE = BOARD_SIZE * BOARD_SIZE - 1;


let tiles = [];
let positions = [];
let started = false;


function isCorrect(positions) {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            let id = i * BOARD_SIZE + j;
            let pos = positions[id];
            if (pos[0] != j || pos[1] != i) {
                return false;
            }

            if (i == BOARD_SIZE - 1 && j == BOARD_SIZE - 1) {
                return true;
            }
        }
    }
    return true;
}


function makeComplete() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {

            let id = i * BOARD_SIZE + j;
            positions[id] = [j, i];
            if (i == BOARD_SIZE - 1 && j == BOARD_SIZE - 1) {
                break;
            }
            updatePos(tiles[id], j, i);
        }
    }
}


function updatePos(tile, x, y) {
    tile.style.top = (y * 33.333) + '%';
    tile.style.left = (x * 33.333) + '%';
}


function moveTile(id) {
    let pos = positions[id];
    let empty = positions[LAST_TILE];
    if (Math.abs(empty[0]-pos[0]) + Math.abs(empty[1]-pos[1]) == 1) {
        updatePos(tiles[id], empty[0], empty[1]);
        positions[id] = empty;
        positions[LAST_TILE] = pos;
    }
}


function genOnClick(id) {
    let c = function(e) {
        if (!started) {
            return;
        }
        moveTile(id);
        if (isCorrect(positions)) {
            started = false;
            updatePos(tiles[LAST_TILE], BOARD_SIZE - 1, BOARD_SIZE - 1);
            setTimeout(complete, 700);
        }
    };
    return c;
}


function complete() {
    tiles[LAST_TILE].className = "tile";
}


function randomizeTiles() {
    let shuffle = [];
    for (let i = 0; i < positions.length; i++) {
        shuffle.push(i);
    }
    let x = BOARD_SIZE - 1;
    let y = BOARD_SIZE - 1;


    for (let j = 0; j < 5000; j++) {
        let d4 = Math.floor(Math.random() * 4);
        let aid = y * BOARD_SIZE + x;
        if (d4 == 0) {
            if (x > 0) {
                x--;
                let bid = y * BOARD_SIZE + x;
                shuffle[aid] = shuffle[bid];
                shuffle[bid] = positions.length - 1;
            }
        } else if (d4 == 1) {
            if (x < BOARD_SIZE - 1) {
                x++;
                let bid = y * BOARD_SIZE + x;
                shuffle[aid] = shuffle[bid];
                shuffle[bid] = positions.length - 1;
            }
        } else if (d4 == 2) {
            if (y > 0) {
                y--;
                let bid = y * BOARD_SIZE + x;
                shuffle[aid] = shuffle[bid];
                shuffle[bid] = positions.length - 1;
            }
        } else if (d4 == 3) {
            if (y < BOARD_SIZE - 1) {
                y++;
                let bid = y * BOARD_SIZE + x;
                shuffle[aid] = shuffle[bid];
                shuffle[bid] = positions.length - 1;
            }
        }

    }

    for (let i = 0; i < shuffle.length; i++) {
        let id = shuffle[i];
        let pos = [i % BOARD_SIZE, Math.floor(i / BOARD_SIZE)];
        positions[id] = pos;
        updatePos(tiles[id], pos[0], pos[1]);
    }

    // Hide last tile
    tiles[LAST_TILE].className = "tile hide";

    started = true;
}


function init() {
    let tilesDom = document.getElementById("tiles");
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            let tile = document.createElement("div");
            tile.className = "tile";
            updatePos(tile, j, i);
            let id = i * BOARD_SIZE + j;
            tile.onclick = genOnClick(id);
            positions.push([j, i]);

            tile.style.backgroundPosition = (50*j) + '% ' + (50*i) + '%';
            tilesDom.appendChild(tile);
            tiles.push(tile);
        }
    }
    setTimeout(randomizeTiles, 1500);
}


function movePath(path, idx) {
    if (idx >= path.length) {
        updatePos(tiles[LAST_TILE], BOARD_SIZE - 1, BOARD_SIZE - 1);
        setTimeout(complete, 700);
        return;
    }
    const targetPos = path[idx];

    for (let i = 0; i < positions.length; i++) {
        const pos = positions[i];
        if (pos[0] + pos[1] * BOARD_SIZE == targetPos) {
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
    const path = aiSolve(positions, BOARD_SIZE);
    console.log(path);
    movePath(path, 0);
}


window.onload = init;
