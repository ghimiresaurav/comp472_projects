import State from "./State";

const goalStatecontent: Array<number | string> = [1, "_", 2, 8, 4, 3, 7, 6, 5];
const goalState = new State(goalStatecontent);

const initialStateContent: Array<number | string> = [
  1,
  2,
  3,
  8,
  "_",
  4,
  7,
  6,
  5,
];
const state = new State(initialStateContent);

const uniqueStates: Array<State> = [state];
let currentLevel: number = 0;
let goalReached: Boolean = false;

const bfs = () => {
  // const statesToOperateOn = uniqueStates;
  const statesToOperateOn = uniqueStates.filter(
    (elem) => elem.level === currentLevel
  );

  statesToOperateOn.forEach((state) => {
    state.print("parent");
    const possibleMoves = state.getAllPossibleMoves();

    possibleMoves.forEach((move) => {
      const newState = state.move(move);
      newState.print(
        JSON.stringify(newState.cells) === JSON.stringify(goalState.cells)
          ? "complete"
          : undefined
      );

      if (newState.isUnique(uniqueStates)) {
        uniqueStates.push(newState);
        if (JSON.stringify(newState.cells) === JSON.stringify(goalState.cells))
          goalReached = true;
      }
    });
  });

  currentLevel++;

  if (!goalReached) setTimeout(bfs, 1000);
  else return;
};

bfs();
