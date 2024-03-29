import {
    PLACEMENT_TYPE_HERO,
    PLACEMENT_TYPE_GOAL,
    PLACEMENT_TYPE_WALL,
    PLACEMENT_TYPE_FLOUR,
    PLACEMENT_TYPE_CELEBRATION,
    PLACEMENT_TYPE_LOCK,
    PLACEMENT_TYPE_KEY,
    PLACEMENT_TYPE_WATER,
    PLACEMENT_TYPE_WATER_PICKUP,
    PLACEMENT_TYPE_GROUND_ENEMY,
    PLACEMENT_TYPE_FLYING_ENEMY,
    PLACEMENT_TYPE_ROAMING_ENEMY,
    PLACEMENT_TYPE_CONVEYOR,
} from "../helpers/consts";
import { HeroPlacement } from "../game-objects/HeroPlacement";
import { GoalPlacement } from "../game-objects/GoalPlacement";
import { WallPlacement } from "../game-objects/WallPlacement";
import { FlourPlacement } from "../game-objects/FlourPlacement";
import { CelebrationPlacement } from "../game-objects/CelebrationPlacement";
import { LockPlacement } from "../game-objects/LockPlacement";
import { KeyPlacement } from "../game-objects/KeyPlacement";
import { WaterPlacement } from "../game-objects/WaterPlacement";
import { WaterPickupPlacement } from "../game-objects/WaterPickupPlacement";
import { GroundEnemyPlacement } from "../game-objects/GroundEnemyPlacement";
import { FlyingEnemyPlacement } from "../game-objects/FlyingEnemyPlacement";
import { RoamingEnemyPlacement } from "../game-objects/RoamingEnemyPlacement";
import { ConveyorPlacement } from "../game-objects/ConveyorPlacement";

const placementTypeClassMap = {
    [PLACEMENT_TYPE_HERO]: HeroPlacement,
    [PLACEMENT_TYPE_GOAL]: GoalPlacement,
    [PLACEMENT_TYPE_WALL]: WallPlacement,
    [PLACEMENT_TYPE_FLOUR]: FlourPlacement,
    [PLACEMENT_TYPE_CELEBRATION]: CelebrationPlacement,
    [PLACEMENT_TYPE_LOCK]: LockPlacement,
    [PLACEMENT_TYPE_KEY]: KeyPlacement,
    [PLACEMENT_TYPE_WATER]: WaterPlacement,
    [PLACEMENT_TYPE_WATER_PICKUP]: WaterPickupPlacement,
    [PLACEMENT_TYPE_GROUND_ENEMY]: GroundEnemyPlacement,
    [PLACEMENT_TYPE_FLYING_ENEMY]: FlyingEnemyPlacement,
    [PLACEMENT_TYPE_ROAMING_ENEMY]: RoamingEnemyPlacement,
    [PLACEMENT_TYPE_CONVEYOR]: ConveyorPlacement,
};

class PlacementFactory {
    createPlacement(config, level) {
        const placementClass = placementTypeClassMap[config.type];
        if (!placementClass) {
            console.warn("NO TYPE FOUND", config.type);
        }
        // Generate a new instance with random ID
        const instance = new placementClass(config, level);
        instance.id = Math.floor(Math.random() * 9999999) + 1;
        return instance;

    }
}

export const placementFactory = new PlacementFactory();