import Cell from "./Cell";

class State {
  cells: Cell[];
  level: number;
  movingCellIndex: number;

  constructor(lvl: number = 0) {
    this.level = lvl;
    this.cells = [
      new Cell(8, "00"),
      new Cell(2, "01"),
      new Cell(5, "02"),
      new Cell(6, "10"),
      new Cell(7, "11"),
      new Cell(3, "12"),
      new Cell(1, "20"),
      new Cell(4, "21"),
      new Cell("_", "22"),
    ];
    this.movingCellIndex = this.cells.findIndex((elem) => elem.content === "_");
    // this.sortCells();
  }

  print() {
    console.log(`\n(${this.level})`);
    let str = "";
    this.cells.forEach((cell, index) => {
      str += `${cell.content} `;
      if ((index + 1) % 3 == 0) {
        console.log(str);
        str = "";
      }
    });
  }

  sortCells() {
    // Sorts cells by their ids
    this.cells.sort((a, b) => parseInt(a.id) - parseInt(b.id));
  }

  move(dir: string) {
    if (dir !== "up" && dir !== "down" && dir !== "left" && dir !== "right")
      return console.log("invalid direction");

    const movingCell = this.cells[this.movingCellIndex];
    if (!movingCell.canMove(dir)) return;

    // Find the cell to swap with the moving cell
    const cellToSwapWith = movingCell.findCellToSwapWith(dir);

    console.log("moving ", dir, cellToSwapWith);
    // console.log(this);
    // Swap ids
    const temp = movingCell.id;
    movingCell.id = cellToSwapWith.id;
    this.cells[cellToSwapWith.index].id = temp;

    this.movingCellIndex = cellToSwapWith.index;
    this.sortCells();
  }
}

const state = new State();

state.print();
state.move("up");
state.print();
state.move("up");
state.print();
state.move("left");
state.print();

export default State;
