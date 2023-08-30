const ELEMENTS_IN_A_ROW = 3;

class Cell {
  content: number | string;
  id: string;

  constructor(c: number | string, id: string) {
    this.content = c;
    this.id = id;
  }

  canMove(dir: string): boolean {
    if (typeof this.content === "number") return false;

    const splitId = this.id.split("");
    const [a, b] = [parseInt(splitId[0]), parseInt(splitId[1])];

    if (
      (a === 0 && dir === "up") ||
      (a === 2 && dir === "down") ||
      (b === 0 && dir === "left") ||
      (b === 2 && dir === "right")
    )
      return false;

    return true;
  }

  findCellToSwapWith(dir: string) {
    const splitId = this.id.split("");
    const [a, b] = [parseInt(splitId[0]), parseInt(splitId[1])];
    if (dir === "up")
      return { id: `${a - 1}${b}`, index: (a - 1) * ELEMENTS_IN_A_ROW + b };
    else if (dir === "down")
      return { id: `${a + 1}${b}`, index: (a + 1) * ELEMENTS_IN_A_ROW + b };
    else if (dir === "right")
      return { id: `${a}${b + 1}`, index: a * ELEMENTS_IN_A_ROW + b + 1 };
    else dir === "left";
    return { id: `${a}${b - 1}`, index: a * ELEMENTS_IN_A_ROW + b - 1 };
  }
}

export default Cell;
