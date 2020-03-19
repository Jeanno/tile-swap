
function aiSolve(positions, boardSize) {
    let visited = new Set();
    let stateQ = new Heap();
    
    let currentState = [];
    for (let i = 0; i < positions.length; i++) {
        let pos = positions[i];
        currentState[pos[0] + pos[1] * BOARD_SIZE] = i;
    }
    let lastPos = positions[positions.length - 1];
    let emptyPos = lastPos[0] + lastPos[1] * BOARD_SIZE;

    // Put current state into queue
    visited.add(currentState.toString());
    stateQ.push({
        state: currentState,
        path: [],
        emptyPos: emptyPos,
    });
    /*
    012
    345
    678
    */
    let adj = [
        [1, 3],
        [0, 2, 4],
        [1, 5],
        [0, 4, 6],
        [1, 3, 5, 7],
        [2, 4, 8],
        [3, 7],
        [4, 6, 8],
        [5, 7],
    ];

    while (true) {
        let ret = false;
        let stateAndPath = stateQ.pop();
        if (!stateAndPath) {
            return null;
        }
        let s = stateAndPath['state'];
        let p = stateAndPath['path'];
        let e = stateAndPath['emptyPos'];
        console.log(s[0], s[1], s[2], "\n",
            s[3], s[4], s[5], "\n",
            s[6], s[7], s[8], "\n-");

        if (ret) {
            return false;
        }

        adj[e].forEach((a) => {
            let newS = s.slice();
            let newP = p.slice();
            
            newS[e] = newS[a];
            newS[a] = s[e];

            let correct = true;
            for (let i = 0; i < newS.length; i++) {
                if (newS[i] != i) {
                    correct = false;
                    break;
                }
            }
            if (correct) {
                return newP;
            }
            
            const sstring = newS.toString(); 
            if (!visited.has(sstring)) {
                visited.add(sstring);
                newP.push(a);
                stateQ.push({
                    state: newS,
                    path: newP,
                    emptyPos: a,
                });
            }
        });
    }
}
