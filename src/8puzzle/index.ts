import State from "./State";

const DFS_MAX_LEVEL = 10;
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

const findNextStateDFS = (): State => {
  // Find the next state to operate on for DFS
  let state: State;
  for (let i = 0; i < statesDFS.length; i++) {
    state = statesDFS[i];
    if (!state.expanded) break;
    else statesDFS.splice(i, 1);
  }
  return state!;
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

  if (goalReached) showPath();
  else bfs();
};

let stateToOperateOn: State = uniqueStates[0];
const statesDFS: Array<State> = [stateToOperateOn];

const dfs = () => {
  const newStates: Array<State> = [];
  const possibleMoves = stateToOperateOn.getAllPossibleMoves();

  stateToOperateOn.print("parent");
  possibleMoves.forEach((move, index) => {
    const newState = stateToOperateOn.move(
      move,
      uniqueStates.indexOf(stateToOperateOn)
    );

    newState.print(
      JSON.stringify(newState.cells) === JSON.stringify(goalState.cells)
        ? "complete"
        : undefined
    );

    if (newState.isUnique(uniqueStates)) {
      // Push the unique states to both arrays(one for path, other for next state)
      uniqueStates.push(newState);
      newStates.push(newState);

      if (JSON.stringify(newState.cells) === JSON.stringify(goalState.cells))
        goalReached = true;
    }
  });

  // Add the newly discovered states to statesDFS
  statesDFS.unshift(...newStates);
  stateToOperateOn = findNextStateDFS();

  if (goalReached) showPath();
  else dfs();
};

// bfs();
dfs();
