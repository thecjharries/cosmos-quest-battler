import {
    Component,
    EventEmitter,
    forwardRef,
    Inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChange,
} from "@angular/core";
import { FormControl } from "@angular/forms";

import "rxjs/add/observable/fromEvent";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/throttleTime";
import { Observable } from "rxjs/Observable";


import { IMobReference } from "../../battle/interfaces";
import { Mob, Type } from "../../battle/Mob";
import { TeamService } from "../team/service";
import { OptionsService } from "./service";


@Component({
    selector: "options",
    styleUrls: ["./component.css"],
    templateUrl: "./component.html",
})
export class OptionsComponent implements OnChanges, OnInit {
    public maximumCost: number;
    public validCost: boolean;
    public maxCostControl = new FormControl();
    public maxCostPlaceholder: string = "eg 20000, min 1000";
    public maximumParty: number = 6;
    public validParty: boolean;
    public maxPartyControl = new FormControl();

    private matchedUnits: {
        [key: string]: { reference: boolean | IMobReference };
    } = {};
    public constructor(
        @Inject(forwardRef(() => OptionsService)) private optionsService: OptionsService,
        @Inject(forwardRef(() => TeamService)) private teamService: TeamService,
        ) {
        //
    }

    private matchAgainstCache(index: number, name: string) {
        if (this.matchedUnits[name]) {
            if (this.matchedUnits[name].reference) {
                this.teamService.setUnit(index, this.matchedUnits[name].reference as IMobReference);
            }
            // Whoops, looks like it's a dud
            return;
        }
        try {
            const mob = new Mob(name);
            this.matchedUnits[name] = { reference: {type: Type[mob.reference.type as any], index: mob.reference.index} };
            this.teamService.setUnit(index, this.matchedUnits[name].reference as IMobReference);
        } catch (error) {
            console.log("caught");
            // whoops
            this.matchedUnits[name] = { reference: false};
        }
    }

    public matchUnits(input: string) {
        const unit = /(?:\s*)[AWFE](?:\s*)(?:10|[1-9])(?:\s*)/gi;
        const matches = input.match(unit);
        if (matches) {
            for (let index = 0; index < matches.length; index++) {
                this.matchAgainstCache(index, matches[index].trim());
            }
        }
    }

    public validateInput(input: string) {
        this.matchUnits(input);
    }

    public validateCost(input: number) {
        if (input > 1000) {
            this.validCost = true;
            this.maximumCost = input;
            this.optionsService.updateMaxCost(input);
        } else {
            this.validCost = false;
        }
    }

    public validatePartySize(input: number) {
        if (input < 1 || input > 6) {
            this.validParty = false;
        } else {
            this.validParty = true;
            this.maximumParty = input;
            this.optionsService.updateMaxParty(input);
        }
    }

    public ngOnInit() {
        this.maxCostControl.valueChanges
            .debounceTime(500)
            .distinctUntilChanged()
            .subscribe((newValue: number) => {
                this.validateCost(newValue);
            });
        this.maxPartyControl.valueChanges
            .debounceTime(500)
            .distinctUntilChanged()
            .subscribe((newValue: number) => {
                this.validatePartySize(newValue);
            });
    }


    public ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        console.log(changes);
    }
}
