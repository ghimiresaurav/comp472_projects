import chalk from "chalk";
const MAX_PASSENGERS = 2;

class Node {
  constructor(lm = 0, lc = 0, rm = 3, rc = 3, lvl = 0, parent) {
    this.lhs = { missionaries: lm, cannibals: lc };
    this.rhs = { missionaries: rm, cannibals: rc };
    this.level = lvl;
    this.isDead = false;
    this.boatOn = this.level % 2 === 0 ? "rhs" : "lhs";
    this.parent = parent;
  }

  createChildNode() {
    return new Node(
      this.lhs.missionaries,
      this.lhs.cannibals,
      this.rhs.missionaries,
      this.rhs.cannibals,
      this.level + 1,
      uniqueStates.indexOf(this)
    );
  }

  travel({ missionaries, cannibals }) {
    if (
      missionaries + cannibals > MAX_PASSENGERS ||
      missionaries + cannibals === 0
    ) {
      console.log("invalid number of passengers");
      return;
    }

    const newNode = this.createChildNode();

    let otherSide = "";
    if (newNode.boatOn === "rhs") otherSide = "lhs";
    else if (newNode.boatOn === "lhs") otherSide = "rhs";

    // Find the sides to add to and subtract from
    const addTo = newNode[newNode.boatOn];
    const subtractFrom = newNode[otherSide];

    // Update as necessary
    subtractFrom.missionaries -= missionaries;
    subtractFrom.cannibals -= cannibals;
    addTo.missionaries += missionaries;
    addTo.cannibals += cannibals;

    newNode.checkDead();

    return newNode;
  }

  checkDead() {
    this.isDead =
      (this.lhs.missionaries > 0 &&
        this.lhs.cannibals > this.lhs.missionaries) ||
      (this.rhs.missionaries > 0 && this.rhs.cannibals > this.rhs.missionaries);
  }

  getPassengersCombinations() {
    const _people = this[this.boatOn];
    let people = {};
    people.missionaries =
      _people.missionaries > MAX_PASSENGERS
        ? MAX_PASSENGERS
        : _people.missionaries;
    people.cannibals =
      _people.cannibals > MAX_PASSENGERS ? MAX_PASSENGERS : _people.cannibals;

    switch (people.missionaries) {
      case 0:
        switch (people.cannibals) {
          case 0:
            return;
          case 1:
            return [{ missionaries: 0, cannibals: 1 }];
          case 2:
            return [
              { missionaries: 0, cannibals: 1 },
              { missionaries: 0, cannibals: 2 },
            ];
        }
      case 1:
        switch (people.cannibals) {
          case 0:
            return [{ missionaries: 1, cannibals: 0 }];
          case 1:
            return [
              { missionaries: 1, cannibals: 0 },
              { missionaries: 0, cannibals: 1 },
              { missionaries: 1, cannibals: 1 },
            ];
        }
      case 2:
        switch (people.cannibals) {
          case 0:
            return [
              { missionaries: 1, cannibals: 0 },
              { missionaries: 2, cannibals: 0 },
            ];
          case 1:
            return [
              { missionaries: 1, cannibals: 0 },
              { missionaries: 2, cannibals: 0 },
              { missionaries: 0, cannibals: 1 },
              { missionaries: 1, cannibals: 1 },
            ];
          case 2:
            return [
              { missionaries: 1, cannibals: 0 },
              { missionaries: 2, cannibals: 0 },
              { missionaries: 0, cannibals: 1 },
              { missionaries: 1, cannibals: 1 },
              { missionaries: 0, cannibals: 2 },
            ];
        }
    }
  }
  print(arg) {
    if (arg === "parent") {
      console.log(
        chalk.yellow(
          `(${this.level})`,
          `${this.lhs.missionaries}M ${this.lhs.cannibals}C`,
          `${this.boatOn === "lhs" ? ".\t\t" : "\t\t."}`,
          `${this.rhs.missionaries}M ${this.rhs.cannibals}C`
        )
      );
      return;
    }
    if (this.isDead)
      console.log(
        chalk.red(
          `(${this.level})`,
          `${this.lhs.missionaries}M ${this.lhs.cannibals}C`,
          `${this.boatOn === "lhs" ? ".\t\t" : "\t\t."}`,
          `${this.rhs.missionaries}M ${this.rhs.cannibals}C`
        )
      );
    else {
      // Complete state
      if (
        this.boatOn === "lhs" &&
        this.lhs.missionaries === goal.lhs.missionaries &&
        this.lhs.cannibals === goal.lhs.cannibals
      ) {
        console.log(
          chalk.green(
            `(${this.level})`,
            `${this.lhs.missionaries}M ${this.lhs.cannibals}C`,
            `${this.boatOn === "lhs" ? ".\t\t" : "\t\t."}`,
            `${this.rhs.missionaries}M ${this.rhs.cannibals}C`
          )
        );
      } else
        console.log(
          `(${this.level})`,
          `${this.lhs.missionaries}M ${this.lhs.cannibals}C`,
          `${this.boatOn === "lhs" ? ".\t\t" : "\t\t."}`,
          `${this.rhs.missionaries}M ${this.rhs.cannibals}C`
        );
    }
  }

  isUnique() {
    const xx = uniqueStates.filter(
      (elem) =>
        elem.boatOn === this.boatOn &&
        elem.rhs.missionaries == this.rhs.missionaries &&
        elem.rhs.cannibals == this.rhs.cannibals
    );
    return xx.length === 0;
  }
}

// Initial State
const rootNode = new Node();
let uniqueStates = [rootNode];

let currentLevel = 0;
let pathShown = false;

// Declare goal
const goal = {
  lhs: { missionaries: 3, cannibals: 3 },
  rhs: { missionaries: 0, cannibals: 0 },
  boatOn: "lhs",
  isDead: false,
};

const showPath = () => {
  console.log("path");
  // Find final state
  const finalState = uniqueStates.find(
    (elem) =>
      !elem.isDead &&
      elem.boatOn === goal.boatOn &&
      elem.lhs.missionaries === goal.lhs.missionaries &&
      elem.lhs.cannibals === goal.lhs.cannibals
  );

  const reversePath = [finalState];
  let lastElem = finalState;

  // Work from the final state to the initial state
  while (lastElem.parent) {
    const parent = uniqueStates[lastElem.parent];
    reversePath.push(parent);
    lastElem = parent;
  }
  reversePath.push(rootNode);

  // Finally show path
  reversePath
    .reverse()
    .forEach((state, index) => state.print(index === 0 ? "parent" : null));

  pathShown = true;
  console.log();
};

const main = () => {
  // Implement BFS
  // Filter out dead states and states not on the same level
  const statesToOperateOn = uniqueStates.filter(
    (elem) => !elem.isDead && elem.level === currentLevel
  );

  statesToOperateOn.forEach((state) => {
    state.print("parent");
    // Find all possible passsengers' combinations
    const passengersCombinations = state.getPassengersCombinations();

    // Each combination of passengers travel to other side
    passengersCombinations.forEach((passengersCombination) => {
      const newState = state.travel(passengersCombination);
      if (newState.isUnique()) {
        // Only add the new state into list of states if it is unique and not dead
        !newState.isDead && uniqueStates.push(newState);
      }
      newState.print();
    });
  });
  currentLevel++;
  console.log();

  // If there are unexpanded, alive states, recurse
  if (statesToOperateOn.length > 0) setTimeout(main, 1000);
  // If there are no new alive nodes, show path to final state
  else if (!pathShown) setTimeout(showPath, 3000);
};

main();
