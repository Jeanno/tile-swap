


let BOARD_SIZE = 3;
let positions = [];
let empty = [BOARD_SIZE - 1, BOARD_SIZE - 1];

function updatePos(tile, x, y) {
    tile.style.top = (y * 100) + 'px';
    tile.style.left = (x * 100) + 'px';
}

function genOnClick(id) {
    let c = function(e) {
        console.log(id);
        let pos = positions[id];
        if (Math.abs(empty[0]-pos[0]) + Math.abs(empty[1]-pos[1]) == 1) {
            updatePos(e.toElement, empty[0], empty[1]);
            positions[id] = empty;
            empty = pos;
        }

    };
    return c;
}

function init() {
    let tiles = document.getElementById("tiles");
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (i == 2 && j == 2) {
                break;
            }
            let tile = document.createElement("div");
            tile.className = "tile";
            updatePos(tile, i, j);
            id = i * BOARD_SIZE + j;
            tile.onclick = genOnClick(id);
            positions.push([i, j]);
            tiles.appendChild(tile);

        }
    }
}


init();

