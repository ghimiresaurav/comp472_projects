import State from "./State";

const goalStatecontent: Array<number | string> = [8, 1, 3, "_", 2, 4, 7, 6, 5];
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

const showPath = () => {
  console.log("\nSHOWING PATH");

  // Find goal state
  let lastIndex: number = uniqueStates.findIndex(
    (elem) => JSON.stringify(elem.cells) === JSON.stringify(goalState.cells)
  );

  const path = [];

  while (true) {
    const prevElem = uniqueStates[lastIndex];
    path.push(prevElem);
    lastIndex = prevElem.parentIndex;
    if (lastIndex === -1) break;
  }

  path.reverse().forEach((elem, index) =>
    elem.print(
      index === 0
        ? // Color code
          "parent"
        : index === path.length - 1
        ? "complete"
        : undefined
    )
  );
};

const bfs = () => {
  const statesToOperateOn = uniqueStates.filter(
    (elem) => elem.level === currentLevel
  );

  statesToOperateOn.forEach((state) => {
    state.print("parent");
    const possibleMoves = state.getAllPossibleMoves();

    possibleMoves.forEach((move) => {
      const newState = state.move(move, uniqueStates.indexOf(state));
      JSON.stringify(newState.cells) === JSON.stringify(goalState.cells) &&
        newState.print("complete");
      // newState.print(
      //   JSON.stringify(newState.cells) === JSON.stringify(goalState.cells)
      //     ? "complete"
      //     : undefined
      // );

      if (newState.isUnique(uniqueStates)) {
        uniqueStates.push(newState);
        if (JSON.stringify(newState.cells) === JSON.stringify(goalState.cells))
          goalReached = true;
      }
    });
  });

  currentLevel++;

  if (goalReached) showPath();
  else bfs();
};

bfs();
