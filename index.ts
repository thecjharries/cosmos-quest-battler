import { Combat } from "./src/battle/Combat";
import { Mob } from "./src/battle/Mob";
import { Team } from "./src/battle/Team";
import { WinnerFinder } from "./src/battle/WinnerFinder";
const opponent = new Team([
    new Mob("F1"),
    new Mob("A1"),
    new Mob("F1"),
    new Mob("A1"),
    new Mob("F1"),
    new Mob("A1"),
]);
const maxTier = 3;
const maxCount = 4;
const winner = new WinnerFinder({ opponent , maxTier, maxCount });

// const team = new Team([]);
console.log(winner.solutions);
