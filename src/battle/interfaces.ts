import { Mob } from "./Mob";
import { Team } from "./Team";

export interface IMobData {
    hp: number;
    attack: number;
    cost: number;
}

// Have to list all required properties
export interface ITypedMobData {
    1: IMobData;
    2: IMobData;
    3: IMobData;
    4: IMobData;
    5: IMobData;
    [key: number]: IMobData;
}

export interface IMobDefinitions {
    A: ITypedMobData;
    W: ITypedMobData;
    F: ITypedMobData;
    E: ITypedMobData;
    [key: string]: ITypedMobData;
}

export interface IMobReference {
    type: string;
    index: number;
}


export interface ICombatSignature {
    attackingTeam: Team;
    defendingTeam: Team;
    mustReverse?: boolean;
    verbose?: boolean;
}

export interface IFightingPair {
    attacker: Mob;
    defender: Mob;
}

export interface IWinnerFinderSignature {
    opponent: Team;
    maxCount?: number;
    maxCost?: number;
    minTier?: number;
    maxTier?: number;
}

export interface IPossibleTeam {
    team: Team;
    cost: number;
    count: number;
    opponent: Team;
    printable: string;
}

export interface ISolutions {
    [count: number]: {
        max: Team;
        min: Team;
    };
}
