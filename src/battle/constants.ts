import * as fse from "fs-extra";
import * as path from "path";

import { IMobData, IMobDefinitions, ITypedMobData } from "./interfaces";

export const MAX_TEAM_SIZE = 6;
export const MIN_TIER: number = 1;
export const MAX_TIER: number = 10;

export const MOB_DEFINITIONS: IMobDefinitions = require("./mobs.json");

export const INVALID_TYPES_REGEXP: RegExp = /[^awfe]/i;
