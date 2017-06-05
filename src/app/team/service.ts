import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

import * as constants from "../../battle/constants";
import { IMobReference } from "../../battle/interfaces";
import { Mob, Type } from "../../battle/Mob";
import { Team } from "../../battle/Team";

export interface IUnit {
    type: string;
    index: number;
}

function freshRow() {
    return { index: 0, type: "" };
}

@Injectable()
export class TeamService {
    public timestamp: Date;
    public units: IUnit[] = [];
    public stateChanged$: Observable<any>;
    public team: Team;

    private stateChangeSource = new Subject<{index: number, unit: IUnit}>();

    public constructor() {
        this.timestamp = new Date();
        for (let index = 0; index < constants.MAX_TEAM_SIZE; index++) {
            this.units.push(freshRow());
        }
        this.team = new Team([]);
        this.stateChanged$ = this.stateChangeSource.asObservable();
    }

    public isValid(index: any): boolean {
        return /^([0-3]|[AWFE])$/gi.test(this.units[index].type.toString()) && /^(10|[1-9])$/gi.test(this.units[index].index.toString());
    }

    public setUnit(index: number, value: IMobReference): void {
        const change = (this.units[index].type !== value.type || this.units[index].index !== value.index);
        this.units[index] = { type: Type[value.type as any], index: value.index };
        this.emitStateChange(index, change);
    }

    public setType(index: number, value: string): void {
        const change = this.units[index].type !== value;
        this.units[index].type = value;
        this.emitStateChange(index, change);
    }

    public setIndex(index: number, value: number): void {
        const change = this.units[index].index !== value;
        this.units[index].index = value;
        this.emitStateChange(index, change);
    }

    public clear(index: number) {
        this.units[index] = freshRow();
        this.emitStateChange(index, true);
    }

    private emitStateChange(index: number, change: boolean) {
        if (change) {
            this.updateTeam(index);
            this.stateChangeSource.next({index, unit: this.units[index]});
        }
    }

    public updateTeam(index: number) {
        if (this.isValid(index)) {
            this.team.replace(index, new Mob(({ type: Type[this.units[index].type as any], index: this.units[index].index })));
        }
    }
}
