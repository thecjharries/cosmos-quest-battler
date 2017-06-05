import { forwardRef, Inject, Injectable } from "@angular/core";
import * as Bluebird from "bluebird";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

import { OptionsService } from "../options/service";

import * as constants from "../../battle/constants";
import { ISolutions, IWinnerFinderSignature } from "../../battle/interfaces";
import { Mob, Type } from "../../battle/Mob";
import { Team } from "../../battle/Team";
import { WinnerFinder } from "../../battle/WinnerFinder";

export interface ISolutionState {
    running: boolean;
    finished: boolean;
    results: ISolutions;
}

@Injectable()
export class SolutionService {
    public options$: Observable<IWinnerFinderSignature>;
    public solution$: Observable<ISolutionState>;
    private optionsSource = new Subject<IWinnerFinderSignature>();
    private solutionSource = new Subject<ISolutionState>();


    public constructor(
        @Inject(forwardRef(() => OptionsService)) private optionsService: OptionsService,
    ) {
        this.options$ = this.optionsSource.asObservable();
        this.solution$ = this.solutionSource.asObservable();
    }

    public solve(team: Team): void {
        console.log("starting the hunt");
        const options: IWinnerFinderSignature = {
            maxCost: this.optionsService.maxCost,
            maxCount: this.optionsService.maxParty,
            opponent: this.sanitizeInput(team),
        };
        this.optionsSource.next(options);
        const finder = new WinnerFinder(options);
        this.solutionSource.next({ running: true, finished: false, results: {} });
        finder.process().then((results: ISolutions) => {
            this.solutionSource.next({ running: false, finished: true, results });
            console.log(results);
        });
    }

    private sanitizeInput(team: Team) {
        return new Team(team.members.reduce((fullArray: Mob[], mob: Mob) => {
            if (mob.reference) {
                fullArray.push(mob);
            }
            return fullArray;
        }, []));
    }

}
