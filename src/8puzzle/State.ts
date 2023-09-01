import Cell from "./Cell";
import chalk from "chalk";

class State {
  cells: Cell[] = [];
  level: number;
  movingCellIndex: number;

  constructor(cellContents: Array<number | string>, lvl: number = 0) {
    this.level = lvl;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++)
        this.cells.push(new Cell(cellContents[i * 3 + j], `${i}${j}`));
    }

    this.movingCellIndex = this.cells.findIndex((elem) => elem.content === "_");
  }

  createChildState() {
    // Extract content
    this.sortCells();
    const content: Array<number | string> = [];
    this.cells.forEach((cell) => content.push(cell.content));

    return new State(content, this.level + 1);
  }

  print(arg?: string) {
    console.log(
      arg === "parent"
        ? chalk.yellow(`\n(${this.level})`)
        : arg === "complete"
        ? chalk.green(`\n(${this.level})`)
        : `\n(${this.level})`
    );
    let str = "";
    this.cells.forEach((cell, index) => {
      str += `${cell.content} `;
      if ((index + 1) % 3 == 0) {
        console.log(
          arg === "parent"
            ? chalk.yellow(str)
            : arg === "complete"
            ? chalk.green(str)
            : str
        );
        str = "";
      }
    });
  }

  sortCells() {
    // Sorts cells by their ids
    this.cells.sort((a, b) => parseInt(a.id) - parseInt(b.id));
  }

  move(dir: string) {
    // if (dir !== "up" && dir !== "down" && dir !== "left" && dir !== "right")
    //   return console.log("invalid direction");

    const newState = this.createChildState();

    const movingCell = newState.cells[newState.movingCellIndex];
    // if (!movingCell.canMove(dir)) return;

    // Find the cell to swap with the moving cell
    const cellToSwapWith = movingCell.findCellToSwapWith(dir);

    // Swap ids
    const temp = movingCell.id;
    movingCell.id = cellToSwapWith.id;
    newState.cells[cellToSwapWith.index].id = temp;

    newState.movingCellIndex = cellToSwapWith.index;
    newState.sortCells();

    return newState;
  }

  getAllPossibleMoves(): Array<string> {
    const possibleMoves: Array<string> = [];

    const splitId = this.cells[this.movingCellIndex].id.split("");
    const [a, b] = [parseInt(splitId[0]), parseInt(splitId[1])];

    switch (a) {
      case 0: {
        possibleMoves.push("down");
        break;
      }
      case 1: {
        possibleMoves.push("up", "down");
        break;
      }
      case 2: {
        possibleMoves.push("up");
        break;
      }
    }

    switch (b) {
      case 0:
        possibleMoves.push("right");
        break;

      case 1:
        possibleMoves.push("right", "left");
        break;

      case 2:
        possibleMoves.push("left");
        break;
    }

    const sortedPossibleMoves: Array<string> = [];
    const order: Array<string> = ["left", "up", "down", "right"];

    order.forEach((item) => {
      possibleMoves.includes(item) && sortedPossibleMoves.push(item);
    });

    return sortedPossibleMoves;
  }

  hasSameCellsAs(cells: Array<Cell>) {
    cells.forEach((cell, index) => {
      if (cell.content !== this.cells[index].content) return false;
    });

    return true;
  }

  isUnique(states: Array<State>) {
    const statesInPrevLevels = states.filter(
      (state) => JSON.stringify(state.cells) === JSON.stringify(this.cells)
    );
    // statesInPrevLevels.filter(state);
    return statesInPrevLevels.length === 0;
  }
}

export default State;
