import * as constants from "./constants";
import { Mob } from "./Mob";

export class Team {
    public cost: number = 0;
    public opponent: Team;
    public members: Mob[] = [];
    public maxTier: number = 1;
    private cachedLength: number = 0;
    private cachedToString: string = "";


    public constructor(input: Team | Mob | Mob[] | null) {
        if (input) {
            switch (input.constructor.name.toLowerCase()) {
                case "team":
                    this.buildFromTeam(input as Team);
                    break;
                case "mob":
                    input = [input as Mob];
                // Explicitly falling through
                case "array":
                    this.add(input as Mob[]);
                    break;
                default:
                    // Do nothing;
                    break;
            }
        }
        if (isNaN(this.cost)) {
            throw new Error("nan cost");
        }
    }


    get count(): number {
        return this.members.length;
    }

    get active(): Mob {
        return this.members[0];
    }

    public oppose(team: Team) {
        this.opponent = team.duplicate();
    }

    public add(mobs: Mob | Mob[]) {
        if (!Array.isArray(mobs)) {
            mobs = [mobs];
        }
        for (const mob of mobs) {
            this.members.push(mob.duplicate());
            this.cost += mob.cost;
            this.cachedLength++;
            this.cachedToString += ` ${mob}`;
            this.maxTier = mob.reference.index > this.maxTier ? mob.reference.index : this.maxTier;
        }
    }

    public kill() {
        this.members.splice(0, 1);
    }

    public toString(): string {
        if (this.cachedLength !== this.count) {
            this.cachedToString = "";
            for (const mob of this.members) {
                if (mob) {
                    this.cachedToString += ` ${mob}`;
                }
            }
            this.cachedLength = this.count;
        }
        return this.cachedToString;
    }

    public exposePrivates(): any {
        return {
            cachedLength: this.cachedLength,
            cachedToString: this.cachedToString,
            cost: this.cost,
            maxTier: this.maxTier,
            members: this.members.map((mob: Mob) => mob.duplicate()),
            opponent: this.opponent ? this.opponent.duplicate() : null,
        };
    }

    public duplicate(): Team {
        return new Team(this);
    }

    public replace(index: number, mob: Mob) {
        if (this.members[index]) {
            this.cachedLength = 0;
            this.cost -= this.members[index].cost;
            delete this.members[index];
        }
        this.members[index] = mob;
        this.cost += mob.cost;
        this.maxTier = this.members.reduce((value: number, member: Mob) => {
            return value < member.reference.index ? member.reference.index : value;
        }, 0);
        this.toString();
    }

    private buildFromTeam(team: Team): void {
        const { cachedLength, cachedToString, cost, maxTier, members, opponent } = team.exposePrivates();
        this.cachedLength = cachedLength;
        this.cachedToString = cachedToString;
        this.cost = cost;
        this.maxTier = maxTier;
        this.members = members;
        this.opponent = opponent;
    }
}
