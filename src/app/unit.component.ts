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

import * as constants from "../battle/constants";
import { Type } from "../battle/Mob";
import { BASE_TIER_VALUES, BASE_TYPE_VALUES, ITierValue, ITypeValue, OptionsService } from "./options/service";
import { IUnit, TeamService } from "./team/service";

const typePlaceholder = "Type";
const tierPlaceholder = "Tier";

@Component({
    providers: [],
    selector: "unit",
    styleUrls: ["./unit.component.css"],
    templateUrl: "./unit.component.html",
})
export class UnitComponent implements OnDestroy, OnInit {
    @Input() index: number;
    @Input() state: IUnit;
    // @Output() onValidityChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    public isValid: boolean = false;
    public ordinal: string;
    public tierPlaceholder: string | number;
    public tierValues: ITierValue[];
    public typePlaceholder: string | number;
    public typeValues: ITypeValue[];

    private stateSubscription: Subscription;
    private tierSubscription: Subscription;
    private typeSubscription: Subscription;

    constructor(
        @Inject(forwardRef(() => TeamService)) private teamService: TeamService,
        @Inject(forwardRef(() => OptionsService)) private optionsService: OptionsService,
    ) {

    }

    get isIncomplete(): boolean {
        return !this.isValid;
    }

    private setTypePlaceholder(input: string) {
        if (/^[AWFE]$/gi.test(input)) {
            return this.typePlaceholder = input;
        }
        if (/^[0-3]$/gi.test(input)) {
            return this.typePlaceholder = Type[input as any];
        }
        return this.typePlaceholder = typePlaceholder;
    }

    private setTierPlaceholder(input: string) {
        const parsed = parseInt(input, 10);
        if (parsed > 0 && parsed < constants.MAX_TEAM_SIZE) {
            return this.tierPlaceholder = parsed;
        }
        return this.tierPlaceholder = tierPlaceholder;
    }

    public typeSelected(type: Type) {
        this.typePlaceholder = Type[type];
        this.teamService.setType(this.index, type.toString());
    }

    public indexSelected(tierIndex: number) {
        this.tierPlaceholder = tierIndex;
        this.teamService.setIndex(this.index, tierIndex);
    }

    public clear() {
        this.teamService.clear(this.index);
    }

    public ngOnInit() {
        this.typePlaceholder = this.state.type || typePlaceholder;
        this.tierPlaceholder = this.state.index || tierPlaceholder;
        this.tierValues = this.tierValues || BASE_TIER_VALUES;
        this.typeValues = this.typeValues || BASE_TYPE_VALUES;
        this.ordinal = ["first", "second", "third", "fourth", "fifth", "sixth"][this.index];
        this.isValid = this.teamService.isValid(this.index);
        this.stateSubscription = this.teamService.stateChanged$.subscribe(({ index, unit }) => {
            if (index === this.index) {
                this.isValid = this.teamService.isValid(this.index);
                this.setTypePlaceholder(unit.type);
                this.setTierPlaceholder(unit.index);
            }
        });
        this.tierSubscription = this.optionsService.allowedTiers$.subscribe((allowedTiers: ITierValue[]) => {
            this.tierValues = allowedTiers.filter((element: ITierValue) => {
                return element.enabled;
            });
        });
        this.typeSubscription = this.optionsService.allowedTypes$.subscribe((allowedTypes: ITypeValue[]) => {
            this.typeValues = allowedTypes.filter((element: ITypeValue) => {
                return element.enabled;
            });
        });
    }

    ngOnDestroy() {
        this.stateSubscription.unsubscribe();
        this.tierSubscription.unsubscribe();
        this.typeSubscription.unsubscribe();
    }
}
