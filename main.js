let BOARD_SIZE = 3;
let TILE_SIZE = 150;
let LAST_TILE = BOARD_SIZE * BOARD_SIZE - 1;


let tiles = [];
let positions = [];
let started = false;


function isCorrect() {
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
    tile.style.top = (y * 150) + 'px';
    tile.style.left = (x * 150) + 'px';
}


function genOnClick(id) {
    let c = function(e) {
        if (!started) {
            return;
        }
        let pos = positions[id];
        let empty = positions[LAST_TILE];
        if (Math.abs(empty[0]-pos[0]) + Math.abs(empty[1]-pos[1]) == 1) {
            updatePos(e.toElement, empty[0], empty[1]);
            positions[id] = empty;
            positions[LAST_TILE] = pos;
        }
        if (isCorrect()) {
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
    for (let i = positions.length - 1; i >= 0; i--) {
        let rand = Math.floor(Math.random() * (i + 1));
        let temp = positions[rand];
        positions[rand] = positions[i];
        positions[i] = temp;
        updatePos(tiles[i], temp[0], temp[1]);
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


window.onload = init;
