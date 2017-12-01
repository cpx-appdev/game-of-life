export class Game {
    board: Board;
    renderer: CanvasRenderer;

    run() {
        console.log("Starting Game ...");



        this.board = new Board(300, 300);

        for (let x = 0; x < this.board.width; x++) {
            for (let y = 0; y < this.board.height; y++) {
                const n = Math.floor((Math.random() * 10) + 1);
                if (n < 6) {
                    this.board.setCellAlive(x, y);
                }
            }
        }

        const canvas = <HTMLCanvasElement>document.getElementById("spielfeld");

        this.renderer = new CanvasRenderer(canvas);
        this.tick();
    }

    tick() {
        this.updateState();
        this.renderer.render(this.board);
        requestAnimationFrame(() => this.tick());

    }

    updateState() {
        const futureBoard = new Board(this.board.width, this.board.height);

        for (let x = 0; x < this.board.width; x++) {
            for (let y = 0; y < this.board.height; y++) {
                const amountOfNeighbours = this.board.getAmountOfNeighbours(x, y);

                if (this.board.isCellAlive(x, y)) {
                    // alive
                    if (amountOfNeighbours === 2 || amountOfNeighbours === 3) {
                        futureBoard.setCellAlive(x, y);
                    }
                }
                else {
                    // dead
                    if (amountOfNeighbours === 3) {
                        futureBoard.setCellAlive(x, y);
                    }
                }
            }
        }

        this.board = futureBoard;
    }
}

class Board {

    private cells: boolean[][] = [];

    constructor(public width: number, public height: number) { }

    isCellAlive(x: number, y: number): boolean {
        if (this.cells[x]) {
            if (this.cells[x][y]) {
                return true;
            }
        }
        return false;
    }

    setCellAlive(x: number, y: number) {
        if (!this.cells[x]) {
            this.cells[x] = [];
        }
        this.cells[x][y] = true;
    }

    getAmountOfNeighbours(x: number, y: number): number {
        let count = 0;
        if (this.isCellAlive(x - 1, y - 1)) { count++; }
        if (this.isCellAlive(x, y - 1)) { count++; }
        if (this.isCellAlive(x + 1, y - 1)) { count++; }

        if (this.isCellAlive(x - 1, y)) { count++; }
        if (count > 3)return count;
        
        if (this.isCellAlive(x + 1, y)) { count++; }
        if (count > 3)return count;
        
        if (this.isCellAlive(x - 1, y + 1)) { count++; }
        if (count > 3)return count;
        
        if (this.isCellAlive(x, y + 1)) { count++; }
        if (count > 3)return count;
        
        if (this.isCellAlive(x + 1, y + 1)) { count++; }
        
        //slower
        // for (let ox = x - 1; ox <= x + 1; ox++) {
        //     for (let oy = y - 1; oy <= y + 1; oy++) {
        //         if (ox === x && oy === y) {
        //             continue;
        //         }
        //         if (this.isCellAlive(ox, oy)) {
        //             count++;
        //         }
        //     }
        // }
        return count;
    }
}

class CanvasRenderer {
    frameCounter = 0;
    private cellSize: number = 5;
    context: CanvasRenderingContext2D;
    constructor(private canvas: HTMLCanvasElement) {
        var context = this.canvas.getContext("2d");
        if (context === null) {
            throw new Error();
        }
        this.context = context;
        this.context.strokeStyle = "red";
        this.context.lineWidth = 1;
    }

    render(board: Board) {
        this.context.clearRect(0, 0, board.width * this.cellSize, board.height * this.cellSize);
        this.context.strokeText((++this.frameCounter).toString(), 10, 10);

        for (let x = 0; x < board.width; x++) {
            for (let y = 0; y < board.height; y++) {
                if (board.isCellAlive(x, y)) {
                    this.context.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)
                }
            }
        }

        this.context.stroke();
    }
}