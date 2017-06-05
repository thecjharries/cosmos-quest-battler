import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";


import * as constants from "../../battle/constants";
import { Type } from "../../battle/Mob";
import { Team } from "../../battle/Team";

export interface ITypeValue {
    text: string;
    value: number;
    enabled: boolean;
}

export const BASE_TYPE_VALUES: ITypeValue[] = [Type.A, Type.W, Type.F, Type.E].map((type: Type) => {
    return { text: Type[type], value: type, enabled: true };
});

export interface ITierValue {
    text: string | number;
    enabled: boolean;
}

export const BASE_TIER_VALUES: ITierValue[] = [...Array(constants.MAX_TIER).keys()].map((index: number) => {
    return { text: index + 1, value: index + 1, enabled: true };
});

@Injectable()
export class OptionsService {
    public allowedTypes$: Observable<ITypeValue[]>;
    public allowedTiers$: Observable<ITierValue[]>;
    public maxCost: number;
    public maxParty: number;
    private allowedTiersSource = new Subject<ITierValue[]>();
    private allowedTypesSource = new Subject<ITypeValue[]>();

    public constructor() {
        this.allowedTypes$ = this.allowedTypesSource.asObservable();
        this.allowedTiers$ = this.allowedTiersSource.asObservable();
    }

    public updateMaxCost(input: number) {
        this.maxCost = input / 100;
    }

    public updateMaxParty(input: number) {
        this.maxParty = input;
    }
}
