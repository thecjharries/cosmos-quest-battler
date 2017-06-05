import * as constants from "./constants";
import { IMobData, IMobReference } from "./interfaces";

export enum Type { A, W, F, E }

export type Team = Mob[];

export class Mob {
    public hp: number;
    public attack: number;
    public cost: number;
    public type: Type;
    public reference: IMobReference;

    public constructor(input: string | IMobReference) {
        if (typeof input === "string") {
            this.processName(input);
        } else {
            this.reference = {
                index: input.index,
                type: isNaN(parseInt(input.type, 10)) ? input.type : Type[input.type as any],
            };
        }
        this.validateAndPopulate();
    }

    public attackOpponent(defender: Mob): number {
        return defender.defend(this.attack * ((this.type + 1) % 4 === defender.type ? 1.5 : 1));
    }

    public defend(damage: number): number {
        if (this.isAlive()) {
            this.hp -= damage > this.hp ? this.hp : damage;
        } else {
            throw new Error("Combat's already over, whoops");
        }
        return damage;
    }

    public toString(): string {
        return `${this.reference.type}${this.reference.index}`;
    }

    public isAlive(): boolean {
        return this.hp > 0;
    }

    public isDead(): boolean {
        return this.hp <= 0;
    }

    public duplicate(): Mob {
        const mob = new Mob(this.reference);
        mob.hp = this.hp;
        return mob;
    }

    private determineIndex(name: string): number {
        const index = parseInt(name.replace(/[^\d]/i, ""), 10);
        if (index < 1 || index > 10) {
            throw new Error("Unrecognized mob index");
        }
        return index;
    }

    private determineType(name: string): Type {
        switch (name.replace(constants.INVALID_TYPES_REGEXP, "").toUpperCase()) {
            case "A":
                return Type.A;
            case "W":
                return Type.W;
            case "F":
                return Type.F;
            case "E":
                return Type.E;
            default:
                throw new Error("Unrecognized type");
        }
    }

    private processName(name: string): void {
        this.type = this.determineType(name);
        this.reference = {
            index: this.determineIndex(name),
            type: Type[this.type],
        };
    }

    private assignStatsFromDefinition(definition: IMobData): void {
        this.hp = definition.hp;
        this.attack = definition.attack;
        this.cost = definition.cost;
    }

    private findMob(): any {
        return constants.MOB_DEFINITIONS[this.reference.type][this.reference.index];
    }

    private validateAndPopulate(): void {
        const possibleMob = this.findMob();
        if (possibleMob) {
            this.assignStatsFromDefinition(possibleMob);
        } else {
            throw new Error(`Unable to find mob ${this}`);
        }
    }
}
