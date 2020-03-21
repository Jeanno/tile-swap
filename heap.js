// min heap implementation

class Heap {
    constructor(cmpFunc) {
        this.ary = [];
        this.cmpFunc = cmpFunc;
    }


    push(elem) {
        this.ary.push(elem);
        this.bubbleUp();
    }


    pop() {
        if (!this.ary.length) {
            return null;
        }
        const ret = this.ary[0];
        const bottom = this.ary.pop();
        if (this.ary.length) {
            this.ary[0] = bottom;
            this.bubbleDown();
        }
        return ret;
    }


    bubbleUp() {
        let currI = this.ary.length - 1;
        while (currI > 0) {
            const nextI = Math.floor((currI + 1) / 2) - 1;
            const currElem = this.ary[currI];
            const nextElem = this.ary[nextI];
            if (this.cmpFunc(currElem, nextElem) < 0) {
                this.ary[nextI] = currElem;
                this.ary[currI] = nextElem;
                currI = nextI;
            } else {
                break;
            }
        }
    }


    bubbleDown() {
        let currI = 0;
        let leftI = (currI + 1) * 2 - 1;
        while (leftI < this.ary.length) {
            const curr = this.ary[currI];
            const left = this.ary[leftI];
            const rightI = leftI + 1;
            const right = (rightI < this.ary.length) ? this.ary[rightI] : null;

            if (this.cmpFunc(curr, left) < 0) {
                if (right !== null && this.cmpFunc(curr, right) > 0) {
                    // Swap
                    this.ary[currI] = right;
                    this.ary[rightI] = curr;
                    currI = rightI;
                } else {
                    break;
                }
            } else {
                if (right !== null && this.cmpFunc(left, right) > 0) {
                    // Swap right
                    this.ary[currI] = right;
                    this.ary[rightI] = curr;
                    currI = rightI;
                } else {
                    // Swap left
                    this.ary[currI] = left;
                    this.ary[leftI] = curr;
                    currI = leftI;
                }
            }
            leftI = (currI + 1) * 2 - 1;
        }
    }
}



const heap = new Heap(function(a, b) {
    if (a > b) {
        return 1;
    } else {
        return -1;
    }
});

heap.push(1);
console.assert(heap.pop() == 1);


heap.push(-20);
heap.push(100);
heap.push(101);
heap.push(102);
heap.push(-1);
heap.push(20);
heap.push(103);
heap.push(1);
console.assert(heap.pop() == -20);
console.assert(heap.pop() == -1);
console.assert(heap.pop() == 1);
console.assert(heap.pop() == 20);
console.assert(heap.pop() == 100);
console.assert(heap.pop() == 101);
console.assert(heap.pop() == 102);
console.assert(heap.pop() == 103);
