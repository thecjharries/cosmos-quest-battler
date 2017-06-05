import { ICombatSignature, IFightingPair } from "./interfaces";
import { Mob } from "./Mob";
import { Team } from "./Team";

export enum CombatResult { Draw, Attacker, Defender }

export class Combat {
    public attackingTeam: Team;
    public defendingTeam: Team;
    public result: CombatResult;

    public constructor(input: ICombatSignature) {
        const { attackingTeam, defendingTeam, verbose = false } = input;
        if (verbose) {
            this.logger = console.log;
        }
        this.attackingTeam = attackingTeam.duplicate();
        this.defendingTeam = defendingTeam.duplicate();
        this.result = this.teamFight();
    }

    public toString() {
        return CombatResult[this.result];
    }

    private logger(...input: any[]) {
        // Do nothing;
    }

    private soloFight(attacker: Mob, defender: Mob): IFightingPair {
        this.logger(
            "Fight:",
            `${(attacker.type + 1) % 4 === defender.type ? "\nAttacker is strong against defender" : ""}`,
            `${(defender.type + 1) % 4 === attacker.type ? "\nDefender is strong against Attacker" : ""}`,
            );
        this.logger(`\tAttacker ${attacker}: ${attacker.hp}, \tDefender ${defender}: ${defender.hp}`);
        while (attacker.isAlive() && defender.isAlive()) {
            attacker.attackOpponent(defender);
            defender.attackOpponent(attacker);
            this.logger(`\tAttacker ${attacker}: ${attacker.hp}, \tDefender ${defender}: ${defender.hp}`);
        }
        return { attacker, defender };
    }

    private teamFight(): CombatResult {
        this.logger("Begin combat:");
        this.logger(`\tAttacker: ${this.attackingTeam}`);
        this.logger(`\tDefender: ${this.defendingTeam}`);
        while (this.attackingTeam.count > 0 && this.defendingTeam.count > 0) {
            const { attacker, defender } = this.soloFight(
                this.attackingTeam.active,
                this.defendingTeam.active,
            );
            if (attacker.isDead()) {
                this.logger(`Removing attacker ${attacker}`);
                this.attackingTeam.kill();
            }
            if (defender.isDead()) {
                this.logger(`Removing defender ${defender}`);
                this.defendingTeam.kill();
            }
        }
        this.logger("Results:");
        this.logger(`\tAttacker: ${this.attackingTeam}`);
        this.logger(`\tDefender: ${this.defendingTeam}`);
        if (this.attackingTeam.count === this.defendingTeam.count) {
            return CombatResult.Draw;
        } else if (this.attackingTeam.count > this.defendingTeam.count) {
            return CombatResult.Attacker;
        }
        return CombatResult.Defender;
    }


}
