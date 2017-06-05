import {
    Component,
    EventEmitter,
    forwardRef,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChange,
} from "@angular/core";
import { Subscription } from "rxjs/Subscription";

import { IMobReference, ISolutions, IWinnerFinderSignature } from "../../battle/interfaces";
import { Mob, Type } from "../../battle/Mob";
import { Team } from "../../battle/Team";
import { OptionsService } from "../options/service";
import { TeamService } from "../team/service";
import { ISolutionState, SolutionService } from "./service";




@Component({
    selector: "solution",
    // styleUrls: ["./unit.component.css"],
    styles: [],
    templateUrl: "./component.html",
})
export class SolutionComponent implements OnChanges, OnDestroy, OnInit {

    public solutions: { index: number, max: Team, min: Team }[];
    public pendingSolution: boolean = false;
    public failed: boolean = false;
    public solutionOptions: IWinnerFinderSignature;
    private optionsSubscription: Subscription;
    private solutionSubscription: Subscription;

    public constructor(
        @Inject(forwardRef(() => OptionsService)) private optionsService: OptionsService,
        @Inject(forwardRef(() => SolutionService)) private solutionService: SolutionService,
        @Inject(forwardRef(() => TeamService)) private teamService: TeamService,
    ) {
        //
    }

    public ngOnInit() {
        this.solutionSubscription = this.solutionService.solution$.subscribe((state: ISolutionState) => {
            this.pendingSolution = state.running || !state.finished;
            if (state.finished) {
                this.solutions = [];
                for (const key in state.results) {
                    if (state.results.hasOwnProperty(key)) {
                        this.solutions.push({
                            index: parseInt(key, 10),
                            max: state.results[key].max,
                            min: state.results[key].min,
                        });
                    }
                }
                // this.solutions = state.results;
            }
        });
        this.optionsSubscription = this.solutionService.options$.subscribe((options: IWinnerFinderSignature) => {
            this.solutionOptions = options;
        });
    }

    public ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        // console.log(changes);
    }

    public ngOnDestroy() {
        this.solutionSubscription.unsubscribe();
    }
}
