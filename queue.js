
class Queue {
    constructor() {
        // Double stack implmentation
        this.stackA = [];
        this.stackB = [];
    }

    push(elem) {
        this.stackA.push(elem);
    }

    pop() {
        if (!this.stackB.length) {
            if (!this.stackA.length) {
                return null;
            }

            while (this.stackA.length) {
                this.stackB.push(this.stackA.pop());
            }
        }
        return this.stackB.pop();
    }
}

