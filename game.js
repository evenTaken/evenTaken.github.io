export class Game {

    #rows
    #columns
    #numOfMines
    #gridMeta
    #isGameWon
    #isGameOver

    constructor(height, width, numOfMines, gridId) {
        this.#rows = height;
        this.#columns = width;
        this.#numOfMines = numOfMines;
        this.#gridMeta = [];
        this.buildBoard(gridId);
        this.#isGameWon = false;
        this.#isGameOver = false;
    }

    buildBoard(gridId) {
        const table = document.querySelector(gridId);
        const cellsToBeMined = [];
        for (let rowIndex = 0; rowIndex < this.#rows; rowIndex++) {
            const row = document.createElement('tr');
            table.appendChild(row);
            this.#gridMeta.push([])
            for (let colIndex = 0; colIndex < this.#columns; colIndex++) {
                const cell = document.createElement('td');
                cell.innerText = "⬛";
                cell.dataset.number = 0;
                cell.dataset.bomb = false;
                cell.dataset.revealed = false;
                cell.addEventListener('contextmenu', event => event.preventDefault(), false);
                cell.addEventListener('mousedown', event => {
                  if (event.button === 0) {
                    this.reveal(cell);
                  } else if (event.button === 2) {
                    this.flag(cell);
                  }
                });

                cellsToBeMined.push({ rowIndex, colIndex, cell });
                this.#gridMeta[rowIndex].push(cell);

                row.appendChild(cell);
            }
        }

        cellsToBeMined
            .sort(() => 0.5 - Math.random())
            .slice(0, this.#numOfMines)
            .forEach(cellData => {
                cellData.cell.dataset.bomb = true;
                this.safeIncrement(cellData.rowIndex+1, cellData.colIndex);
                this.safeIncrement(cellData.rowIndex+1, cellData.colIndex+1);
                this.safeIncrement(cellData.rowIndex+1, cellData.colIndex-1);
                this.safeIncrement(cellData.rowIndex-1, cellData.colIndex);
                this.safeIncrement(cellData.rowIndex-1, cellData.colIndex+1);
                this.safeIncrement(cellData.rowIndex-1, cellData.colIndex-1);
                this.safeIncrement(cellData.rowIndex, cellData.colIndex+1);
                this.safeIncrement(cellData.rowIndex, cellData.colIndex-1);
            });
        
        //this.revealAll();
    }

    safeIncrement(row, col) {
      if (row >= this.#rows || col >= this.#columns || row < 0 || col < 0) {
          return;
      }
      this.#gridMeta[row][col].dataset.number++;
    }

    revealAll() {
        this.#gridMeta.forEach(row =>
          row.forEach(cell =>
            this.reveal(cell)))
    }

    reveal(cell) {
        const nums = [ "🟦", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣" ];
        if (cell.dataset.bomb === "true" && this.#isGameWon) {
            cell.innerText = "💣";
        } else if (cell.dataset.bomb === "true") {
            cell.innerText = "💥";
            this.#isGameOver = true;
        } else {
            cell.innerText = nums[cell.dataset.number];
        }

        cell.dataset.revealed = "true";
    }

    flag(cell) {
        if (cell.dataset.revealed === "true") {
            return;
        }
        cell.innerText = "🚩";
    }
}
