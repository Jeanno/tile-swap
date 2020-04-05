function dist(state, boardSize) {
    // Manhattan distance implementation
    let total = 0;
    for (let i = 0; i < state.length; i++) {
        const elem = state[i];
        if (elem == state.length - 1) {
            continue;
        }
        const yDiff = Math.abs(
                Math.floor(i / boardSize) -
                Math.floor(elem / boardSize));
        const xDiff = Math.abs((i % boardSize) - (elem % boardSize));
        total += xDiff + yDiff;
    }

    return total;
}


function stateIsCorrect(state) {
    for (let i = 0; i < state.length; i++) {
        if (state[i] != i) {
            return false;
        }
    }
    return true;
}


function generateAdjList(boardSize) {
    const result = [];
    const len = boardSize * boardSize;
    for (let i = 0; i < boardSize * boardSize; i++) {
        const list = [];
        if (i % boardSize != 0) {
            list.push(i - 1);
        }
        if (i - boardSize >= 0) {
            list.push(i - boardSize);
        }
        if (i % boardSize != boardSize - 1) {
            list.push(i + 1);
        }
        if (i + boardSize < len) {
            list.push(i + boardSize);
        }
        result.push(list);
    }
    return result;
}


function serializeState(state) {
    return state.join('.');
}

function aiSolve(positions, boardSize) {
    let visited = new Set();
    let stateQ = new Heap(function(a, b) {
        /*
        if (a.path.length > b.path.length) {
            return 1;
        }

        if (b.path.length > a.path.length) {
            return -1;
        }*/

        if ((a.dist - b.dist) * (boardSize - 2) + a.path.length > b.path.length) {
            return 1;
        } else {
            return -1;
        }
    });
    
    let currentState = [];
    for (let i = 0; i < positions.length; i++) {
        let pos = positions[i];
        currentState[pos[0] + pos[1] * boardSize] = i;
    }
    let lastPos = positions[positions.length - 1];
    let emptyPos = lastPos[0] + lastPos[1] * boardSize;

    // Put current state into queue
    visited.add(currentState.toString());
    stateQ.push({
        state: currentState,
        path: [],
        emptyPos: emptyPos,
        dist: dist(currentState, boardSize),
    });

    const adj = generateAdjList(boardSize);

    while (true) {
        let ret = null;
        let stateAndPath = stateQ.pop();
        if (!stateAndPath) {
            return null;
        }
        let s = stateAndPath['state'];
        let p = stateAndPath['path'];
        let e = stateAndPath['emptyPos'];
        /*
        console.log("'", s[0], s[1], s[2], "\n",
            s[3], s[4], s[5], "\n",
            s[6], s[7], s[8], "\n-");

        console.log("Dist: " + stateAndPath.dist);
        */
        if (ret) {
            return false;
        }

        const adjelen = adj[e].length
        for (let j = 0; j < adjelen; j++) {
            const a = adj[e][j];
            const newS = s.slice();
            const newP = p.slice();
            
            newS[e] = newS[a];
            newS[a] = s[e];
            
            const sstring = serializeState(newS);
            if (!visited.has(sstring)) {
                visited.add(sstring);
                newP.push(a);

                const correct = stateIsCorrect(newS);
                if (correct) {
                    return newP;
                }

                stateQ.push({
                    state: newS,
                    path: newP,
                    emptyPos: a,
                    dist: dist(newS, boardSize),
                });
            }
        }
    }
}
