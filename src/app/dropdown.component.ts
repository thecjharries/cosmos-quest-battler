import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange } from "@angular/core";

@Component({
    selector: "dropdown",
    // styleUrls: ["./unit.component.css"],
    styles: [`
    .dropdown,
    .dropdown button,
    .dropdown .dropdown-menu {
        width: 100px;
        min-width: 100px;
        max-width: 100px;
    }
    `],
    template: `
    <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {{placeholder}}
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a *ngFor="let value of values; let i = index;" class="dropdown-item" (click)="select(value.value)">{{value.text}}</a>
        </div>
    </div>`,
})
export class DropdownComponent implements OnInit {
    /** tslint:disable-next-line:member-access */
    @Input() values: any[];
    @Input() placeholder: string;
    @Output() onSelected: EventEmitter<any> = new EventEmitter<any>();
    public selected: number;
    public selectedText: string;
    public constructor() {
        //
    }

    public ngOnInit() {
        this.selectedText = "Select an item";
    }

    public select(index: number) {
        this.selected = index;
        this.onSelected.emit(index);
    }
}
