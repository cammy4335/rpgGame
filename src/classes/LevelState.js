import { PLACEMENT_TYPE_HERO } from "../helpers/consts";
import { placementFactory } from "./PlacementFactory";
import { GameLoop } from "./GameLoop";
import { DirectionControls } from "./DirectionControls";
import LevelsMap from "../levels/LevelsMap";
import { Inventory } from "./Inventory";
import { Camera } from "./Camera";

export class LevelState {
    constructor(levelId, onEmit) {
        this.id = levelId;
        this.onEmit = onEmit;
        this.directionControls = new DirectionControls();

        //Start the level!
        this.start();
    }

    start() {
        this.isCompleted = false;
        this.deathOutcome = null;
        const levelData = LevelsMap[this.id];

        this.theme = levelData.theme;
        this.tilesWidth = levelData.tilesWidth;
        this.tilesHeight = levelData.tilesHeight;
        this.placements = levelData.placements.map((config) => {
            return placementFactory.createPlacement(config, this);
        });

        // Create a fresh inventory
        this.inventory = new Inventory();

        // Cache a reference to the hero
        this.heroRef = this.placements.find((p) => p.type === PLACEMENT_TYPE_HERO);

        // Create a camera
        this.camera = new Camera(this);

        this.startGameLoop();
    }

    startGameLoop() {
        this.gameLoop?.stop();
        this.gameLoop = new GameLoop(() => {
            this.tick();
        });
    }

    addPlacement(config) {
        this.placements.push(placementFactory.createPlacement(config, this));
    }

    deletePlacement(placementToRemove) {
        this.placements = this.placements.filter((p) => {
            return p.id !== placementToRemove.id;
        });
    }

    tick() {

        if (this.directionControls.direction) {
            this.heroRef.controllerMoveRequested(this.directionControls.direction);
        }

        // Call 'tick' on any Placement that wants to update
        this.placements.forEach((placement) => {
            placement.tick();
        });

        // Update the camera
        this.camera.tick();

        //Emit any changes to React
        this.onEmit(this.getState());
    }

    isPositionOutOfBounds(x, y) {
        return (
            x === 0 ||
            y === 0 ||
            x >= this.tilesWidth + 1 ||
            y >= this.tilesHeight + 1
        );
    }

    setDeathOutcome(causeOfDeath) {
        this.deathOutcome = causeOfDeath;
        this.gameLoop.stop();
    }

    completeLevel() {
        this.isCompleted = true;
        this.gameLoop.stop();
    }


    getState() {
        return {
            theme: this.theme,
            tilesWidth: this.tilesWidth,
            tilesHeight: this.tilesHeight,
            placements: this.placements,
            deathOutcome: this.deathOutcome,
            isCompleted: this.isCompleted,
            cameraTransformX: this.camera.transformX,
            cameraTransformY: this.camera.transformY,
        };
    }

    destroy() {
        this.gameLoop.stop();
        this.directionControls.unbind();
    }
}