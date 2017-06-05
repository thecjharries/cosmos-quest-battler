import * as Bluebird from "bluebird";
import { Combat, CombatResult } from "./Combat";
import * as constants from "./constants";
import { IPossibleTeam, ISolutions, IWinnerFinderSignature } from "./interfaces";
import { Mob } from "./Mob";
import { Team } from "./Team";

type MobArrayCallback = (type: string, index: number, ...args: any[]) => void;

export class WinnerFinder {
    public solutions: ISolutions = {};
    private opponent: Team;
    private maxCount: number;
    private maxCost: number;
    private minTier: number;
    private maxTier: number;

    public constructor(input: IWinnerFinderSignature) {
        const {
            opponent,
            maxCount = 6,
            maxCost = -1,
            minTier = constants.MIN_TIER,
            maxTier = constants.MAX_TIER,
        } = input;
        this.opponent = opponent;
        this.maxCount = maxCount || 6;
        this.maxCost = maxCost || -1;
        this.minTier = minTier || constants.MIN_TIER;
        this.maxTier = maxTier || constants.MAX_TIER;
        this.validateInput();
    }

    public process(): Bluebird<ISolutions> {
        return this.generateDomain(this.maxCount)
        .then(() => {
            return this.solutions;
        });
    }

    private generateDomain(depth: number): Bluebird<Team[]> {
        if (depth === 1) {
            return this.generateBaseDomain();
        }
        return this.generateDomain(depth - 1)
            .then((previousTier: Team[]) => {
                const possibleTeams: Team[] = previousTier.slice();
                return new Bluebird((resolve, reject) => {
                    this.iterateOverAllMobs((type, index) => {
                        const mob = new Mob({ type, index });
                        const filteredTeams = previousTier.filter((team: Team) => {
                            return this.canAddToTeam(mob, team);
                        });
                        for (const team of filteredTeams) {
                            const possibility = this.tryToAddToTeam(new Mob({ type, index }), team);
                            if (possibility) {
                                possibleTeams.push(possibility as any);
                            }
                        }
                    });
                    return resolve(possibleTeams as Team[] || []);
                }).then((teams: any) => {
                    return Bluebird.resolve(teams);
                });
            });
    }

    private validateCount() {
        if (this.maxCount < 1 || this.maxCount > constants.MAX_TEAM_SIZE) {
            throw new Error("Invalid team size");
        }
    }

    private validateTier() {
        if (this.minTier < constants.MIN_TIER || this.maxTier < constants.MIN_TIER) {
            throw new Error(`Minimum tier is ${constants.MIN_TIER}`);
        }
        if (this.minTier > constants.MAX_TIER || this.maxTier > constants.MAX_TIER) {
            throw new Error(`Maximum tier is ${constants.MAX_TIER}`);
        }
        if (this.minTier > this.maxTier) {
            throw new Error("Minimum tier must be less than or equal to maximum tier");
        }
    }

    private validateInput() {
        this.validateCount();
        this.validateTier();
    }

    private canAddToTeam(mob: Mob, team: Team): boolean  {
        return this.maxCost < 0 || team.cost + mob.cost <= this.maxCost;
    }

    private buildFreshTeam(): Team {
        const team = new Team([]);
        team.oppose(this.opponent);
        return team;
    }

    private tryToAddToTeam(mob: Mob, original: Team): Team | boolean {
        const team = original.duplicate();
        if (this.canAddToTeam(mob, team)) {
            team.add(mob);
            return this.tryToFightOpponent(mob, team);
        }
        return false;
    }

    private insertSolution(team: Team) {
        if (!this.solutions[team.count]) {
            this.solutions[team.count] = {
                max: team,
                min: team,
            };
        }
        if (this.solutions[team.count].max.cost < team.cost) {
            this.solutions[team.count].max = team;
        }
        if (this.solutions[team.count].min.cost > team.cost) {
            this.solutions[team.count].min = team;
        }
    }

    private tryToFightOpponent(mob: Mob, team: Team): Team | boolean {
        const verbose = false;
        const battle = new Combat({
            attackingTeam: new Team(mob),
            defendingTeam: team.opponent,
            verbose,
        });
        team.opponent = battle.defendingTeam;
        if (battle.result === CombatResult.Attacker) {
            this.insertSolution(team);
            return false;
        }
        return team;

    }

    private iterateOverAllMobs(callback: MobArrayCallback, ...args: any[]) {
        for (const type of ["A", "W", "F", "E"]) {
            for (let index = this.minTier; index <= this.maxTier; index++) {
                callback(type, index, args);
            }
        }
    }

    private generateBaseDomain(): Bluebird<Team[]> {
        return new Bluebird((resolve, reject) => {
            const possibleTeams: Team[] = [];
            this.iterateOverAllMobs((type, index) => {
                const possibility = this.tryToAddToTeam(new Mob({ type, index }), this.buildFreshTeam());
                if (possibility) {
                    possibleTeams.push(possibility as any);
                }
            });
            return resolve(possibleTeams as Team[]);
        }).then((teams: any) => {
            return teams;
        });
    }

    private compareSolutionsByUnits(a: Team, b: Team) {
        if (a.count !== b.count) {
            return a.count < b.count ? -1 : 1;
        }
        for (let index = 0; index < a.count; index++) {
            if (a.members[index].type !== b.members[index].type) {
                return a.members[index].type < b.members[index].type ? -1 : 1;
            }
            if (a.members[index].reference.index !== b.members[index].reference.index) {
                return a.members[index].reference.index < b.members[index].reference.index ? -1 : 1;
            }
        }
        return 0;
    }

    private compareSolutionsByCost(a: Team, b: Team) {
        if (a.cost !== b.cost) {
            return a.cost < b.cost ? -1 : 1;
        }
        return this.compareSolutionsByUnits(a, b);
    }

}
