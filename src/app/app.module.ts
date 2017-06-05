import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { OptionsService } from "./options/service";
import { SolutionService } from "./solution/service";
import { TeamService } from "./team/service";

import { AppComponent } from "./app.component";
import { DropdownComponent } from "./dropdown.component";
import { OptionsComponent } from "./options/component";
import { SolutionComponent } from "./solution/component";
import { TeamComponent } from "./team/component";

import { UnitComponent } from "./unit.component";


@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        DropdownComponent,
        OptionsComponent,
        SolutionComponent,
        TeamComponent,
        UnitComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [
        OptionsService,
        SolutionService,
        TeamService,
    ],

})
export class AppModule { }
