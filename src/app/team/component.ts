import { Component, forwardRef, Inject, OnInit } from "@angular/core";
import { Subscription } from "rxjs/Subscription";

import { OptionsService } from "../options/service";
import { ISolutionState, SolutionService } from "../solution/service";
import { TeamService } from "./service";

@Component({
    providers: [
        // SolutionService,
    ],
    selector: "team",
    styleUrls: ["./component.css"],
    templateUrl: "./component.html",
})
export class TeamComponent implements OnInit {
    public units: any[];
    public isTeamValid: boolean = false;
    public isSolving: boolean = false;
    private stateSubscription: Subscription;
    private solutionSubscription: Subscription;
    private validity: boolean[];

    constructor(
        @Inject(forwardRef(() => OptionsService)) private optionsService: OptionsService,
        @Inject(forwardRef(() => SolutionService)) private solutionService: SolutionService,
        @Inject(forwardRef(() => TeamService)) private teamService: TeamService,
    ) {

    }

    public tryToSolve() {
        this.solutionService.solve(this.teamService.team);
    }

    public ngOnInit() {
        this.units = this.teamService.units;
        this.stateSubscription = this.teamService.stateChanged$.subscribe((index: number) => {
            this.isTeamValid = this.teamService.team.toString().length > 0;
        });
        this.solutionSubscription = this.solutionService.solution$.subscribe((state: ISolutionState) => {
            this.isSolving = state.running;
        });
    }
}
