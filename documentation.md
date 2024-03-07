# Project Documention

This document provides a concise overview of my React-based game application, outlining its core functionality and the interaction flow between components. Built on React`s efficient update and rendering mechanisms, this document showcases how react handles 
game dynamics and player interaction seamlessly.

# Table of Contents

- [Atoms](#Atoms)
- [classes](#classes)
- [components](#components)
  - [hud](##hud)
  - [level-layout](##level-layout)
  - [object-graphics](##object-graphics)
- [game-objects](#game-objects)
- [helpers](#helpers)
- [levels](#levels)


# React Code Componenets


# Atoms

1. currentLevelldAtom \
The code serves as a default value upon application initialization, 
it helps to show the right content for each level or to respond when the user moves to a different level.

```javascript
import { atom } from "recoil";
```
This line imports the atom function from the recoil library, which is a 
JavaScript library used to define state atoms and selectors, which can be subscribed to and updated from various components in an application

```javascript
export const currentLevelIdAtom = atom({
    key: "currentLevelIdAtom",
    default: "DemoLevel1",
});
```

Here is defineing a recoil atom named currentLevelIdAtom. which represents a piece of state in a React component. the atom function here
is used to configure the atom, and specifies a unique identifier called `key` and sepcifies a default value in `default`

2. spriteSheetImageAtom /
this code sets up Recoil atom called `spriteSheetImageAtom` which serves as a container for holding data in a React application. this atom can be used throughout the application to manage and access the sprite sheet image data.

```javascript
import { atom } from "recoil";
```
This line imports the atom function from the `recoil` library.

```javascript
atom({
    key: "spriteSheetImageAtom",
    default: null,
});
```

This code creates a Recoil atom named `spriteSheetImageAtom` using the `atom` function. within the function it specifies 2 properties called `key` and `default`.

the key property uniquely identifies the atom, and the default property specifies the inital value of the atom. it is set as `null`, which means it dosent contain any specific value. this atom can be used throughout the application to manage and access the sprite sheet.


# classes

1. Camera/ 
this code defines a `Camera` class that manages that position of the camera in a game or application. It uses constants and methods to control the cameras behavior, including movement and transformation

```javascript
import { CELL_SIZE } from "../helpers/consts";
import {
    DIRECTION_RIGHT,
    DIRECTION_LEFT,
    DIRECTION_UP,
    DIRECTION_DOWN,
} from "../helpers/consts";
```

These lines import constants and values from another file (`../helpers/consts`). The imported values are `CELL_SIZE`, `DIRECTION_RIGHT`, `DIRECTION_LEFT`, `DIRECTION_UP` and `DIRECTION_DOWN`

```javascript
const CAMERA_SPEED = 0.02;
const CAMERA_LOOKAHEAD = 3;
const USE_SMOOTH_CAMERA = true;
```

Here, three constants are defined: CAMERA_SPEED, CAMERA_LOOKAHEAD, and USE_SMOOTH_CAMERA. These constants are used to control various aspects of the camera behavior.

```javascript
export class Camera {
    constructor(level) {
        // Initialization
        this.level = level;
        const [heroX, heroY] = this.level.heroRef.displayXY();
        this.cameraX = heroX;
        this.cameraY = heroY;
        this.transformOffset = -5.5 * CELL_SIZE;
    }

    // Methods
    get transformX() { ... }
    get transformY() { ... }
    static lerp(currentValue, destinationValue, time) { ... }
    tick() { ... }
}
```
This section defines a `Camera` class. The constrcutor initializes the camera`s position based on the hero`s position in the level. The class also contains methods such as `transformX`, `transformY`, `lerp`, and `tick`

```javascript
get transformX() {
    return -this.cameraX - this.transformOffset + "px";
}

get transformY() {
    return -this.cameraY - this.transformOffset + "px";
}
```
These methods calculate the transformation of the camera`s position. They return the calculated values as strings, representing the CSS `transform` property

```javascript
static lerp(currentValue, destinationValue, time) {
    return currentValue * (1 - time) + destinationValue * time;
}
```
This static method performs linear interpolation (lerp) between two values (`currentValue` and `destinationValue`) based on given `time` parameter.

```javascript
    tick() {
        // Start where the Hero is now
        const hero = this.level.heroRef;
        const [heroX, heroY] = hero.displayXY();
        let cameraDestinationX = heroX;
        let cameraDestinationY = heroY;

        //If moving, put the camera slightly ahead of where Hero is going
        if (hero.movingPixelsRemaining > 0) {
            if (hero.movingPixelDirection === DIRECTION_DOWN) {
                cameraDestinationY += CAMERA_LOOKAHEAD * CELL_SIZE;
            } else if (hero.movingPixelDirection === DIRECTION_UP) {
                cameraDestinationY -= CAMERA_LOOKAHEAD * CELL_SIZE;
            } else if (hero.movingPixelDirection === DIRECTION_LEFT) {
                cameraDestinationX -= CAMERA_LOOKAHEAD * CELL_SIZE;
            } else if (hero.movingPixelDirection === DIRECTION_RIGHT) {
                cameraDestinationX += CAMERA_LOOKAHEAD * CELL_SIZE;
            }
        }

        if (USE_SMOOTH_CAMERA) {
            this.cameraX = Camera.lerp(
                this.cameraX,
                cameraDestinationX,
                CAMERA_SPEED
            );
            this.cameraY = Camera.lerp(
                this.cameraY,
                cameraDestinationY,
                CAMERA_SPEED
            );
        } else {
            this.cameraX = cameraDestinationX;
            this.cameraY = cameraDestinationY;
        }
    }
```

This method is responsible for updating the camera`s position. It calculates the destination position of the camera based on the hero`s movement and smoothly moves the camera towards that position using linear interpolation (lerp).

2. Collision/
This code defines a class `Collision` that helps in detecting and handling collisions between different game elements within a game enviornment. it provides methods to check for various types of collisions and interactions at a given position in the game container.

```javascript
import { PLACEMENT_TYPE_ICE } from "../helpers/consts";
```

this imports the constant `PLACEMENT_TYPE_ICE` from the helpers file

```javascript
export class Collision {
    constructor(forBody, level, position = null) {
        // Constructor function
        this.forBody = forBody;
        this.level = level;
        this.placementsAtPosition = [];
        this.x = position ? position.x : forBody.x;
        this.y = position ? position.y : forBody.y;
        this.scanPlacementsAtPosition();
    }
```
This section defines a `collision` class. the constructor initalizes the `Collision` object with properties like `forBody`, `level`, `placementAtPosition`, `x`, and `y`. it scand the placements at the specified position.

The class contains various methods to check for different types of collisions with game elements.

Method Definitions:

- `scanPlacementsAtPosition()`: Scans the placements at the current position and updates placementsAtPosition accordingly.

- `withSolidPlacement()`: Checks if there`s a solid placement at the current position.
- `withPlacementAddsToInventory()`: Checks if there`s a placement that adds an item to the inventory at the current position.
- `withCompletesLevel()`: Checks if there`s a placement that completes the level at the current position.
- `withLock()`: Checks if there`s a lock at the current position.
- `withSelfGetsDamaged()`:Checks if the body gets damaged at the current position.
- `withChangesHeroSkin()`: Checks if there`s a change in the hero`s skin at the current position.
- `withPlacementMovesBody()`: Checks if there`s a placement that moves the body at the current position.
- `withIceCorner()`: Checks if there`s an ice corner at the current position.
- `withDoorSwitch()`: Checks if there`s a door switch at the current position.

3. DirectionControls/
This code defines a `DirectonControls` class that enables tracking of held directions based on keyboard input. It sets up event listeners to capture keydown and keyup events, maps keycodes to directions, and provides a method to retrieve the currently held direction. it includes a method to unbind event listeners when necessary.

```javascript
import {
    DIRECTION_UP,
    DIRECTION_DOWN,
    DIRECTION_RIGHT,
    DIRECTION_LEFT,
} from "../helpers/consts";
```

This code imports constants representing different directions (DIRECTION_UP, DIRECTION_DOWN, DIRECTION_RIGHT, DIRECTION_LEFT) from another file.

```javascript
export class DirectionControls {
    constructor() {
        // Initialization
        this.directionKeys = {
            ArrowDown: DIRECTION_DOWN,
            ArrowUp: DIRECTION_UP,
            ArrowLeft: DIRECTION_LEFT,
            ArrowRight: DIRECTION_RIGHT,
            s: DIRECTION_DOWN,
            w: DIRECTION_UP,
            a: DIRECTION_LEFT,
            d: DIRECTION_RIGHT,
        };
        this.heldDirections = [];

        // Event Handlers
        this.directionKeyDownHandler = (e) => { ... };
        this.directionKeyUpHandler = (e) => { ... };

        // Event Listeners
        document.addEventListener("keydown", this.directionKeyDownHandler);
        document.addEventListener("keyup", this.directionKeyUpHandler);
    }

    // Getter Method
    get direction() { ... }

    // Method to Unbind Event Listeners
    unbind() { ... }
}
```

This section defines a DirectionControls class responsible for managing directional controls. The constructor initializes the DirectionControls object with a mapping of keycodes to directions (directionKeys) and an array to store currently held directions (heldDirections). It also sets up event handlers for keydown and keyup events to track held directions. Additionally, event listeners are added to the document object to capture keyboard events.

```javascript
get direction() {
    return this.heldDirections[0];
}
```

This getter method returns the first directon in the `heldDirections` array, representing the currently held direction.

```javascript
unbind() {
    document.removeEventListener("keydown", this.directionKeyDownHandler);
    document.removeEventListener("keyup", this.directionKeyUpHandler);
}
```

This method removes the event listeners previously added during initialization. It`s used to clean up resources and prevent memory leaks when the DirectionControls object is no longer needed.

4. GameLoop/
this code defines a `GameLoop` class that manages the executon of a game loop. It ensures that game logic is executed consistently at a fixed time step, providing smooth gameplay and synchronization across different devices and frame rates. it allows for easy starting and stopping of the game loop as needed.

```javascript
export class GameLoop {
    constructor(onStep) {
        this.onStep = onStep;
        this.rafCallback = null;
        this.hasStopped = false;
        this.start();
    }
```

This section defines a GameLoop class responsible for managing the game loop. The constructor accepts a function onStep as a parameter, which will be called on each step of the game loop. It initializes properties like onStep, rafCallback, and hasStopped, and then starts the game loop immediately upon instantiation.

```javascript
    start() {
        let previousMs;
        const step = 1 / 60;
        const tick = (timestampMs) => {
            if (this.hasStopped) {
                return;
            }
            if (previousMs === undefined) {
                previousMs = timestampMs;
            }
            let delta = (timestampMs - previousMs) / 1000;
            while (delta >= step) {
                this.onStep();
                delta -= step;
            }
            previousMs = timestampMs - delta * 1000;
            //Recapture the callback to be able to shut it off
            this.rafCallback = requestAnimationFrame(tick);
        };

        // Initial kickoff
        this.rafCallback = requestAnimationFrame(tick);
    }
```

The start() method initializes the game loop. It defines a tick function (tick) that will be called recursively using requestAnimationFrame(). The tick function calculates the time elapsed since the last tick and calls the onStep function repeatedly at a fixed time step (step). It ensures that the game logic is executed consistently regardless of the frame rate.

```javascript
 stop() {
        this.hasStopped = true;
        cancelAnimationFrame(this.rafCallback);
    }
```

The stop() method stops the game loop. It sets the hasStopped flag to true and cancels the animation frame request using cancelAnimationFrame() to halt the recursive tick function calls.

5. Inventory/
this defines an `Inevntory` class that provides methods for checking if an item exists in the inventory and for adding items to the inventory. It uses a `map` data structure to store the inventory items, providing efficent lookup and management of inventory data.

It also handles error handling to prevent the addition of falsy keys to the inventory.

```javascript
export class Inventory {
    constructor() {
        // Initialization
        this.inventoryMap = new Map();
    }
```
This section defines an `Inevntory` class responsible for managing an inventory system. The constructor initializes the `inventoryMap` property as a new `Map` object, which will store the inventory items.

```javascript
has(key) {
    // Check if the inventory map contains the provided key
    return Boolean(this.inventoryMap.has(key));
}
```

The `has()` method checks if the inventory contains a given key. It returns `true` if the key exists in the `inventoryMap`, otherwise it returns `false`.

```javascript
add(key) {
    // Check for falsy keys
    if (!key) {
        console.warn("WARNING! Trying to add falsy key to Inventory", key);
        return;
    }
    // Add the key to the inventory map
    this.inventoryMap.set(key, true);
    // Log the updated inventory map
    console.log(this.inventoryMap);
}
```

The `add()` method adds a key to the inventory. It first checks if the provided key is falsy. If it is, a warning message is logged, and the method returns early without adding the key to the inventory. Otherwise, the key is added to the `inventoryMap` with a boolean value of `true`. After adding the key, the updated inventory map is logged to the console.

6. LevelAnimatedFrame/

this code sets up a LevelAnimatedFrames class to manage animations within a level. It defines sequences and speeds for water and fire animations, creates instances of the PlacementTypeAnimationFrames class for each animation type, and provides methods to progress through animation frames and retrieve the current frame for each animation type.

```javascript
import { TILES } from "../helpers/tiles";
import { PlacementTypeAnimationFrames } from "./PlacementTypeAnimationFrames";
```

This code imports the TILES constant from `../helpers/tiles` and the `PlacementTypeAnimationFrames` class from `./PlacementTypeAnimationFrames`.

```javascript
const WATER_SEQUENCE = [TILES.WATER1, TILES.WATER2];
const WATER_ANIMATION_SPEED = 30;

const FIRE_SEQUENCE = [TILES.FIRE1, TILES.FIRE2, TILES.FIRE3];
const FIRE_ANIMATION_SPEED = 30;
```

These constants define the sequences of tiles to be used in animations and their corresponding animation speeds. For water animation, `WATER_SEQUENCE` contains two water tile frames (`TILES.WATER1` and `TILES.WATER2`), and `WATER_ANIMATION_SPEED` is set to 30. Similarly, for fire animation, `FIRE_SEQUENCE` contains three fire tile frames (`TILES.FIRE1`, `TILES.FIRE2`, and `TILES.FIRE3`), and `FIRE_ANIMATION_SPEED` is also set to 30.

```javascript
export class LevelAnimatedFrames {
    constructor() {
        // Initialization
        this.waterFrames = new PlacementTypeAnimationFrames(WATER_SEQUENCE, WATER_ANIMATION_SPEED);
        this.fireFrames = new PlacementTypeAnimationFrames(FIRE_SEQUENCE, FIRE_ANIMATION_SPEED);
    }

    // Public method for progressing in animation
    tick() {
        this.waterFrames.tick();
        this.fireFrames.tick();
    }

    // Public getters for knowing which frame is current
    get waterFrame() {
        return this.waterFrames.activeFrame;
    }

    get fireFrame() {
        return this.fireFrames.activeFrame;
    }
}
```
This section defines a `LevelAnimatedFrames` class responsible for managing animated frames within a level. The constructor initializes two instances of the `PlacementTypeAnimationFrames` class for water and fire animations, passing the respective sequences and animation speeds. The class includes a `tick()` method to progress in animation frames and getters (`waterFrame` and `fireFrame`) to retrieve the current frame for water and fire animations, respectively.

7. LevelState/

This class manages the state of a game level, including placements, inventory, animations, camera, and game loop. It provides methods for starting and stopping the level, processing game logic, and updating the state based on player input and game events.

```javascript
constructor(levelId, onEmit) {
    this.id = levelId;
    this.onEmit = onEmit;
    this.directionControls = new DirectionControls();
    this.start(); // Start the level upon instantiation
}
```
The constructor initializes the `LevelState` object with a level ID and an event emitter function (`onEmit`). It creates a `DirectionControls` instance for managing directional controls and starts the level.

```javascript
start() {
    // Initialization
    this.isCompleted = false;
    this.deathOutcome = null;
    const levelData = LevelsMap[this.id];
    // Extract data from levelData object
    this.theme = levelData.theme;
    this.tilesWidth = levelData.tilesWidth;
    this.tilesHeight = levelData.tilesHeight;
    // Create placements based on levelData configuration
    this.placements = levelData.placements.map((config) => {
        return placementFactory.createPlacement(config, this);
    });
    // Create a fresh inventory
    this.inventory = new Inventory();
    // Create a frame animation manager
    this.animatedFrames = new LevelAnimatedFrames();
    // Cache a reference to the hero
    this.heroRef = this.placements.find((p) => p.type === PLACEMENT_TYPE_HERO);
    // Create a camera
    this.camera = new Camera(this);
    // Start the game loop
    this.startGameLoop();
}
```
The `start()` method initializes the level state. It sets properties like `isCompleted` and `deathOutcome` to their default values, retrieves level data from `LevelsMap`, creates placements based on the level configuration, initializes inventory, animation frames manager, and camera. It also starts the game loop.

```javascript
startGameLoop() {
    this.gameLoop?.stop();
    this.gameLoop = new GameLoop(() => {
        this.tick();
    });
}
```

This method starts the game loop. It first stops the existing game loop (if any) and then creates a new `GameLoop` instance, passing a `tick()` function to be called on each game loop step.

```javascript
    tick() {

        if (this.directionControls.direction) {
            this.heroRef.controllerMoveRequested(this.directionControls.direction);
        }

        // Call 'tick' on any Placement that wants to update
        this.placements.forEach((placement) => {
            placement.tick();
        });

        // Work on animation frames
        this.animatedFrames.tick();

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

    switchAllDoors() {
        this.placements.forEach((placement) => {
            if (placement.toggleIsRaised) {
                placement.toggleIsRaised();
            }
        });
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
```

The tick() method represents a single step of the game loop. It updates the state of the level by processing player input, updating placements, managing animation frames, updating the camera, and emitting state changes.

`isPositionOutOfBounds()`: Checks if a given position is out of bounds.
`switchAllDoors()`: Toggles the state of all doors in the level.
`setDeathOutcome()`: Sets the cause of death and stops the game loop.
`completeLevel()`: Marks the level as completed and stops the game loop.
`getState()`: Retrieves the current state of the level.
`destroy()`: Stops the game loop and unbinds directional controls.

8. PlacementFactory/

This code defines a `PlacementFactory` class responsible for creating different types of placements based on configuration data.

```javascript
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
    PLACEMENT_TYPE_ICE,
    PLACEMENT_TYPE_ICE_PICKUP,
    PLACEMENT_TYPE_FIRE,
    PLACEMENT_TYPE_FIRE_PICKUP,
    PLACEMENT_TYPE_SWITCH_DOOR,
    PLACEMENT_TYPE_SWITCH,
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
import { IcePlacement } from "../game-objects/IcePlacement";
import { IcePickupPlacement } from "../game-objects/IcePickupPlacement";
import { FirePlacement } from "../game-objects/FirePlacement";
import { FirePickupPlacement } from "../game-objects/FirePickupPlacement";
import { SwitchableDoorPlacement } from "../game-objects/SwitchableDoorPlacement";
import { DoorSwitchPlacement } from "../game-objects/DoorSwitchPlacement";
```

Various constants representing placement types (`PLACEMENT_TYPE_HERO`, `PLACEMENT_TYPE_GOA`L, etc.) are imported from `../helpers/consts`.
Corresponding placement classes (`HeroPlacement`, `GoalPlacement`, etc.) are imported from their respective files.

```javascript
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
    [PLACEMENT_TYPE_ICE]: IcePlacement,
    [PLACEMENT_TYPE_ICE_PICKUP]: IcePickupPlacement,
    [PLACEMENT_TYPE_FIRE]: FirePlacement,
    [PLACEMENT_TYPE_FIRE_PICKUP]: FirePickupPlacement,
    [PLACEMENT_TYPE_SWITCH_DOOR]: SwitchableDoorPlacement,
    [PLACEMENT_TYPE_SWITCH]: DoorSwitchPlacement,
};
```

This object maps each placement type to its corresponding placement class. It serves as a lookup table to determine which class to instantiate based on the type specified in the configuration data.

```javascript
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
```
This class contains a `createPlacement()` method responsible for creating placement instances based on the provided configuration and the level context. It looks up the corresponding placement class using `placementTypeClassMap`, represents the class with the provided configuration and level, assigns a random ID to the instance, and returns it.

```javascript
export const placementFactory = new PlacementFactory();
```

This exports an instance of the PlacementFactory class, allowing other modules to use it to create placements.

9. PlacementTypeAnimationFrames

This class provides functionality to manage animation frames for a specific placement type. It allows for easy progression through the frames and looping the animation seamlessly

```javascript
constructor(framesSequence = ["0x1"], changeOnFrameCount = 30) {
    this.framesSequence = framesSequence;
    this.changeOnFrameCount = changeOnFrameCount; // Speed. Higher = slower
    this.showFrame = 0;
    this.tickCounter = 0;
}
```
The constructor initializes the `PlacementTypeAnimationFrames` object with two parameters:
`framesSequence`: An array representing the sequence of frames for the animation. Default is [`0x1`].
`changeOnFrameCount`: An integer representing the speed of animation. Higher values result in slower animation. Default is `30`.

```javascript
get activeFrame() {
    return this.framesSequence[this.showFrame];
}
```
The `activeFrame` getter returns the currently active frame from the `framesSequence` array.

```javascript
tick() {
    // Progress through animation
    this.tickCounter += 1;

    // When hitting the limit, change which frame is showing
    if (this.tickCounter > this.changeOnFrameCount) {
        this.tickCounter = 0;
        this.showFrame += 1;
        // Go back to the beginning if we pass the final frame
        if (this.showFrame === this.framesSequence.length) {
            this.showFrame = 0;
        }
    }
}
```

The `tick()` method progresses the animation by incrementing the `tickCounter`.

When the `tickCounter` reaches the `changeOnFrameCount`, it resets to 0, and the `showFrame` index is incremented to display the next frame.

If the `showFrame` index reaches the end of the `framesSequence`, it resets back to 0 to loop the animation.

# components

## hud

1. Death Message

This code defines functional component named `DeathMessage` that renders a message indicating the cause of death in the game.

```javascript
export default function DeathMessage({ level }) {
```
This function is exported as the default export.

It is a React functional component named DeathMessage.

The component receives props, and it expects a prop named level which contains information about the current level, including the cause of death.

```javascript
return (
    <div
        style={{
            position: "absolute",
            left: 0,
            top: 64,
            color: "red",
            fontWeight: "bold",
        }}
    >
        <p>Death: {level.deathOutcome}</p>
    </div>
);
```
The component returns JSX that represents the UI structure.

It renders a <div> element positioned absolutely at the top-left corner (`left: 0, top: 64`).

The text color is set to red (`color: "red"`), and the font weight is set to bold (`fontWeight: "bold"`).

Inside the <div>, there's a <p> element displaying the death message. The message is obtained from the `deathOutcome` property of the `level` object passed as a prop to the component.

2. FlourCount

This component is used to display the count of remaining flour placements, which is the item required to progress through the level.

```javascript
export default function FlourCount({ level }) {
```
This function is exported as the default export.

It is a React functional component named FlourCount.

The component receives props, and it expects a prop named level which contains information about the current level, including the placements.

```javascript
const count = level.placements.filter((p) => {
    return p.type === PLACEMENT_TYPE_FLOUR && !p.hasBeenCollected;
}).length;
```
This calculates the count of flour placements that haven't been collected yet.

It filters the `level.placements` array to include only placements of type `PLACEMENT_TYPE_FLOUR` (`p.type === PLACEMENT_TYPE_FLOUR`) and that have not been collected (`!p.hasBeenCollected`).

The length of the filtered array represents the count of remaining flour placements.

```javascript
return (
    <p
        style={{
            position: "absolute",
            left: 0,
            top: 0,
            color: "#fff",
        }}
    >
        Flour Remaining: {count}
    </p>
);
```
The component returns JSX that represents the UI structure.

It renders a <p> element positioned absolutely at the top-left corner (`left: 0, top: 0`).

The text color is set to white (`color: "#fff"`).

Inside the <p> element, it displays the text "Flour Remaining:" followed by the calculated `count`.

3. LevelCompleteMessage

this component provides feedback to the player upon completing the level and offers a button to proceed to the next level.

```javascript
export default function LevelCompleteMessage() {
```
This function is exported as the default export.

It is a React functional component named LevelCompleteMessage.

```javascript
const [currentId, setCurrentId] = useRecoilState(currentLevelIdAtom);
```

`useRecoilState` hook is used to create a state variable `currentId` and a function `setCurrentId` to update it.

`currentId` represents the ID of the current level, and it's obtained from the `currentLevelIdAtom`.

```javascript
return (
    <p
        style={{
            position: "absolute",
            left: 0,
            top: 64,
            color: "lime",
        }}
    >
        LEVEL COMPLETE!
        <button
            onClick={() => {
                const levelsArray = Object.keys(LevelsMap);
                const currentIndex = levelsArray.findIndex((id) => {
                    return id === currentId;
                });
                const nextLevelId = levelsArray[currentIndex + 1] ?? levelsArray[0];
                setCurrentId(nextLevelId);
            }}
        >
            Next Level
        </button>
    </p>
);
```

The component returns JSX that represents the UI structure.
It renders a <p> element positioned absolutely at the top-left corner (`left: 0, top: 64`).

The text color is set to lime (`color: "lime"`).

Inside the <p> element, it displays the text "LEVEL COMPLETE!".

A <button> element is rendered below the text with the label "Next Level".

When the button is clicked, it triggers an `onClick` event handler that calculates the ID of the next level based on the current level ID, updates the `currentId` state variable, and sets it to the ID of the next level.


## level-layout
1. LevelBackgroundTilesLayer

this component generates and renders the background tiles of the level based on the provided level data

```javascript
export default function LevelBackgroundTilesLayer({ level }) {
```
This function is exported as the default export.

It is a React functional component named `LevelBackgroundTilesLayer`.

The component receives props, and it expects a prop named `level` which contains information about the current level.

```javascript
const widthWithWalls = level.tilesWidth + 1;
const heightWithWalls = level.tilesHeight + 1;
```
These constants calculate the width and height of the level including the surrounding walls.

```javascript
    function getBackgroundTile(x, y) {
        if (x === 0) {
            return tiles.LEFT;
        }
        if (x === widthWithWalls) {
            return tiles.RIGHT;
        }
        if (y === 0) {
            return tiles.TOP;
        }
        if (y === heightWithWalls) {
            return tiles.BOTTOM;
        }
        return tiles.FLOOR;
    }
```
This function determines the type of background tile based on the position `(x, y)` in the level.

It checks if the position is at the edges to determine whether to render wall tiles or floor tiles

```javascript
    let canvases = [];
    for (let y = 0; y <= heightWithWalls; y++) {
        for (let x = 0; x <= widthWithWalls; x++) {
            // Skip Bottom Left and Bottom Right for intentional blank tiles in those corners
            if (y === heightWithWalls) {
                if (x === 0 || x === widthWithWalls) {
                    continue;
                }
            }

            // add a cell to the map
            canvases.push(
                <MapCell
                    key={`${x}_${y}`}
                    x={x}
                    y={y}
                    frameCoord={getBackgroundTile(x, y)}

                />
            );
        }
    }
```
Nested loops iterate over each position `(x, y)` in the level.

It skips certain corners to intentionally leave them as blank tiles.

For each position, it adds a `MapCell` component to the `canvases` array with props like `x, y,` and `frameCoord` representing the position and type of background tile.

```javascript
return <div>{canvases}</div>;
```
The component returns JSX that represents the UI structure.

It renders a <div> containing all the generated `MapCell` components to display the background tiles of the level.

2. LevelPlacementLayer

this component dynamically renders the placements of the level, positioning them based on their display coordinates and rendering their components accordingly, it also applies z-indexing based on the placement's zIndex method

```javascript
export default function LevelPlacementsLayer({ level }) {
```
This function is exported as the default export.

It is a React functional component named `LevelPlacementsLayer`.

The component receives props, and it expects a prop named `level` which contains information about the current level, including the placements.

```javascript
return level.placements
    .filter((placement) => {
        return !placement.hasBeenCollected;
    })
```
It filters the `level.placements` array to include only those placements that have not been collected (`!placement.hasBeenCollected`).

```javascript
.map((placement) => {
    // Wrap each Sprite in a positioned div
    const [x, y] = placement.displayXY();
    const style = {
        position: "absolute",
        transform: `translate3d(${x}px, ${y}px, 0)`,
        zIndex: placement.zIndex(),
    };

    return (
        <div key={placement.id} style={style}>
            {placement.renderComponent()}
        </div>
    );
});
```
It maps each placement to a JSX element.
For each placement, it calculates its display position `(x, y)` using the `placement.displayXY()` method.

It creates a style object containing the CSS properties for absolute positioning and transforms for smooth rendering.

The JSX returned is a <div> element wrapping around the placement's rendered component obtained through `placement.renderComponent()`.

Each <div> element has a unique key based on the placement's ID.

The mapped JSX elements are returned as an array.

3. MapCell

This component serves to render a single cell in the game map, positioning it appropriately and displaying its graphical representation using the <Sprite> element

```javascript
export default function MapCell({ x, y, frameCoord }) {
```

This function is exported as the default export.

It is a React functional component named `MapCell`.

The component receives props `x, y,` and `frameCoord`.

```javascript
return (
    <div
        style={{
            position: "absolute",
            left: x * CELL_SIZE,
            top: y * CELL_SIZE,
        }}
    >
        <Sprite frameCoord={frameCoord} />
    </div>
);
```
The component returns JSX that represents the UI structure.

It renders a <div> element positioned absolutely at the coordinates `(x * CELL_SIZE, y * CELL_SIZE)` on the map.

Inside the <div>, it renders a <Sprite> component with props `frameCoord` representing the graphical representation of the cell.

4. RenderLevel

this component manages the rendering of the game level, including background, placements, and various UI elements based on the current level state

```javascript
import styles from "./RenderLevel.module.css";
import { THEME_BACKGROUNDS } from "../../helpers/consts";
import LevelBackgroundTilesLayer from "./LevelBackgroundTilesLayer";
import LevelPlacementsLayer from "./LevelPlacementsLayer";
import { useEffect, useState } from "react";
import { LevelState } from "../../classes/LevelState";
import FlourCount from "../hud/FlourCount";
import LevelCompleteMessage from "../hud/LevelCompleteMessage";
import DeathMessage from "../hud/DeathMessage";
import { useRecoilValue } from "recoil";
import { currentLevelIdAtom } from "../../atoms/currentLevelIdAtom";

export default function RenderLevel() {

        const [level, setLevel] = useState(null);
        const currentLevelId = useRecoilValue(currentLevelIdAtom);


            useEffect(() => {
                // Create and subscribe to state changes
                const levelState = new LevelState(currentLevelId, (newState) => {
                    setLevel(newState);
                });


                setLevel(levelState.getState());


        //Destroy method when this component unmounts for cleanup
        return () => {
        levelState.destroy();
    };
            }, [currentLevelId]);

    if (!level) {
        return null;
    }

    const cameraTranslate = `translate3d(${level.cameraTransformX}, ${level.cameraTransformY}, 0)`;

    return (
        <div
            className={styles.fullScreenContainer}
            style={{
                background: THEME_BACKGROUNDS[level.theme],
            }}
        >
            <div className={styles.gameScreen}>
                <div
                    style={{
                        transform: cameraTranslate,
                    }}
                >
                    <LevelBackgroundTilesLayer level={level}/>
                    <LevelPlacementsLayer level={level}/>
                </div>
            </div>
            <FlourCount level={level}/>
            {level.isCompleted && <LevelCompleteMessage/>}
            {level.deathOutcome && <DeathMessage level={level}/>}
        </div>
    );
}
```
* State and Effects:

The component uses the `useState` hook to manage the `level` state, which holds the current state of the game level.

It uses the `useRecoilValue` hook to access the current level ID from Recoil state.

The `useEffect` hook is employed to handle the creation and subscription to state changes of the `LevelState` class instance, which manages the state of the game level.

Within the `useEffect` hook, when the `currentLevelId` changes, a new `LevelState` instance is created with the updated level ID, and the component subscribes to its state changes by updating the `level` state with the new state.

* Rendering:

If the `level` state is null, the component returns null.

Otherwise, it renders the game level UI, including the background, placements, flour count, level complete message, and death message.

The background is styled based on the current theme using the `THEME_BACKGROUNDS` constant.

The placements and background tiles layers are rendered with the `LevelBackgroundTilesLayer` and `LevelPlacementsLayer` components, respectively.

The camera translation is applied to the game screen to implement the camera movement effect.

The flour count, level complete message, and death message are conditionally rendered based on the `level` state properties.

* CSS Styling:

The component applies CSS styles defined in the `RenderLevel.module.css` file.

5. RenderLevel.module.css

```CSS
.fullScreenContainer {
    align-items: center;
    display: flex;
    inset: 0;
    justify-content: center;
    position: absolute;
}

.gameScreen {
    width: var(--game-viewport-width);
    height: var(--game-viewport-height);
    transform: scale(var(--pixel-size));

    /*outline: 2px solid red;*/
}
```

* fullScreenContainer

This class defines a container that covers the entire screen.

`align-items: center;` and `justify-content: center; `are used to horizontally and vertically center its child elements.

`display: flex;` turns the container into a flex container, allowing for easy alignment of its children.

`position: absolute;` positions the container absolutely within its containing element, likely the entire browser window.

`inset: 0;` sets all four sides of the container to be flush with the edges of its containing element.

* gameScreen

This class is applied to the game screen element within the `fullScreenContainer`.
`width: var(--game-viewport-width);` and `height: var(--game-viewport-height);` set the width and height of the game screen based on custom CSS variables.

`transform: scale(var(--pixel-size));` applies a scaling transformation to the game screen based on another custom CSS variable, likely to control the size of pixels or elements within the game.


## object-graphics
1. Body

this component is responsible for rendering the body of the hero character in the game, including the option to show a shadow beneath the hero's body

```javascript
export default function Body({ frameCoord, yTranslate, showShadow }) {
```
This function is exported as the default export.

It is a React functional component named `Body`.

It receives three props: `frameCoord`, `yTranslate`, and `showShadow`.

```javascript
return (
    <div className={styles.hero}>
        <div>{showShadow && <Sprite frameCoord={TILES.SHADOW}/>}</div>
        <div
            className={styles.heroBody}
            style={{
                transform: `translateY(${yTranslate}px)`,
            }}
        >
            <Sprite frameCoord={frameCoord} size={32}/>
        </div>
    </div>
);
```
The component returns JSX that represents the UI structure.

It wraps the hero's body in a <div> element with the class `styles.hero`, applying CSS styles defined in the `Hero.module.css file`.

It conditionally renders a shadow sprite if `showShadow` prop is `true`.

The hero's body is rendered inside another <div> element with the class `styles.heroBody`. The `yTranslate` prop is used to apply vertical translation to the hero's body.

Inside the hero's body <div>, a <Sprite> component is used to render the graphical representation of the hero's body based on the `frameCoord` prop. The `size` prop is set to `32` to specify the size of the sprite.

2. ElevatedSprite

this component is responsible for rendering a sprite that appears elevated above the ground in the game, including the shadow beneath the sprite.

```javascript
export default function ElevatedSprite({
    frameCoord,
    size = CELL_SIZE,
    pxAboveGround = 3,
}) 
```
This function is exported as the default export.

It is a React functional component named `ElevatedSprite`.

It receives three props: `frameCoord`, `size`, and `pxAboveGround`.

`frameCoord`: The coordinate of the sprite frame to render.

`size`: The size of the sprite (defaulted to CELL_SIZE constant).

`pxAboveGround`: The number of pixels above the ground the sprite should appear (defaulted to 3 pixels).

```javascript
return (
    <div className={styles.elevatedSprite}>
        <Sprite frameCoord={TILES.SHADOW} />
        <div
            className={styles.bodyContainer}
            style={{
                transform: `translateY(${-pxAboveGround}px)`,
            }}
        >
            <Sprite frameCoord={frameCoord} size={size} />
        </div>
    </div>
);
```
The component returns JSX that represents the UI structure.

It wraps the elevated sprite in a <div> element with the class `styles.elevatedSprite`, applying CSS styles defined in the `ElevatedSprite.module.css` file.

It renders a shadow sprite using the <Sprite> component with the `TILES.SHADOW` frame coordinate.

Inside another <div> element with the class `styles.bodyContainer`, it applies a vertical translation to the sprite to position it above the ground using the `pxAboveGround` prop.

Inside the body container <div>, a <Sprite> component is used to render the main graphical representation of the sprite based on the `frameCoord` prop. The size prop specifies the `size` of the sprite.

3. ElevatedSprite module css

these styles ensure that the main body of the srpite (`bodyContainer`) is positioned absolutely within the container of the elevated sprite (`elevatedSprite`), allowing for proper layering and positioning of the sprite elements.

```CSS
.elevatedSprite {
    position: relative;
}

.bodyContainer {
    position: absolute;
    left: 0;
    top: 0;
}
```
* elevatedSprite:

This class is applied to the outer container of the elevated sprite.
`position: relative;` specifies that positioning of child elements will be relative to this container.

* bodyContainer:

This class is applied to the container wrapping the main body of the sprite.
`position: absolute;` positions the container absolutely within its relative parent, `.elevatedSprite`.

`left: 0;` and `top: 0;` set the position of the container to the top-left corner of its relative parent.

4. FlyingEnemyPlacement

this class represents a flying enemy placement in the game, defining its behavior and graphical representation.

```javascript
export class FlyingEnemyPlacement extends GroundEnemyPlacement {
```
Declares a class named `FlyingEnemyPlacement` which extends `GroundEnemyPlacement`, implying that it inherits properties and methods from `GroundEnemyPlacement`.

```javascript
constructor(properties, level) {
    super(properties, level);
    this.tickBetweenMovesInterval = 20;
    this.ticksUntilNextMove = this.tickBetweenMovesInterval;
}
```
The constructor method initializes instances of `FlyingEnemyPlacement`.

It calls the constructor of the parent class `GroundEnemyPlacement` with the provided properties and level.

Sets `tickBetweenMovesInterval` to 20, specifying the interval between moves.
Initializes `ticksUntilNextMove` to the interval, ensuring the enemy moves immediately.

```javascript
renderComponent() {
    const frameCoord =
        this.spriteFacingDirection === DIRECTION_LEFT
            ? TILES.ENEMY_FLYING_LEFT
            : TILES.ENEMY_FLYING_RIGHT;
    return <Body frameCoord={frameCoord} yTranslate={-3} showShadow={true} />;
}
```
Overrides the `renderComponent()` method inherited from the parent class.

Determines the appropriate sprite frame coordinate based on the direction the enemy is facing (`spriteFacingDirection`).

Renders the graphical representation of the flying enemy using the `Body` component with the specified `frameCoord`, `yTranslate`, and `showShadow` props.

5. GroundEnemyPlacement

this class represents a ground enemy placement in the game, defining its behavior and graphical representation

```javascript
export class GroundEnemyPlacement extends BodyPlacement {
```
Declares a class named `GroundEnemyPlacement`, extending the `BodyPlacement` class, implying inheritance of properties and methods.

```javascript
constructor(properties, level) {
    super(properties, level);
    this.tickBetweenMovesInterval = 28;
    this.ticksUntilNextMove = this.tickBetweenMovesInterval;
}
```
Initializes instances of `GroundEnemyPlacement`.

Calls the constructor of the parent class `BodyPlacement` with provided properties and level.

Sets `tickBetweenMovesInterval` to 28, determining the interval between moves.

Initializes `ticksUntilNextMove` to the interval, ensuring the enemy moves immediately.

```javascript
tickAttemptAiMove() {
    if (this.ticksUntilNextMove > 0) {
        this.ticksUntilNextMove -= 1;
        return;
    }
    this.internalMoveRequested(this.movingPixelDirection);
}
```
Implements AI behavior for the ground enemy's movement.

Decrements `ticksUntilNextMove` until it reaches 0, at which point it requests an internal move.

```javascript
    internalMoveRequested(direction) {
        //Attempt to start moving
        if (this.movingPixelsRemaining > 0) {
            return;
        }

        if (this.isSolidAtNextPosition(direction)) {
            this.switchDirection();
            return;
        }
```

Handles initiating movement for the ground enemy

Checks if movement is possible and starts the move if conditions are met.

```javascript
    switchDirection() {
        this.movingPixelDirection =
            this.movingPixelDirection === DIRECTION_LEFT
                ? DIRECTION_RIGHT
                : DIRECTION_LEFT;
    }
```
Handles switching the direction of movement for the ground enemy.

```javascript
renderComponent() {
    const frameCoord =
        this.spriteFacingDirection === DIRECTION_LEFT
            ? TILES.ENEMY_LEFT
            : TILES.ENEMY_RIGHT;
    return (
        <Body
            frameCoord={frameCoord}
            yTranslate={this.getYTranslate()}
            showShadow={true}
        />
    );
}
```

Overrides the `renderComponent()` method inherited from the parent class.

Determines the appropriate sprite frame coordinate based on the direction the enemy is facing.

Renders the graphical representation of the ground enemy using the `Body` component with specified props.

6. Hero module css

```CSS
.hero {
    position: relative;
}

.heroBody {
    position: absolute;
    left: -8px;
    top: -19px;
}
```
.
* hero:

Sets the positioning context for the hero and its body.

`position: relative;`: Establishes the hero's container as the positioning context for its child elements.

* heroBody:

Defines the positioning of the hero's body within its container.

`position: absolute;`: Positions the hero's body absolutely within its container, allowing precise placement.

`left: -8px;`: Adjusts the horizontal position of the hero's body 8 pixels to the left relative to its container's left edge.

`top: -19px;`: Adjusts the vertical position of the hero's body 19 pixels up relative to its container's top edge.

7. Sprite

```javascript
import React from "react";
import { useEffect, useRef } from "react";
import { CELL_SIZE } from "../../helpers/consts";
import { useRecoilValue } from "recoil";
import { spriteSheetImageAtom } from "../../atoms/spriteSheetImageAtom";

function Sprite({ frameCoord, size = 16 }) {
  const spriteSheetImage = useRecoilValue(spriteSheetImageAtom);
  const canvasRef = useRef();
  useEffect(() => {
    /** @type {HTMLCanvasElement} */
    const canvasEl = canvasRef.current;
    const ctx = canvasEl.getContext("2d");

    //Clear out anything in the canvas tag
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

    //Draw a graphic to the canvas tag
    const tileSheetX = Number(frameCoord.split("x")[0]);
    const tileSheetY = Number(frameCoord.split("x")[1]);

    ctx.drawImage(
        spriteSheetImage, // Image to pull from
        tileSheetX * CELL_SIZE, // Left X corner of frame
        tileSheetY * CELL_SIZE, // Top Y corner of frame
        size, //How much to crop from the sprite sheet (X)
        size, //How much to crop from the sprite sheet (Y)
        0, //Where to place this on canvas tag X (0)
        0, //Where to place this on canvas tag Y (0)
        size, //How large to scale it (X)
        size //How large to scale it (Y)
    );
  }, [spriteSheetImage, frameCoord, size]);

  return <canvas width={size} height={size} ref={canvasRef} />;
}

const MemoizedSprite = React.memo(Sprite);
export default MemoizedSprite;
```

* Imports:

`React`: Required for defining React components.
`useEffect`: Hook for performing side effects in function components.
`useRef`: Hook for creating mutable references.
`CELL_SIZE`: Constant defining the size of each cell in the sprite sheet.
`useRecoilValue`: Hook for reading a value from a Recoil atom.
`spriteSheetImageAtom`: Atom representing the sprite sheet image.

* Function Component:

Accepts props: `frameCoord` (coordinates of the frame in the sprite sheet), `size` (optional size of the frame, default is 16).

Uses `useRecoilValue` to obtain the sprite sheet image from the Recoil state.

Utilizes `useRef` to create a reference to the canvas element.

Inside the `useEffect` hook:
Retrieves the canvas context (`ctx`) from the canvas element.
Clears any existing content in the canvas.
Draws the specified frame from the sprite sheet image onto the canvas.

The `useEffect` hook runs whenever the `spriteSheetImage`, `frameCoord`, or `size` props change.

Returns a canvas element with the specified size, using the `canvasRef` created with `useRef`.

* Memoization:

Wraps the `Sprite` component with `React.memo` to memoize it, preventing unnecessary re-renders if props haven't changed.

# game-objects
1. BodyPlacement

the `BodyPlacement` class encompasses the logic for managing body placements in the game world, including movement, collision detection, interaction handling, and rendering. It plays a crucial role in the gameplay mechanics and ensures consistent behavior for body placements throughout the game

```javascript
import { Placement } from "./Placement";
import {
    BODY_SKINS,
    DIRECTION_LEFT,
    DIRECTION_RIGHT,
    directionUpdateMap,
    PLACEMENT_TYPE_CELEBRATION,
    Z_INDEX_LAYER_SIZE,
} from "../helpers/consts";
import { Collision } from "../classes/Collision";

export class BodyPlacement extends Placement {
    getCollisionAtNextPosition(direction) {
        const { x, y } = directionUpdateMap[direction];
        const nextX = this.x + x;
        const nextY = this.y + y;
        return new Collision(this, this.level, {
            x: nextX,
            y: nextY,
        });
    }

    getLockAtNextPosition(direction) {
        const collision = this.getCollisionAtNextPosition(direction);
        return collision.withLock();
    }

    isSolidAtNextPosition(direction) {

        // Check for ice corner...
        const onIceCorner = new Collision(this, this.level).withIceCorner();
        if (onIceCorner?.blocksMovementDirection(direction)) {
            return true;
        }


        const collision = this.getCollisionAtNextPosition(direction);
        const isOutOfBounds = this.level.isPositionOutOfBounds(
            collision.x,
            collision.y
        );
        if (isOutOfBounds) {
            return true;
        }
        return Boolean(collision.withSolidPlacement());
    }

    updateFacingDirection() {
        if (
            this.movingPixelDirection === DIRECTION_LEFT ||
            this.movingPixelDirection === DIRECTION_RIGHT
        ) {
            this.spriteFacingDirection = this.movingPixelDirection;
        }
    }

    updateWalkFrame() {
        this.spriteWalkFrame = this.spriteWalkFrame === 1 ? 0 : 1;
    }

    tick() {
        this.tickMovingPixelProgress();
        this.tickAttemptAiMove();
    }

    tickMovingPixelProgress() {
        if (this.movingPixelsRemaining === 0) {
            return;
        }
        this.movingPixelsRemaining -= this.travelPixelsPerFrame;
        if (this.movingPixelsRemaining <= 0) {
            this.movingPixelsRemaining = 0;
            this.onDoneMoving();
        }
    }

    onDoneMoving() {
        //Update my x/y!
        const { x, y } = directionUpdateMap[this.movingPixelDirection];
        this.x += x;
        this.y += y;
        this.handleCollisions();
        this.onPostMove();
    }

    onPostMove() {
        return null;
    }

    onAutoMovement(_direction) {
        return null;
    }


    handleCollisions() {
        // handle collisions!
        const collision = new Collision(this, this.level);

        this.skin = BODY_SKINS.NORMAL;
        const changesHeroSkin = collision.withChangesHeroSkin();
        if (changesHeroSkin) {
            this.skin = changesHeroSkin.changesHeroSkinOnCollide();
        }

        // Adding to inventory
        const collideThatAddsToInventory = collision.withPlacementAddsToInventory();
        if (collideThatAddsToInventory) {
            collideThatAddsToInventory.collect();
            this.level.addPlacement({
                type: PLACEMENT_TYPE_CELEBRATION,
                x: this.x,
                y: this.y,
            });
        }

        // Auto moving (Conveyors, Ice, etc)
        const autoMovePlacement = collision.withPlacementMovesBody();
        if (autoMovePlacement) {
            this.onAutoMovement(autoMovePlacement.autoMovesBodyOnCollide(this));
        }

        // Purple switches
        if (collision.withDoorSwitch()) {
            this.level.switchAllDoors();
        }


        // Damaging and death
        const takesDamages = collision.withSelfGetsDamaged();
        if (takesDamages) {
            this.level.setDeathOutcome(takesDamages.type);
        }

        // Finishing the level
        const completesLevel = collision.withCompletesLevel();
        if (completesLevel) {
            this.level.completeLevel();
        }
    }

    getYTranslate() {
        // Stand on ground when not moving
        if (this.movingPixelsRemaining === 0 || this.skin !== BODY_SKINS.NORMAL) {
            return 0;
        }

        //Elevate ramp up or down at beginning/end of movement
        const PIXELS_FROM_END = 2;
        if (
            this.movingPixelsRemaining < PIXELS_FROM_END ||
            this.movingPixelsRemaining > 16 - PIXELS_FROM_END
        ) {
            return -1;
        }

        // Highest in the middle of the movement
        return -2;
    }

    zIndex() {
        return this.y * Z_INDEX_LAYER_SIZE;
    }
}
```
* Collision Detection:

Provides methods to check for collisions at the next position and determine if the next position contains a solid object.
Handles various collision scenarios such as ice corners, out-of-bounds positions, and collisions with solid placements.

* Movement Handling:

Implements methods to update the facing direction and walk frame of the body based on movement direction.
Manages the progress of moving pixels and handles movement completion.
Defines methods for post-move actions and automatic movement triggered by specific placements such as conveyors and ice.

* Collision Handling:

Deals with collisions between the body placement and other game elements.
Updates the body's skin based on collision outcomes.
Handles interactions like collecting items, triggering celebrations, activating switches, taking damage, and completing levels.

* Rendering:

Provides a method to determine the Y translation for rendering the body placement.
Calculates the Z-index based on the placement's Y-coordinate to handle rendering order in the game world.

2. CelebrationPlacement

the `CelebrationPlacement` class embodies the logic for managing and rendering celebration particles in the game world. it handles frame progession, deletion, Z-index calculation, and rendering to provide visual feedback for celebratory events in the game.

```javascript
import { Placement } from "./Placement";
import { Z_INDEX_LAYER_SIZE } from "../helpers/consts";
import Sprite from "../components/object-graphics/Sprite";
import { TILES } from "../helpers/tiles";

export class CelebrationPlacement extends Placement {
    constructor(properties, level) {
        super(properties, level);
        this.frame = 1;
    }

    tick() {
        if (this.frame <= 8) {
            this.frame += 0.5;
            return;
        }
        this.level.deletePlacement(this);
    }

    zIndex() {
        return this.y * Z_INDEX_LAYER_SIZE + 2;
    }

    renderComponent() {
        const frameCoord = `PARTICLE_${Math.ceil(this.frame)}`;
        return <Sprite frameCoord={TILES[frameCoord]} />;
    }
}
```
* Constructor:

Initializes the placement with the given properties and assigns an initial frame value of 1.

* Tick Method:

Increments the frame value by 0.5 on each tick until it reaches 8.
Deletes the placement from the level once the frame value exceeds 8.

* Z-Index Calculation:

Calculates the Z-index based on the placement's Y-coordinate to ensure proper rendering order in the game world.
Adds an offset of 2 to the calculated Z-index to prioritize rendering above other placements.

* Rendering:

Renders the celebration particles using a Sprite component.
Determines the frame coordinate based on the current frame value and retrieves the corresponding tile from the TILES mapping.

3. DoorSwitchPlacement

the `DoorSwitchPlacement` class encapsulates the logic for handling collisions with door switches and rendering them visually in the game world. It provides functionality to interact with doors when collided with by a compactible body.

```javascript
import { Placement } from "./Placement";
import Sprite from "../components/object-graphics/Sprite";
import { TILES } from "../helpers/tiles";

export class DoorSwitchPlacement extends Placement {
    switchesDoorsOnCollide(body) {
        return body.interactsWithGround;
    }

    renderComponent() {
        return <Sprite frameCoord={TILES.PURPLE_BUTTON} />;
    }
}
```

* Switches Doors on Collision:

Implements the `switchesDoorsOnCollide` method, which determines whether the switch should activate or deactivate doors based on the body it collides with.

The method returns `true` if the colliding body interacts with the ground, indicating that it's capable of toggling doors.

* Rendering:

Overrides the `renderComponent` method to render the door switch using a `Sprite` component.
Uses the `TILES.PURPLE_BUTTON` frame coordinate to display the visual representation of the door switch.

4. FirePickupPlacement

the `FirePickupPlacement` class encapsulates the logic for handling collisions with fire pickup items and rendering them visually in the game world It provides functionality to add the corresponding item to the player's inventory upon collision

```javascript
import { Placement } from "./Placement";
import { TILES } from "../helpers/tiles";
import Sprite from "../components/object-graphics/Sprite";

export class FirePickupPlacement extends Placement {
    addsItemToInventoryOnCollide() {
        return this.type;
    }

    renderComponent() {
        return <Sprite frameCoord={TILES.FIRE_PICKUP} />;
    }
}
```
* Adding Item to Inventory on Collision:

Implements the `addsItemToInventoryOnCollide` method, which indicates that when a player collides with this pickup, it adds a specific item to the inventory.

In this case, it returns the `type` of the pickup, implying that it adds a fire pickup item to the inventory.

* Rendering:

Overrides the `renderComponent` method to render the fire pickup using a `Sprite` component.

Uses the `TILES.FIRE_PICKUP` frame coordinate to display the visual representation of the fire pickup item.

5. FirePlacement

the `FirePlacement` class encapsulates the logic for handling collisions with fire obstacles, causing damage to the hero and changing its appearance upon collision. it handles the rendering of the fire animation in the game world.

```javascript
import { Placement } from "./Placement";
import Sprite from "../components/object-graphics/Sprite";
import {
    PLACEMENT_TYPE_HERO,
    PLACEMENT_TYPE_FIRE_PICKUP,
    BODY_SKINS,
} from "../helpers/consts";

export class FirePlacement extends Placement {
    damagesBodyOnCollide(body) {
        const { inventory } = this.level;
        if (
            body.type === PLACEMENT_TYPE_HERO &&
            !inventory.has(PLACEMENT_TYPE_FIRE_PICKUP)
        ) {
            return this.type;
        }
        return null;
    }

    changesHeroSkinOnCollide() {
        return BODY_SKINS.FIRE;
    }

    renderComponent() {
        const fireFrame = this.level.animatedFrames.fireFrame;
        return <Sprite frameCoord={fireFrame} />;
    }
}
```
* Damaging Bodies on Collision:

Implements the `damagesBodyOnCollide` method to determine if the fire damages a body upon collision.

If the colliding body is the hero and does not have a fire pickup item in its inventory, it returns the type of the fire placement, indicating that the hero should take damage. Otherwise, it returns `null`.

* Changing Hero Skin on Collision:

Implements the `changesHeroSkinOnCollide` method to specify the change in the hero's skin upon collision with fire.

It returns the `BODY_SKINS.FIRE` constant, indicating that the hero's skin should change to a fiery appearance.

* Rendering:

Overrides the `renderComponent` method to render the fire using a `Sprite` component.

Retrieves the current frame of the fire animation from the `LevelAnimatedFrames` instance and renders the fire accordingly.

6. FlourPlacement

 the FlourPlacement class encapsulates the logic for handling collisions with flour pickups and rendering them in the game world.

```javascript
import { Placement } from "./Placement";
import ElevatedSprite from "../components/object-graphics/ElevatedSprite";
import { TILES } from "../helpers/tiles";
import { PLACEMENT_TYPE_FLOUR } from "../helpers/consts";

export class FlourPlacement extends Placement {
    addsItemToInventoryOnCollide() {
        return PLACEMENT_TYPE_FLOUR;
    }

    renderComponent() {
        return <ElevatedSprite frameCoord={TILES.FLOUR} />;
    }
}
```
* Adding Item to Inventory on Collision:

Implements the `addsItemToInventoryOnCollide` method to specify that when a body collides with flour, it should be added to the inventory.

Returns the constant `PLACEMENT_TYPE_FLOUR`, indicating that flour should be added to the inventory upon collision.

* Rendering:

Overrides the `renderComponent` method to render the flour using an `ElevatedSprite` component.

The `ElevatedSprite` component renders the flour sprite with a shadow effect to give it a three-dimensional appearance.

7. FlyingEnemyPlacement

the `FlyingEnemyPlacement` class encapsulates the logic for rendering flying enemies in the game world.

```javascript
import { GroundEnemyPlacement } from "./GroundEnemyPlacement";
import { DIRECTION_LEFT } from "../helpers/consts";
import { TILES } from "../helpers/tiles";
import Body from "../components/object-graphics/Body";

export class FlyingEnemyPlacement extends GroundEnemyPlacement {
    constructor(properties, level) {
        super(properties, level);
        this.tickBetweenMovesInterval = 20;
        this.ticksUntilNextMove = this.tickBetweenMovesInterval;
        this.turnsAroundAtWater = false;
        this.interactsWithGround = false;
    }

    renderComponent() {
        const frameCoord =
            this.spriteFacingDirection === DIRECTION_LEFT
                ? TILES.ENEMY_FLYING_LEFT
                : TILES.ENEMY_FLYING_RIGHT;
        return <Body frameCoord={frameCoord} yTranslate={-3} showShadow={true} />;
    }
}
```
* Constructor:

Extends the constructor of the `GroundEnemyPlacement` class to initialize properties specific to flying enemies.

Sets the `tickBetweenMovesInterval` to control the interval between moves.

Initializes the `ticksUntilNextMove` property to manage the timing of the next move.

Sets `turnsAroundAtWater` to false and interactsWithGround to false since flying enemies don't interact with water or ground.

* Rendering:

Overrides the `renderComponent` method to render the flying enemy using a `Body` component.

Determines the frame coordinate based on the direction the enemy is facing and renders the appropriate sprite.

Applies a `yTranslate` of `-3` to adjust the vertical position of the enemy sprite.
Specifies `showShadow` as `true` to render a shadow effect below the flying enemy.

8. GoalPlacement

the `GoalPlacement` class encapsulates the logic for determining the state and rendering of the goal placement in the game world.

```javascript
import { Placement } from "./Placement";
import Sprite from "../components/object-graphics/Sprite";
import { TILES } from "../helpers/tiles";
import { PLACEMENT_TYPE_FLOUR } from "../helpers/consts";

export class GoalPlacement extends Placement {
    get isDisabled() {
        const nonCollectedFlour = this.level.placements.find((p) => {
            return p.type === PLACEMENT_TYPE_FLOUR && !p.hasBeenCollected;
        });
        return Boolean(nonCollectedFlour);
    }

    completesLevelOnCollide() {
        return !this.isDisabled;
    }
    renderComponent() {

        return (
            <Sprite
                frameCoord={this.isDisabled ? TILES.GOAL_DISABLED : TILES.GOAL_ENABLED}
            />
        );
    }
}
```
* isDisabled Getter:

Determines whether the goal is disabled based on the presence of non-collected flour placements in the level.

Uses the `find` method to search for non-collected flour placements in the level's placements array.

Returns `true` if there are non-collected flour placements, indicating that the goal is disabled.

* completesLevelOnCollide Method:

Overrides the `completesLevelOnCollid`e method to determine whether the level should be completed when collided with.

Returns `true` if the goal is not disabled, indicating that the level should be completed upon collision with the goal.

* Rendering:

Overrides the `renderComponent` method to render the goal placement.

Uses a `Sprite` component to render the goal sprite based on whether it's enabled or disabled.

Sets the frame coordinate of the sprite based on the `isDisabled` property, using either the enabled or disabled goal tile.

9. GroundEnemyPlacement
 
 the `GroundEnemyPlacement` class encapsulates the logic for the behavior and rendering of ground-based enemies in the game world.

 ```javascript
 import { TILES } from "../helpers/tiles";
import Body from "../components/object-graphics/Body";
import {
    DIRECTION_DOWN,
    DIRECTION_LEFT,
    DIRECTION_RIGHT,
    DIRECTION_UP,
} from "../helpers/consts";
import { BodyPlacement } from "./BodyPlacement";

export class GroundEnemyPlacement extends BodyPlacement {
    constructor(properties, level) {
        super(properties, level);
        this.tickBetweenMovesInterval = 28;
        this.ticksUntilNextMove = this.tickBetweenMovesInterval;
        this.turnsAroundAtWater = true;
        this.interactsWithGround = true;
        this.movingPixelDirection = properties.initialDirection ?? DIRECTION_RIGHT;
    }

    tickAttemptAiMove() {
        this.checkForOverlapWithHero();

        if (this.ticksUntilNextMove > 0) {
            this.ticksUntilNextMove -= 1;
            return;
        }
        this.internalMoveRequested(this.movingPixelDirection);
    }

    checkForOverlapWithHero() {
        const [myX, myY] = this.displayXY();
        const [heroX, heroY] = this.level.heroRef.displayXY();
        const xDiff = Math.abs(myX - heroX);
        const yDiff = Math.abs(myY - heroY);
        if (xDiff <= 2 && yDiff <= 2) {
            this.level.setDeathOutcome(this.type);
        }
    }

    internalMoveRequested(direction) {
        //Attempt to start moving
        if (this.movingPixelsRemaining > 0) {
            return;
        }

        if (this.isSolidAtNextPosition(direction)) {
            this.switchDirection();
            return;
        }

        //Start the move
        this.ticksUntilNextMove = this.tickBetweenMovesInterval;
        this.movingPixelsRemaining = 16;
        this.movingPixelDirection = direction;
        this.updateFacingDirection();
        this.updateWalkFrame();
    }

    onAutoMovement(direction) {
        this.internalMoveRequested(direction);
    }

    switchDirection() {
        const currentDir = this.movingPixelDirection;

        // Horizontal change
        if (currentDir === DIRECTION_LEFT || currentDir === DIRECTION_RIGHT) {
            this.movingPixelDirection =
                currentDir === DIRECTION_LEFT ? DIRECTION_RIGHT : DIRECTION_LEFT;
            return;
        }
        // Vertical change
        this.movingPixelDirection =

        currentDir === DIRECTION_UP ? DIRECTION_DOWN : DIRECTION_UP;
    }

    renderComponent() {
        const frameCoord =
            this.spriteFacingDirection === DIRECTION_LEFT
                ? TILES.ENEMY_LEFT
                : TILES.ENEMY_RIGHT;
        return (
            <Body
                frameCoord={frameCoord}
                yTranslate={this.getYTranslate()}
                showShadow={true}
            />
        );
    }
}
```

* Constructor:

Initializes properties specific to ground enemies, such as the interval between moves, the initial direction of movement, and flags for interaction with ground and water.

* tickAttemptAiMove Method:

Checks for overlap with the hero and sets the death outcome if they are too close.

Moves the enemy if the tick interval has elapsed.

* checkForOverlapWithHero Method:

Determines if the enemy is close enough to the hero to cause damage or death.

Compares the distance between the enemy and the hero and sets the death outcome if it's within a certain threshold.

* internalMoveRequested Method:

Initiates the movement of the enemy.
Checks if the next position is solid and switches direction if necessary.

Starts the movement if the conditions are met.

* onAutoMovement Method:

Handles automatic movement triggered by certain conditions, such as conveyor belts or ice.

Initiates movement in the specified direction.

* switchDirection Method:

Switches the direction of movement when encountering an obstacle or reaching a boundary.

Handles both horizontal and vertical changes in direction.

* renderComponent Method:

Renders the visual representation of the ground enemy.

Determines the frame coordinate based on the direction of movement and renders the corresponding sprite.

Adjusts the y-translate property to simulate elevation changes.

10. HeroPlacement
 
 the `HeroPlacement` class encapsulates the logic for controlling the hero character's movement, state, and visual representation within the game world.

```javascript
import Body from "../components/object-graphics/Body";
import {
    DIRECTION_LEFT,
    BODY_SKINS,
    HERO_RUN_1,
    HERO_RUN_2,
    Z_INDEX_LAYER_SIZE,
} from "../helpers/consts";
import { TILES } from "../helpers/tiles";
import { BodyPlacement } from "./BodyPlacement";

const heroSkinMap = {
    [BODY_SKINS.NORMAL]: [TILES.HERO_LEFT, TILES.HERO_RIGHT],
    [BODY_SKINS.WATER]: [TILES.HERO_WATER_LEFT, TILES.HERO_WATER_RIGHT],
    [BODY_SKINS.FIRE]: [TILES.HERO_FIRE_LEFT, TILES.HERO_FIRE_RIGHT],
    [BODY_SKINS.DEATH]: [TILES.HERO_DEATH_LEFT, TILES.HERO_DEATH_RIGHT],
    [BODY_SKINS.DEATH]: [TILES.HERO_DEATH_LEFT, TILES.HERO_DEATH_RIGHT],
    [BODY_SKINS.SCARED]: [TILES.HERO_DEATH_LEFT, TILES.HERO_DEATH_RIGHT],
    [BODY_SKINS.ICE]: [TILES.HERO_ICE_LEFT, TILES.HERO_ICE_RIGHT],
    [HERO_RUN_1]: [TILES.HERO_RUN_1_LEFT, TILES.HERO_RUN_1_RIGHT],
    [HERO_RUN_2]: [TILES.HERO_RUN_2_LEFT, TILES.HERO_RUN_2_RIGHT],
};

export class HeroPlacement extends BodyPlacement {
    constructor(properties, level) {
        super(properties, level);
        this.canCollectItems = true;
        this.canCompleteLevel = true;
        this.interactsWithGround = true;
    }

    controllerMoveRequested(direction) {
        //Attempt to start moving
        if (this.movingPixelsRemaining > 0) {
            return;
        }

        // Check for lock at next position
        const possibleLock = this.getLockAtNextPosition(direction);
        if (possibleLock) {
            possibleLock.unlock();
            return;
        }

        //Make sure the next space is available
        if (this.isSolidAtNextPosition(direction)) {
            return;
        }

        // Maybe hop out of non-normal skin
        if (this.skin === BODY_SKINS.WATER) {
            const collision = this.getCollisionAtNextPosition(direction);
            if (!collision.withChangesHeroSkin()) {
                this.skin = BODY_SKINS.NORMAL;
            }
        }

        //Start the move
        this.movingPixelsRemaining = 16;
        this.movingPixelDirection = direction;
        this.updateFacingDirection();
        this.updateWalkFrame();
    }

    onAutoMovement(direction) {
        this.controllerMoveRequested(direction);
    }

    zIndex() {
        return this.y * Z_INDEX_LAYER_SIZE + 1;
    }

    getFrame() {
        //Which frame to show?
        const index = this.spriteFacingDirection === DIRECTION_LEFT ? 0 : 1;

        // If dead, show the dead skin
        if (this.level.deathOutcome) {
            return heroSkinMap[BODY_SKINS.DEATH][index];
        }

        //Use correct walking frame per direction
        if (this.movingPixelsRemaining > 0 && this.skin === BODY_SKINS.NORMAL) {
            const walkKey = this.spriteWalkFrame === 0 ? HERO_RUN_1 : HERO_RUN_2;
            return heroSkinMap[walkKey][index];
        }

        return heroSkinMap[this.skin][index];
    }

    renderComponent() {
        const showShadow = this.skin !== BODY_SKINS.WATER;
        return (
            <Body
                frameCoord={this.getFrame()}
                yTranslate={this.getYTranslate()}
                showShadow={showShadow}
            />
        );
    }
}
```
* Constructor:

Initializes properties specific to the hero, such as the ability to collect items, complete levels, and interact with the ground.

* controllerMoveRequested Method:

Handles movement requested by the player's controller.

Checks for locks at the next position and unlocks them if present.

Checks if the next space is available for movement and starts the move if conditions are met.

Handles special cases like hopping out of non-normal skin when encountering obstacles.

* onAutoMovement Method:

Handles automatic movement triggered by certain conditions, such as conveyor belts or ice.

Initiates movement in the specified direction.

* zIndex Method:

Determines the z-index of the hero placement based on its y-coordinate, ensuring proper layering in the game world.

* getFrame Method:

Determines which frame of the hero sprite to show based on the direction of movement, skin type, and current state.

Handles different skins and walking animations, including special cases like death or running.

* renderComponent Method:

Renders the visual representation of the hero character.

Determines the frame coordinate based on the current state and renders the corresponding sprite.

Adjusts the y-translate property to simulate elevation changes, except when the hero is in the water.

11. IcePickupPlacement

 the `IcePickupPlacement` class encapsulates the logic for adding the ice pickup item to the player's inventory upon collision and rendering its visual representation in the game world.

 ```javascript
 import { Placement } from "./Placement";
import Sprite from "../components/object-graphics/Sprite";
import { TILES } from "../helpers/tiles";

export class IcePickupPlacement extends Placement {
    addsItemToInventoryOnCollide() {
        return this.type;
    }

    renderComponent() {
        return <Sprite frameCoord={TILES.ICE_PICKUP} />;
    }
}
```
* addsItemToInventoryOnCollide Method:

Specifies that colliding with this placement adds the ice pickup item to the player's inventory.

* renderComponent Method:

Renders the visual representation of the ice pickup object.

Uses the `Sprite` component to display the sprite corresponding to the ice pickup tile.

12. IcePlacement

the `IcePlacement` class encapsulates the logic for the behavior and rendering of ice tiles in the game world.

```javascript
import { Placement } from "./Placement";
import Sprite from "../components/object-graphics/Sprite";
import { TILES } from "../helpers/tiles";
import {
    DIRECTION_UP,
    DIRECTION_LEFT,
    DIRECTION_RIGHT,
    DIRECTION_DOWN,
    BODY_SKINS,
    ICE_CORNERS,
    PLACEMENT_TYPE_HERO,
    PLACEMENT_TYPE_ICE_PICKUP,
} from "../helpers/consts";

const iceTileCornerFramesMap = {
    [ICE_CORNERS.TOP_LEFT]: TILES.ICE_TOP_LEFT,
    [ICE_CORNERS.TOP_RIGHT]: TILES.ICE_TOP_RIGHT,
    [ICE_CORNERS.BOTTOM_LEFT]: TILES.ICE_BOTTOM_LEFT,
    [ICE_CORNERS.BOTTOM_RIGHT]: TILES.ICE_BOTTOM_RIGHT,
};

const iceTileCornerRedirection = {
    TOP_LEFT: {
        [DIRECTION_UP]: DIRECTION_RIGHT,
        [DIRECTION_LEFT]: DIRECTION_DOWN,
    },
    TOP_RIGHT: {
        [DIRECTION_UP]: DIRECTION_LEFT,
        [DIRECTION_RIGHT]: DIRECTION_DOWN,
    },
    BOTTOM_LEFT: {
        [DIRECTION_LEFT]: DIRECTION_UP,
        [DIRECTION_DOWN]: DIRECTION_RIGHT,
    },
    BOTTOM_RIGHT: {
        [DIRECTION_RIGHT]: DIRECTION_UP,
        [DIRECTION_DOWN]: DIRECTION_LEFT,
    },
};

const iceTileCornerBlockedMoves = {
    TOP_LEFT: {
        [DIRECTION_UP]: true,
        [DIRECTION_LEFT]: true,
    },
    TOP_RIGHT: {
        [DIRECTION_UP]: true,
        [DIRECTION_RIGHT]: true,
    },
    BOTTOM_LEFT: {
        [DIRECTION_DOWN]: true,
        [DIRECTION_LEFT]: true,
    },
    BOTTOM_RIGHT: {
        [DIRECTION_DOWN]: true,
        [DIRECTION_RIGHT]: true,
    },
};

export class IcePlacement extends Placement {
    constructor(properties, level) {
        super(properties, level);
        this.corner = properties.corner ?? null;
    }

    isSolidForBody(body) {
        const bodyIsBelow = this.y < body.y;
        if (bodyIsBelow && this.corner?.includes("BOTTOM")) {
            return true;
        }
        const bodyIsAbove = this.y > body.y;
        if (bodyIsAbove && this.corner?.includes("TOP")) {
            return true;
        }
        const bodyIsToLeft = this.x > body.x;
        if (bodyIsToLeft && this.corner?.includes("LEFT")) {
            return true;
        }
        const bodyIsToRight = this.x < body.x;
        if (bodyIsToRight && this.corner?.includes("RIGHT")) {
            return true;
        }

        return false;
    }

    blocksMovementDirection(direction) {
        if (this.corner) {
            return iceTileCornerBlockedMoves[this.corner][direction];
        }
        return false;
    }

    autoMovesBodyOnCollide(body) {
        if (
            body.type === PLACEMENT_TYPE_HERO &&
            this.level.inventory.has(PLACEMENT_TYPE_ICE_PICKUP)
        ) {
            return null;
        }

        const possibleRedirects = iceTileCornerRedirection[this.corner];
        if (possibleRedirects) {
            return possibleRedirects[body.movingPixelDirection];
        }
        return body.movingPixelDirection;
    }

    changesHeroSkinOnCollide() {
        if (this.level.inventory.has(PLACEMENT_TYPE_ICE_PICKUP)) {
            return BODY_SKINS.ICE;
        }

        return BODY_SKINS.SCARED;
    }

    renderComponent() {
        const frameCoord = this.corner
            ? iceTileCornerFramesMap[this.corner]
            : TILES.ICE;
        return <Sprite frameCoord={frameCoord} />;
    }
}
```
* Constructor:

Initializes the `corner` property, which indicates the position of the ice tile corner.

* isSolidForBody Method:

Determines if the ice tile is solid for a given body (e.g., player).

Checks the relative position of the body with respect to the ice tile corner to determine solidity.

* blocksMovementDirection Method:

Determines if movement in a specific direction is blocked by the ice tile corner.

* autoMovesBodyOnCollide Method:

Handles automatic movement of a body (e.g., player) upon collision with the ice tile.

Redirects the body's movement direction based on the ice tile corner's configuration.

* changesHeroSkinOnCollide Method:

Specifies the change in the hero's skin upon collision with the ice tile.

If the hero has an ice pickup item in the inventory, it changes the hero's skin to ice; otherwise, it changes the skin to "scared".

* renderComponent Method:

Renders the visual representation of the ice tile.

Determines the appropriate sprite frame coordinates based on the ice tile corner configuration.

13. KeyPlacement

the `KeyPlacement` class encapsulates the logic for the behavior and rendering of keys in the game world, allowing players to collect keys of different colors to unlock corresponding locks.

```javascript
import { Placement } from "./Placement";
import { LOCK_KEY_COLORS } from "../helpers/consts";
import ElevatedSprite from "../components/object-graphics/ElevatedSprite";
import { TILES } from "../helpers/tiles";

export class KeyPlacement extends Placement {
    constructor(properties, level) {
        super(properties, level);
        this.color = properties.color ?? LOCK_KEY_COLORS.BLUE;
    }

    addsItemToInventoryOnCollide() {
        return `KEY_${this.color}`;
    }

    renderComponent() {
        const frameCoord =
            this.color === LOCK_KEY_COLORS.BLUE ? TILES.BLUE_KEY : TILES.GREEN_KEY;
        return <ElevatedSprite frameCoord={frameCoord} />;
    }
}
```
* Constructor:

Initializes the `color` property, which determines the color of the key.

* addsItemToInventoryOnCollide Method:

Specifies the type of item to be added to the inventory when the key is collected.

The item type includes the color of the key.

* renderComponent Method:

Renders the visual representation of the key.

Determines the appropriate sprite frame coordinates based on the key's color.

Uses an `ElevatedSprite` component to render the key, indicating that it should be elevated above the ground.

14. LockPlacement

the `LockPlacement` class manages the behavior and visual representation of locks in the game, allowing players to unlock them using the corresponding keys.

```javascript
import { Placement } from "./Placement";
import { LOCK_KEY_COLORS } from "../helpers/consts";
import { TILES } from "../helpers/tiles";
import Sprite from "../components/object-graphics/Sprite";

export class LockPlacement extends Placement {
    constructor(properties, level) {
        super(properties, level);
        this.color = properties.color ?? LOCK_KEY_COLORS.BLUE;
        this.collectInFrames = 0;
    }

    isSolidForBody(_body) {
        return true;
    }

    tick() {
        if (this.collectInFrames > 0) {
            this.collectInFrames -= 1;
            if (this.collectInFrames === 0) {
                this.level.deletePlacement(this);
            }
        }
    }

    canBeUnlocked() {
        const requiredKey = `KEY_${this.color}`;
        return this.level.inventory.has(requiredKey);
    }

    unlock() {
        if (this.collectInFrames > 0) {
            return;
        }
        this.collectInFrames = 11;
    }

    renderComponent() {
        let frameCoord =
            this.color === LOCK_KEY_COLORS.BLUE ? TILES.BLUE_LOCK : TILES.GREEN_LOCK;

        if (this.collectInFrames > 0) {
            frameCoord = TILES.UNLOCKED_LOCK;
        }
        return <Sprite frameCoord={frameCoord} />;
    }
}
```

* Constructor:

Initializes the `color` property, which determines the color of the lock.

Initializes the `collectInFrames` property to manage the animation frames when the lock is unlocked.

* isSolidForBody Method:

Indicates that the lock is solid for any body, preventing bodies from passing through it.

* tick Method:

Decreases the `collectInFrames` counter if the lock is in the process of being collected.

Deletes the lock placement from the level once the collection animation is complete.

* canBeUnlocked Method:

Checks if the lock can be unlocked by verifying if the required key is present in the player's inventory.

* unlock Method:

Initiates the process of unlocking the lock by setting the `collectInFrames` counter to a value that triggers the unlock animation.

* renderComponent Method:

Determines the sprite frame coordinates based on the lock's color and current state (locked or unlocked).

Renders the appropriate sprite using the `Sprite` component.

15. Placement

this class is used for common functionality shared among different types of placements in the game, allowing for easier integration and maintenance of specific placement types through inheritance.

```javascript
import {
    DIRECTION_RIGHT,
    CELL_SIZE,
    DIRECTION_LEFT,
    DIRECTION_UP,
    BODY_SKINS,
} from "../helpers/consts";

export class Placement {
    constructor(properties, level) {
        this.id = properties.id;
        this.type = properties.type;
        this.x = properties.x;
        this.y = properties.y;
        this.level = level;
        this.skin = BODY_SKINS.NORMAL;
        this.travelPixelsPerFrame = 1.5;
        this.movingPixelsRemaining = 0;
        this.movingPixelDirection = DIRECTION_RIGHT;
        this.spriteFacingDirection = DIRECTION_RIGHT;
        this.spriteWalkFrame = 0;

        this.hasBeenCollected = false;
    }

    tick() {}

    tickAttemptAiMove() {
        return null;
    }


    isSolidForBody(_body) {
        return false;
    }

    addsItemToInventoryOnCollide() {
        return null;
    }

    autoMovesBodyOnCollide() {
        return false;
    }

    changesHeroSkinOnCollide() {
        return null;
    }

    switchesDoorsOnCollide() {
        return null;
    }
    damagesBodyOnCollide(_body) {
        return null;
    }

    completesLevelOnCollide() {
        return false;
    }

    displayXY() {
        if (this.movingPixelsRemaining > 0) {
            return this.displayMovingXY();
        }

        const x = this.x * CELL_SIZE;
        const y = this.y * CELL_SIZE;
        return [x, y];
    }

    displayMovingXY() {
        const x = this.x * CELL_SIZE;
        const y = this.y * CELL_SIZE;
        const progressPixels = CELL_SIZE - this.movingPixelsRemaining;
        switch (this.movingPixelDirection) {
            case DIRECTION_LEFT:
                return [x - progressPixels, y];
            case DIRECTION_RIGHT:
                return [x + progressPixels, y];
            case DIRECTION_UP:
                return [x, y - progressPixels];
            default:
                return [x, y + progressPixels];
        }
    }

    collect() {
        this.hasBeenCollected = true;

        this.level.inventory.add(this.addsItemToInventoryOnCollide());
    }

    canBeUnlocked() {
        return false;
    }


    zIndex() {
        return 1;
    }
    renderComponent() {
        return null;
    }
}
```
* Constructor:

Initializes properties such as `id`, `type`, `x`, `y`, `level`, `skin`, `travelPixelsPerFrame`, `movingPixelsRemaining`, `movingPixelDirection`, `spriteFacingDirection`, and `spriteWalkFrame`.

Sets `hasBeenCollected` to false.

* tick Method:

Allows for the execution of actions associated with the placement on each game tick.

* tickAttemptAiMove Method:

Provides a hook for subclasses to implement AI-driven movement logic.

* isSolidForBody Method:

Determines whether the placement is solid and affects the movement of a body.

* addsItemToInventoryOnCollide Method:

Specifies the item to be added to the inventory when a collision occurs.

* autoMovesBodyOnCollide Method:

Defines the movement behavior when a body collides with the placement.

* changesHeroSkinOnCollide Method:

Handles changes to the hero's skin upon collision.

* switchesDoorsOnCollide Method:

Defines behavior related to door switches upon collision.

* damagesBodyOnCollide Method:

Determines the effect on a body when it collides with the placement.

* completesLevelOnCollide Method:

Specifies whether the level should be completed when a collision occurs.

* displayXY Method:

Calculates the current position of the placement on the game screen.

* displayMovingXY Method:

Calculates the position of the placement while it is in motion.

* collect Method:

Marks the placement as collected and adds the corresponding item to the inventory.

* canBeUnlocked Method:

Determines whether the placement can be unlocked.

* zIndex Method:

Specifies the z-index of the placement for rendering.

* renderComponent Method:

Provides a placeholder for rendering the graphical representation of the placement.

16. RoamingEnemyPlacement

By extending the `GroundEnemyPlacement` class, `RoamingEnemyPlacement` inherits behavior related to ground-based enemy placements and builds upon it to implement the specific roaming behavior. This approach allows for code reuse and modularity, making it easier to manage different types of enemy placements with varying behaviors.

```javascript
import { GroundEnemyPlacement } from "./GroundEnemyPlacement";
import Body from "../components/object-graphics/Body";
import { TILES } from "../helpers/tiles";
import {
    DIRECTION_RIGHT,
    DIRECTION_LEFT,
    DIRECTION_UP,
    DIRECTION_DOWN,
} from "../helpers/consts";
import { Collision } from "../classes/Collision";

export class RoamingEnemyPlacement extends GroundEnemyPlacement {
    constructor(properties, level) {
        super(properties, level);
        this.tickBetweenMovesInterval = 48;
        this.ticksUntilNextMove = this.tickBetweenMovesInterval;
        this.turnsAroundAtWater = true;
        this.interactsWithGround = true;
    }

    onPostMove() {
        // Do not choose next move if we are on an automoving tile
        const collision = new Collision(this, this.level);
        if (collision.withPlacementMovesBody()) {
            return;
        }
        // Randomly choose a new direction
        const directions = [
            DIRECTION_UP,
            DIRECTION_DOWN,
            DIRECTION_LEFT,
            DIRECTION_RIGHT,
        ].filter((direction) => {
            return !this.isSolidAtNextPosition(direction);
        });
        if (directions.length) {
            this.movingPixelDirection =
                directions[Math.floor(Math.random() * directions.length)];
        }
    }

    renderComponent() {
        return <Body frameCoord={TILES.ENEMY_ROAMING} yTranslate={0} />;
    }
}
```
* Constructor:

Inherits properties and initializes specific parameters for roaming enemies, such as `tickBetweenMovesInterval`, `ticksUntilNextMove`, `turnsAroundAtWater`, and `interactsWithGround`.

Sets the initial values for the tick intervals and movement parameters.

* onPostMove Method:

Overrides the `onPostMove` method inherited from the base class.

Checks if the placement is on an auto-moving tile using collision detection.

If not on an auto-moving tile, randomly chooses a new direction for movement.

Chooses from available directions that are not blocked by solid placements.

* renderComponent Method:

Overrides the `renderComponent` method inherited from the base class.

Renders the graphical representation of the roaming enemy using the specified sprite.

17. SwitchableDoorPlacement

This class allows for the creation of switchable doors that can be raised or lowered dynamically during gameplay. It provides methods to toggle the state of the door and determines whether the door is solid for bodies based on its current state. Additionally, it handles rendering the appropriate sprite representation of the door based on its state.

```javascript
import { Placement } from "./Placement";
import Sprite from "../components/object-graphics/Sprite";
import { TILES } from "../helpers/tiles";

export class SwitchableDoorPlacement extends Placement {
    constructor(properties, level) {
        super(properties, level);
        this.isRaised = properties.isRaised ?? false;
    }

    toggleIsRaised() {
        this.isRaised = !this.isRaised;
    }

    isSolidForBody() {
        return this.isRaised;
    }

    renderComponent() {
        const frameCoord = this.isRaised
            ? TILES.PURPLE_DOOR_SOLID
            : TILES.PURPLE_DOOR_OUTLINE;
        return <Sprite frameCoord={frameCoord} />;
    }
}
```

* Constructor:

Initializes the `isRaised` property based on the provided `properties` object or sets it to `false` by default.

* toggleIsRaised Method:

Toggles the state of the `isRaised` property between `true` and `false`. This method is used to change the state of the door.

* isSolidForBody Method:

Determines whether the door is solid for a body. If the door is raised (`isRaised` is `true`), it is considered solid, preventing bodies from passing through it. If the door is lowered (`isRaised` is `false`), it is not considered solid, allowing bodies to pass through it.

* renderComponent Method:

Renders the graphical representation of the switchable door based on its current state (`isRaised`).

If the door is raised, it renders a solid door sprite (`TILES.PURPLE_DOOR_SOLID`).

If the door is lowered, it renders an outline door sprite (`TILES.PURPLE_DOOR_OUTLINE`).

18. WallPlacement

This class allows for the creation of wall placements that act as solid obstacles in the game. It handles rendering the appropriate sprite representation of the wall based on the current theme of the level.

```javascript
import { Placement } from "./Placement";
import Sprite from "../components/object-graphics/Sprite";
import { THEME_TILES_MAP } from "../helpers/consts";

export class WallPlacement extends Placement {
    isSolidForBody(_body) {
        return true;
    }

    renderComponent() {
        const wallTileCoord = THEME_TILES_MAP[this.level.theme].WALL;
        return <Sprite frameCoord={wallTileCoord} />;
    }
}
```

* isSolidForBody Method:

Determines whether the wall is solid for a body. Since walls are solid obstacles, this method always returns `true`, indicating that bodies cannot pass through walls.

* renderComponent Method:

Renders the graphical representation of the wall based on the current theme of the level.

It retrieves the appropriate wall tile coordinate from the `THEME_TILES_MAP` based on the current theme of the level.

Then, it renders a sprite using the retrieved tile coordinate.

19. WaterPickupPlacement

This class allows for the creation of water pickup placements that can be collected by the player during gameplay. It handles rendering the appropriate sprite representation of the water pickup.

```javascript
import { Placement } from "./Placement";
import Sprite from "../components/object-graphics/Sprite";
import { TILES } from "../helpers/tiles";

export class WaterPickupPlacement extends Placement {
    addsItemToInventoryOnCollide() {
        return this.type;
    }

    renderComponent() {
        return <Sprite frameCoord={TILES.WATER_PICKUP} />;
    }
}
```
* addsItemToInventoryOnCollide Method:

Specifies the item to be added to the inventory when the placement is collided with. In this case, it returns the type of the water pickup placement.

* renderComponent Method:

Renders the graphical representation of the water pickup using a sprite.

It renders the sprite based on the tile coordinate specified for water pickups in the `TILES` object.

20. WaterPlacement

This class handles various aspects related to the interaction of bodies with water placements, including changing the hero's skin, determining solidity for bodies, damaging the hero when colliding without a water pickup, and rendering the water placement's graphical representation.

```javascript
import { Placement } from "./Placement";
import Sprite from "../components/object-graphics/Sprite";
import {
    BODY_SKINS,
    PLACEMENT_TYPE_HERO,
    PLACEMENT_TYPE_WATER_PICKUP,
} from "../helpers/consts";

export class WaterPlacement extends Placement {
    changesHeroSkinOnCollide() {
        return BODY_SKINS.WATER;
    }

    isSolidForBody(body) {
        return body.turnsAroundAtWater ?? false;
    }

    damagesBodyOnCollide(body) {
        const { inventory } = this.level;
        return (
            body.type === PLACEMENT_TYPE_HERO &&
            !inventory.has(PLACEMENT_TYPE_WATER_PICKUP)
        );
    }

    renderComponent() {
        const waterFrame = this.level.animatedFrames.waterFrame;
        return <Sprite frameCoord={waterFrame} />;
    }
}
```
* changesHeroSkinOnCollide Method:

Specifies that the hero's skin should change to the water skin when colliding with this placement.

It returns the water skin from the `BODY_SKINS` constant.

* isSolidForBody Method:

Determines if the placement is solid for the specified body.

It returns `true` if the body turns around at water, otherwise `false`.

* damagesBodyOnCollide Method:

Checks if the collision with the body should cause damage.

It returns `true` if the body is the hero and does not have a water pickup in its inventory.

* renderComponent Method:

Renders the graphical representation of the water placement using a sprite.

It uses the animated frames for water obtained from the `level.animatedFrames` object.


# helpers

1. Constants

The provided constants are used in the game for various purposes such as defining placement types, directions, body skins, lock key colours, level themes, and tile mappings.

```javascript
export const CELL_SIZE = 16;
export const Z_INDEX_LAYER_SIZE = 10;
export const SPRITE_SHEET_SRC = "/ciabattas-revenge-sprites.png";

export const PLACEMENT_TYPE_HERO = "HERO";
export const PLACEMENT_TYPE_GOAL = "GOAL";
export const PLACEMENT_TYPE_WALL = "WALL";
export const PLACEMENT_TYPE_FLOUR = "FLOUR";
export const PLACEMENT_TYPE_CELEBRATION = "CELEBRATION";
export const PLACEMENT_TYPE_LOCK = "LOCK";
export const PLACEMENT_TYPE_KEY = "KEY";
export const PLACEMENT_TYPE_WATER = "WATER";
export const PLACEMENT_TYPE_FIRE = "FIRE";
export const PLACEMENT_TYPE_ICE = "ICE";
export const PLACEMENT_TYPE_CONVEYOR = "CONVEYOR";
export const PLACEMENT_TYPE_WATER_PICKUP = "WATER_PICKUP";
export const PLACEMENT_TYPE_FIRE_PICKUP = "FIRE_PICKUP";
export const PLACEMENT_TYPE_ICE_PICKUP = "ICE_PICKUP";
export const PLACEMENT_TYPE_GROUND_ENEMY = "GROUND_ENEMY";
export const PLACEMENT_TYPE_FLYING_ENEMY = "FLYING_ENEMY";
export const PLACEMENT_TYPE_ROAMING_ENEMY = "ROAMING_ENEMY";

export const PLACEMENT_TYPE_SWITCH_DOOR = "SWITCH_DOOR";
export const PLACEMENT_TYPE_SWITCH = "SWITCH";
export const DIRECTION_LEFT = "LEFT";
export const DIRECTION_RIGHT = "RIGHT";
export const DIRECTION_UP = "UP";
export const DIRECTION_DOWN = "DOWN";

export const directionUpdateMap = {
    [DIRECTION_LEFT]: { x: -1, y: 0 },
    [DIRECTION_RIGHT]: { x: 1, y: 0 },
    [DIRECTION_UP]: { x: 0, y: -1 },
    [DIRECTION_DOWN]: { x: 0, y: 1 },
};

export const BODY_SKINS = {
    NORMAL: "NORMAL",
    WATER: "WATER",
    ICE: "ICE",
    CONVEYOR: "CONVEYOR",
    FIRE: "FIRE",
    TELEPORT: "TELEPORT",
    DEATH: "DEATH",
    SCARED: "SCARED",
};

export const HERO_RUN_1 = "HERO_RUN_1";
export const HERO_RUN_2 = "HERO_RUN_2";

export const LOCK_KEY_COLORS = {
    BLUE: "BLUE",
    GREEN: "GREEN",
};

export const LEVEL_THEMES = {
    YELLOW: "YELLOW",
    BLUE: "BLUE",
    GREEN: "GREEN",
    PINK: "PINK",
    GRAY: "GRAY",
};

export const THEME_BACKGROUNDS = {
    [LEVEL_THEMES.YELLOW]: "#2f2808",
    [LEVEL_THEMES.BLUE]: "#3d4c67",
    [LEVEL_THEMES.GREEN]: "#2f2808",
    [LEVEL_THEMES.PINK]: "#673d5e",
    [LEVEL_THEMES.GRAY]: "#96a1c7",
};

export const THEME_TILES_MAP = {
    [LEVEL_THEMES.YELLOW]: {
        FLOOR: "1x1",
        TOP: "1x0",
        LEFT: "0x1",
        RIGHT: "2x1",
        BOTTOM: "1x2",
        WALL: "0x2",
    },
    [LEVEL_THEMES.BLUE]: {
        FLOOR: "4x1",
        TOP: "4x0",
        LEFT: "3x1",
        RIGHT: "5x1",
        BOTTOM: "4x2",
        WALL: "3x2",
    },
    [LEVEL_THEMES.GREEN]: {
        FLOOR: "7x1",
        TOP: "7x0",
        LEFT: "6x1",
        RIGHT: "8x1",
        BOTTOM: "7x2",
        WALL: "6x2",
    },
    [LEVEL_THEMES.PINK]: {
        FLOOR: "10x1",
        TOP: "10x0",
        LEFT: "9x1",
        RIGHT: "11x1",
        BOTTOM: "10x2",
        WALL: "9x2",
    },
    [LEVEL_THEMES.GRAY]: {
        FLOOR: "13x1",
        TOP: "13x0",
        LEFT: "12x1",
        RIGHT: "14x1",
        BOTTOM: "13x2",
        WALL: "12x2",
    },
};

export const ICE_CORNERS = {
    TOP_LEFT: "TOP_LEFT",
    TOP_RIGHT: "TOP_RIGHT",
    BOTTOM_LEFT: "BOTTOM_LEFT",
    BOTTOM_RIGHT: "BOTTOM_RIGHT",
};
```
`CELL_SIZE`: Represents the size of a cell in the game grid.

`Z_INDEX_LAYER_SIZE`: Represents the size of a z-index layer used for rendering.

`SPRITE_SHEET_SRC`: Specifies the source path for the sprite sheet used in the game.

`PLACEMENT_TYPE_XXX`: Defines various types of placements such as hero, goal, wall, flour, celebration, lock, key, water, fire, ice, conveyor, enemy types, and switches.

`DIRECTION_XXX`: Represents directions in the game grid: left, right, up, and down.

`directionUpdateMap`: Maps directional constants to their respective x and y coordinate changes.

`BODY_SKINS`: Defines different skin types for bodies in the game such as normal, water, ice, conveyor, fire, teleport, death, and scared.

`HERO_RUN_1` and `HERO_RUN_2`: Represents hero running animations.

`LOCK_KEY_COLORS`: Specifies different colors for lock keys, including blue and green.

`LEVEL_THEMES`: Defines different themes for levels such as yellow, blue, green, pink, and gray.

`THEME_BACKGROUNDS`: Specifies background colors for each level theme.

`THEME_TILES_MAP`: Maps each level theme to a set of tile coordinates for different elements like floor, walls, etc.

`ICE_CORNERS`: Specifies different corner types for ice placements: top-left, top-right, bottom-left, and bottom-right.

2. tiles

The tiles object is used to cover various elements and is used to render graphics in the game. it includes tiles for basics like, flour, ice, fire, and water, as well as icons, locks and keys, spawns, characters, and particles.

```javascript
export const TILES = {
    // Basics
    SHADOW: "1x3",
    FLOUR: "2x3",
    FIRE_PICKUP: "3x3",
    ICE_PICKUP: "4x3",
    WATER_PICKUP: "5x3",
    BULLET_PICKUP: "4x9",
    BULLET: "3x9",

    // Icons
    CONTINUE_BUTTON: "7x3",
    EDIT_BUTTON: "8x3",
    RESUME_BUTTON: "9x3",
    RESTART_BUTTON: "10x3",
    MAP_BUTTON: "11x3",
    CLOCK: "12x3",
    SETTINGS: "13x3",

    // Locks and Keys
    BLUE_LOCK: "0x4",
    BLUE_KEY: "1x4",
    GREEN_LOCK: "2x4",
    GREEN_KEY: "3x4",
    UNLOCKED_LOCK: "4x4",

    // Water
    WATER1: "0x5",
    WATER2: "1x5",

    // Ice
    ICE: "0x6",
    ICE_TOP_LEFT: "1x6",
    ICE_TOP_RIGHT: "2x6",
    ICE_BOTTOM_LEFT: "3x6",
    ICE_BOTTOM_RIGHT: "4x6",

    // Fire
    FIRE1: "0x7",
    FIRE2: "1x7",
    FIRE3: "2x7",

    // Other Tiles
    BULLET_DROPBOX: "2x9",

    // Spawns
    ENEMY_LEFT_SPAWN: "4x8",
    ENEMY_RIGHT_SPAWN: "5x8",
    ENEMY_UP_SPAWN: "6x8",
    ENEMY_DOWN_SPAWN: "7x8",
    ENEMY_FLYING_LEFT_SPAWN: "8x8",
    ENEMY_FLYING_RIGHT_SPAWN: "9x8",
    ENEMY_FLYING_UP_SPAWN: "10x8",
    ENEMY_FLYING_DOWN_SPAWN: "11x8",
    ENEMY_ROAMING_SPAWN: "12x8",
    HERO_SPAWN: "13x8",
    CIABATTA_SPAWN: "14x8",

    //Goal
    GOAL_DISABLED: "0x9",
    GOAL_ENABLED: "1x9",

    //Switches, Other
    PURPLE_BUTTON: "0x10",
    PURPLE_DOOR_OUTLINE: "1x10",
    PURPLE_DOOR_SOLID: "2x10",
    TELEPORT1: "3x10",
    TELEPORT2: "4x10",
    TELEPORT3: "5x10",
    TELEPORT4: "6x10",

    THIEF: "7x10",
    WARNING: "8x10",

    //Particle Dusty explosion
    PARTICLE_1: "5x9",
    PARTICLE_2: "6x9",
    PARTICLE_3: "7x9",
    PARTICLE_4: "8x9",
    PARTICLE_5: "9x9",
    PARTICLE_6: "10x9",
    PARTICLE_7: "11x9",
    PARTICLE_8: "12x9",
    PARTICLE_9: "13x9",

    //Characters
    HERO_LEFT: "0x11",
    HERO_RIGHT: "2x11",
    ENEMY_LEFT: "4x11",
    ENEMY_RIGHT: "6x11",
    ENEMY_ROAMING: "8x11",
    ENEMY_FLYING_LEFT: "10x11",
    ENEMY_FLYING_RIGHT: "12x11",
    HERO_HOP_LEFT: "14x11",
    HERO_HOP_RIGHT: "16x11",

    //Characters Row 2
    HERO_WATER_LEFT: "0x13",
    HERO_WATER_RIGHT: "2x13",
    HERO_ICE_LEFT: "4x13",
    HERO_ICE_RIGHT: "6x13",
    HERO_CONVEYOR_LEFT: "8x13",
    HERO_CONVEYOR_RIGHT: "10x13",
    HERO_FIRE_LEFT: "12x13",
    HERO_FIRE_RIGHT: "14x13",

    //Characters Row 3
    HERO_DEATH_LEFT: "0x15",
    HERO_DEATH_RIGHT: "2x15",
    HERO_TELEPORT_LEFT: "4x15",
    HERO_TELEPORT_RIGHT: "6x15",
    HERO_EDITING_LEFT: "8x15",
    HERO_EDITING_RIGHT: "10x15",

    //Characters Row 4
    HERO_RUN_1_LEFT: "0x17",
    HERO_RUN_1_RIGHT: "2x17",
    HERO_RUN_2_LEFT: "4x17",
    HERO_RUN_2_RIGHT: "6x17",


};
```



# levels

1. DemoLevel1

this class is a `level` object that defines the layout and content for the specified level in the game enviornment.

```javascript
import {
    LEVEL_THEMES,
    PLACEMENT_TYPE_FLOUR,
    PLACEMENT_TYPE_GOAL,
    PLACEMENT_TYPE_HERO,
    PLACEMENT_TYPE_WALL,
    PLACEMENT_TYPE_LOCK,
    PLACEMENT_TYPE_KEY,
    PLACEMENT_TYPE_WATER,
    PLACEMENT_TYPE_FIRE,
    PLACEMENT_TYPE_WATER_PICKUP,
    PLACEMENT_TYPE_ROAMING_ENEMY,
    PLACEMENT_TYPE_ICE,
    PLACEMENT_TYPE_ICE_PICKUP,
     PLACEMENT_TYPE_GROUND_ENEMY,
     PLACEMENT_TYPE_FLYING_ENEMY,
    PLACEMENT_TYPE_FIRE_PICKUP,
    PLACEMENT_TYPE_SWITCH,
    PLACEMENT_TYPE_SWITCH_DOOR,

} from "../helpers/consts";

const level = {
    theme: LEVEL_THEMES.GREEN,
    tilesWidth: 8,
    tilesHeight: 8,
    placements: [
        { x: 2, y: 2, type: PLACEMENT_TYPE_HERO },
        { x: 6, y: 4, type: PLACEMENT_TYPE_GOAL },
        { x: 7, y: 1, type: PLACEMENT_TYPE_SWITCH_DOOR, isRaised: false },
        { x: 4, y: 3, type: PLACEMENT_TYPE_SWITCH_DOOR, isRaised: true },
        { x: 4, y: 1, type: PLACEMENT_TYPE_SWITCH },
        { x: 2, y: 3, type: PLACEMENT_TYPE_FIRE_PICKUP },
        { x: 3, y: 3, type: PLACEMENT_TYPE_FIRE },
        { x: 4, y: 3, type: PLACEMENT_TYPE_FIRE },
        { x: 5, y: 3, type: PLACEMENT_TYPE_FIRE },
        { x: 3, y: 4, type: PLACEMENT_TYPE_ICE, corner: "TOP_LEFT" },
        { x: 3, y: 5, type: PLACEMENT_TYPE_ICE },
        { x: 4, y: 5, type: PLACEMENT_TYPE_ICE },
        { x: 3, y: 6, type: PLACEMENT_TYPE_ICE, corner: "BOTTOM_LEFT" },

        { x: 5, y: 4, type: PLACEMENT_TYPE_ICE, corner: "TOP_RIGHT" },
        { x: 5, y: 5, type: PLACEMENT_TYPE_ICE },
        { x: 5, y: 6, type: PLACEMENT_TYPE_ICE, corner: "BOTTOM_RIGHT" },

        { x: 4, y: 4, type: PLACEMENT_TYPE_ICE },
        { x: 4, y: 6, type: PLACEMENT_TYPE_ICE },

        { x: 5, y: 2, type: PLACEMENT_TYPE_ICE_PICKUP },
        { x: 3, y: 4, type: PLACEMENT_TYPE_WATER },
        { x: 4, y: 5, type: PLACEMENT_TYPE_WATER },
        { x: 3, y: 5, type: PLACEMENT_TYPE_WATER },
        { x: 4, y: 4, type: PLACEMENT_TYPE_WATER },
        { x: 4, y: 2, type: PLACEMENT_TYPE_WATER },
        { x: 4, y: 7, type: PLACEMENT_TYPE_WATER },
        { x: 2, y: 4, type: PLACEMENT_TYPE_WATER_PICKUP },
        { x: 6, y: 6, type: PLACEMENT_TYPE_WALL },
        { x: 3, y: 2, type: PLACEMENT_TYPE_FLOUR },
        { x: 4, y: 1, type: PLACEMENT_TYPE_LOCK, color: "BLUE" },
        { x: 4, y: 3, type: PLACEMENT_TYPE_LOCK, color: "GREEN" },
        { x: 1, y: 1, type: PLACEMENT_TYPE_KEY, color: "BLUE" },
        { x: 1, y: 3, type: PLACEMENT_TYPE_KEY, color: "GREEN" },
        { x: 6, y: 2, type: PLACEMENT_TYPE_ROAMING_ENEMY },
         { x: 5, y: 4, type: PLACEMENT_TYPE_GROUND_ENEMY },
         { x: 8, y: 7, type: PLACEMENT_TYPE_FLYING_ENEMY, initialDirection: "UP" },
    ],
};

export default level;
```
`theme`: Specifies the theme of the level, determining the background and tileset used.

`tilesWidth` and `tilesHeight`: Define the dimensions of the level grid in terms of tiles.

`placements`: An array containing objects representing different placements within the level. Each object has properties such as `x` and `y` coordinates specifying the position on the grid and a type indicating the `type` of placement.

2. DemoLevel2

This class defines the second level in the game enviornment.

```javascript
import {
    LEVEL_THEMES,
    PLACEMENT_TYPE_FLOUR,
    PLACEMENT_TYPE_GOAL,
    PLACEMENT_TYPE_HERO,
    PLACEMENT_TYPE_WALL,
} from "../helpers/consts";

const level = {
    theme: LEVEL_THEMES.YELLOW,
    tilesWidth: 8,
    tilesHeight: 5,
    placements: [
        { x: 1, y: 1, type: PLACEMENT_TYPE_HERO },
        { x: 7, y: 5, type: PLACEMENT_TYPE_GOAL },
        { x: 4, y: 4, type: PLACEMENT_TYPE_WALL },
        { x: 3, y: 2, type: PLACEMENT_TYPE_FLOUR },
        { x: 6, y: 4, type: PLACEMENT_TYPE_FLOUR },
    ],
};

export default level;
```
`theme`: Specifies the theme of the level, which in this case is set to `LEVEL_THEMES.YELLOW`.

`tilesWidth` and `tilesHeight`: Define the dimensions of the level grid in terms of tiles. In this level, the grid is 8 tiles wide and 5 tiles high.

`placements`: An array containing objects representing different placements within the level. Each object has properties such as `x` and `y` coordinates specifying the position on the grid and a type indicating the `type` of placement.

3. LevelMap

this code defines the object `levels`and contains modules for each of the specified levels within the game.

```javascript
import DemoLevel1 from "./DemoLevel1";
import DemoLevel2 from "./DemoLevel2";

const Levels = {
    DemoLevel1: DemoLevel1,
    DemoLevel2: DemoLevel2,
};

export default Levels;
```
`DemoLevel1` and `DemoLevel2` are imported from their respective files. These files likely contain the definitions of the levels using the format similar to the `level` objects we've seen before.

The Levels object is created to store these `level` references.

The keys in the `Levels` object are the names of the levels (`DemoLevel1`, `DemoLevel2`), and the values are references to the actual level modules imported above.

Finally, the `Levels` object is exported as the default export of this module.

This structure allows for easy access to different levels within the game by importing the `Levels` object and accessing specific levels by their keys (`DemoLevel1`, `DemoLevel2`).




# Assets and texture sources
Player model has been sourced from babylon documentation website and can be found here:
* https://playground.babylonjs.com/#C38BUD#1

Village ground has been sourced from babylon documentation website and can be found here:
* https://assets.babylonjs.com/environments/villagegreen.png

Terrain that surrounds village has been sourced from babylon documentation and can be found here: 
* https://assets.babylonjs.com/environments/villageheightmap.png

Textures for the houses have been sourced from babylon documentation and can be found here: 
* https://assets.babylonjs.com/environments/roof.jpg
* https://assets.babylonjs.com/environments/semihouse.png
* https://assets.babylonjs.com/environments/cubehouse.png

# Import List (top section)
```typescript
//-----------------------------------------------------
//TOP OF CODE - IMPORTING BABYLONJS
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import {
  Scene,
  ArcRotateCamera,
  Vector3,
  Vector4,
  HemisphericLight,
  SpotLight,
  MeshBuilder,
  Mesh,
  Light,
  Camera,
  Engine,
  StandardMaterial,
  Texture,
  Color3,
  Space,
  ShadowGenerator,
  PointLight,
  DirectionalLight,
  CubeTexture,
  Sprite,
  SpriteManager,
  SceneLoader,
  ActionManager,
  ExecuteCodeAction,
  AnimationPropertiesOverride,
  PhysicsImpostor,
  Sound,
  } from "@babylonjs/core";
  import * as GUI from "@babylonjs/gui";
  import HavokPhysics from "@babylonjs/havok";
  import { HavokPlugin, PhysicsAggregate, PhysicsShapeType } from "@babylonjs/core";
  //----------------------------------------------------
  function createSceneButton(scene: Scene, name: string, index: string, x: string, y: string, advtex) {
    let button = GUI.Button.CreateSimpleButton(name, index);
    button.left = x;
    button.top = y;
    button.width = "160px";
    button.height = "60px";
    button.color = "white";
    button.cornerRadius = 20;
    button.background = "green";

    const buttonClick = new Sound("MenuClickSFX", "./audio/menu-click.wav", scene, null, {
        loop: false,
        autoplay: false,
    });

    button.onPointerUpObservable.add(function () {
        console.log("THE GAME HAS STARTED");
        buttonClick.play();

        
        button.isVisible = false;
    });

    advtex.addControl(button);
    return button;
}

  //----------------------------------------------------
  //Initialisation of Physics (Havok)
  let initializedHavok;
  HavokPhysics().then((havok) => {
    initializedHavok = havok;
  });

  const havokInstance = await HavokPhysics();
  const havokPlugin = new HavokPlugin(true, havokInstance);

  globalThis.HK = await HavokPhysics();
  //----------------------------------------------------
  
  //----------------------------------------------------
  let keyDownMap: any[] = [];
  let currentSpeed: number = 0.1;
  let walkingSpeed: number = 0.1;
  let runningSpeed: number = 0.4;

  function importPlayerMesh(scene: Scene, collider: Mesh, x: number, y: number) {
    let tempItem = { flag: false } 
    let item: any = SceneLoader.ImportMesh("", "./models/", "dummy3.babylon", scene, function(newMeshes, particleSystems, skeletons) {
      let mesh = newMeshes[0];
      let skeleton = skeletons[0];
      skeleton.animationPropertiesOverride = new AnimationPropertiesOverride();
      skeleton.animationPropertiesOverride.enableBlending = true;
      skeleton.animationPropertiesOverride.blendingSpeed = 0.05;
      skeleton.animationPropertiesOverride.loopMode = 1; 

      let walkRange: any = skeleton.getAnimationRange("YBot_Walk");

      let animating: boolean = false;

      scene.onBeforeRenderObservable.add(()=> {
        let keydown: boolean = false;
        let shiftdown: boolean = false;
        if (keyDownMap["w"] || keyDownMap["ArrowUp"]) {
          mesh.position.z += 0.1;
          mesh.rotation.y = 0;
          keydown = true;
        }
        if (keyDownMap["a"] || keyDownMap["ArrowLeft"]) {
          mesh.position.x -= 0.1;
          mesh.rotation.y = 3 * Math.PI / 2;
          keydown = true;
        }
        if (keyDownMap["s"] || keyDownMap["ArrowDown"]) {
          mesh.position.z -= 0.1;
          mesh.rotation.y = 2 * Math.PI / 2;
          keydown = true;
        }
        if (keyDownMap["d"] || keyDownMap["ArrowRight"]) {
          mesh.position.x += 0.1;
          mesh.rotation.y = Math.PI / 2;
          keydown = true;
        }
        if (keyDownMap["Shift"] || keyDownMap["LeftShift"]) {
          currentSpeed = runningSpeed;
          shiftdown = true;
        } else {
          currentSpeed = walkingSpeed;
          shiftdown = false;
        }

        if (keydown) {
          if (!animating) {
            animating = true;
            scene.beginAnimation(skeleton, walkRange.from, walkRange.to, true);
          }
        } else {
          animating = false;
          scene.stopAnimation(skeleton);
        }

        //collision
        if (mesh.intersectsMesh(collider)) {
          console.log("COLLIDED");
        }
      });

      //physics collision
      item = mesh;
      let playerAggregate = new PhysicsAggregate(item, PhysicsShapeType.CAPSULE, { mass: 0 }, scene);
      playerAggregate.body.disablePreStep = false;

    });
    return item;
  }

  function actionManager(scene: Scene){
    scene.actionManager = new ActionManager(scene);

    scene.actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnKeyDownTrigger,
          //parameters: `w`
        },
        function(evt) {keyDownMap[evt.sourceEvent.key] = true; }
      )
    );
    scene.actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnKeyUpTrigger
        },
        function(evt) {keyDownMap[evt.sourceEvent.key] = false; }
      )
    );
    return scene.actionManager;
  } 

  function createTorus(scene: Scene, px: number, py: number, pz: number) {
    const torus = MeshBuilder.CreateTorus("torus", {});
    torus.position = new Vector3(px, py, pz);
    scene.registerAfterRender(function () {
      torus.rotate(new Vector3(4, 8, 2)/*axis*/, 0.02/*angle*/, Space.LOCAL);
    });
    return torus;
  }

  function cloneTorus(scene: Scene): Mesh[] {
    const torusInstances: Mesh[] = [];
    const positions = [
      new Vector3(3, 0.5, 5),
      new Vector3(-3, 0.5, 1),
      new Vector3(0, 0.5, 0),
      new Vector3(3, 0.5, -3),
      new Vector3(-3, 0.5, -3),
      new Vector3(6, 0.5, 0),
      new Vector3(-6, 0.5, 0),
      new Vector3(0, 0.5, 6),
      new Vector3(0, 0.5, -6),
    ];
  
    for (let i = 0; i < 9; i++) {
      const position = positions[i];
  
      const torus = MeshBuilder.CreateTorus(`torus${i}`, {});
      torus.position = position;
  
      scene.registerAfterRender(function () {
        torus.rotate(new Vector3(4, 8, 2), 0.02, Space.LOCAL);
      });
  
      torusInstances.push(torus);
    }
  
    return torusInstances;
  }


  function checkCollision(cube: Mesh, torus: Mesh) {
    if (cube.intersectsMesh(torus)) {
      cube.dispose(); // Remove the cube from the scene
    }
  }

 // Add a variable to keep track of the score
 let score = 0;

 // Function to update the score and log it to the console
 function updateScore() {
     score++;
     if (score > 9) {
         score = 9; // Limit the score to a maximum of 9
     }
     console.log("Score: " + score);
 }
// Modify the createCube function to update the score on collision
function createCube(scene: Scene, x: number, y: number, z: number, toruses: Mesh[]) {
    let box: Mesh = MeshBuilder.CreateBox("box", {});
    box.position.x = x;
    box.position.y = y + 0.5; // Adjust the initial y position to place it just above the ground
    box.position.z = z;

    // Add physics properties to the cube
    const cubePhysicsOptions = {
        mass: 1,                 // Mass of the cube
        friction: 0.5,           // Friction coefficient
        restitution: 0.1         // Restitution (bounciness) coefficient
    };

    const boxAggregate = new PhysicsAggregate(box, PhysicsShapeType.BOX, cubePhysicsOptions, scene);

    // Register a function to check for collision with the torus meshes
    scene.registerBeforeRender(() => {
        for (const torus of toruses) {
            if (box.intersectsMesh(torus)) {
                // Remove the torus from the scene
                torus.dispose();
                // Update the score
                updateScore();
            }
        }
    });

    return box;
}


  //Create Terrain
  function createTerrain(scene: Scene) {
    //Create large ground for valley environment
    const largeGroundMat = new StandardMaterial("largeGroundMat");
    largeGroundMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/valleygrass.png");
    
    const largeGround = MeshBuilder.CreateGroundFromHeightMap("largeGround", "https://assets.babylonjs.com/environments/villageheightmap.png", {width:150, height:150, subdivisions: 20, minHeight:0, maxHeight: 10});
    largeGround.material = largeGroundMat;
    return largeGround;
  }

  //Create more detailed ground
  function createGround(scene: Scene) {
    //Create Village ground

    const ground: Mesh = MeshBuilder.CreateGround("ground", {width:24, height:24});
    const groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, scene);
    const groundMat = new StandardMaterial("groundMat");
    groundMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/villagegreen.png");
    groundMat.diffuseTexture.hasAlpha = true;

   
    ground.material = groundMat;
    ground.position.y = 0.01;
    return ground;
  }

  //Create Skybox
  function createSkybox(scene: Scene) {
    //Skybox
    const skybox = MeshBuilder.CreateBox("skyBox", {size:150}, scene);
	  const skyboxMaterial = new StandardMaterial("skyBox", scene);
	  skyboxMaterial.backFaceCulling = false;
	  skyboxMaterial.reflectionTexture = new CubeTexture("textures/skybox", scene);
	  skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
	  skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
	  skyboxMaterial.specularColor = new Color3(0, 0, 0);
	  skybox.material = skyboxMaterial;
    return skybox;
  }

  //Creating sprite trees
  function createTrees(scene: Scene) {
    const spriteManagerTrees = new SpriteManager("treesManager", "textures/palmtree.png", 2000, {width: 512, height: 1024}, scene);

    //We create trees at random positions
    for (let i = 0; i < 500; i++) {
        const tree = new Sprite("tree", spriteManagerTrees);
        tree.position.x = Math.random() * (-30);
        tree.position.z = Math.random() * 20 + 8;
        tree.position.y = 0.5;
    }

    for (let i = 0; i < 500; i++) {
        const tree = new Sprite("tree", spriteManagerTrees);
        tree.position.x = Math.random() * (25) + 7;
        tree.position.z = Math.random() * -35  + 8;
        tree.position.y = 0.5;
    }
    return spriteManagerTrees;
  }

  function createBox(scene: Scene, width: number) {
    const boxMat = new StandardMaterial("boxMat");
    if (width == 2) {
      boxMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/semihouse.png") 
    }
    else {
       boxMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/cubehouse.png");   
    }

    const faceUV: Vector4[] = [];
    if (width == 2) {
      faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0); //rear face
      faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
      faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
      faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side
    }
    else {
      faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
      faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
      faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
      faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side
    }

    const box = MeshBuilder.CreateBox("box", {faceUV: faceUV, wrap: true});
    box.position.y = 0.5;
    box.material = boxMat;
    return box;
  }

  function createRoof(scene: Scene, width: number) {
    const roofMat = new StandardMaterial("roofMat");
    roofMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/roof.jpg");

    const roof = MeshBuilder.CreateCylinder("roof", {diameter: 1.3, height: 1.2, tessellation: 3});
    roof.material = roofMat;
    roof.scaling.x = 0.75;
    roof.scaling.y = width;
    roof.rotation.z = Math.PI / 2;
    roof.position.y = 1.22;
    return roof;
  }

  function createHouse(scene: Scene, width: number) {
    const box = createBox(scene, width);
    const roof = createRoof(scene, width);
    const house: any = Mesh.MergeMeshes([box, roof], true, false, undefined, false, true);

    return house;
  }

  //cloning function
  function cloneHouse(scene: Scene) {
    const detached_house = createHouse(scene, 1); //.clone("clonedHouse");
    detached_house.rotation.y = -Math.PI / 16;
    detached_house.position.x = -6.8;
    detached_house.position.z = 2.5;

    const semi_house = createHouse(scene, 2); //.clone("clonedHouse");
    semi_house.rotation.y = -Math.PI / 16;
    semi_house.position.x = -4.5;
    semi_house.position.z = 3;

    //each entry is an array [house type, rotation, x, z]
    const places: number[] [] = []; 
    places.push([1, -Math.PI / 16, -6.8, 2.5 ]);
    places.push([2, -Math.PI / 16, -4.5, 3 ]);
    places.push([2, -Math.PI / 16, -1.5, 4 ]);
    places.push([2, -Math.PI / 3, 1.5, 6 ]);
    places.push([2, 15 * Math.PI / 16, -6.4, -1.5 ]);
    places.push([1, 15 * Math.PI / 16, -4.1, -1 ]);
    places.push([2, 15 * Math.PI / 16, -2.1, -0.5 ]);
    places.push([1, 5 * Math.PI / 4, 0, -1 ]);
    places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3 ]);
    places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5 ]);
    places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7 ]);
    places.push([2, Math.PI / 1.9, 4.75, -1 ]);
    places.push([1, Math.PI / 1.95, 4.5, -3 ]);
    places.push([2, Math.PI / 1.9, 4.75, -5 ]);
    places.push([1, Math.PI / 1.9, 4.75, -7 ]);
    places.push([2, -Math.PI / 3, 5.25, 2 ]);
    places.push([1, -Math.PI / 3, 6, 4 ]);

    const houses: Mesh[] = [];
    for (let i = 0; i < places.length; i++) {
      if (places[i][0] === 1) {
          houses[i] = detached_house.createInstance("house" + i);
      }
      else {
          houses[i] = semi_house.createInstance("house" + i);
      }
        houses[i].rotation.y = places[i][1];
        houses[i].position.x = places[i][2];
        houses[i].position.z = places[i][3];
    }

    return houses;
  }

  //----------------------------------------------------------------------------------------------
  function createHemiLight(scene: Scene) {
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.8;
    return light;
  }

  
  function createArcRotateCamera(scene: Scene) {
    let camAlpha = -Math.PI / 2,
      camBeta = Math.PI / 2.5,
      camDist = 10,
      camTarget = new Vector3(0, 0, 0);
    let camera = new ArcRotateCamera(
      "camera1",
      camAlpha,
      camBeta,
      camDist,
      camTarget,
      scene,
    );
    camera.attachControl(true);
    return camera;
  }
  //----------------------------------------------------------
  
  //----------------------------------------------------------
  //BOTTOM OF CODE - MAIN RENDERING AREA FOR YOUR SCENE
export default function createStartScene(engine: Engine) {
  interface SceneData {
    scene: Scene;
    terrain?: Mesh;
    ground?: Mesh;
    skybox?: Mesh;
    trees?: SpriteManager;
    box?: Mesh;
    torus?: Mesh[];
    importMesh?: any;
    actionManager?: any;
    house?: any;
    light?: Light;
    hemisphericLight?: HemisphericLight;
    camera?: Camera;
  }

  let that: SceneData = { scene: new Scene(engine) };
  that.scene.debugLayer.show();
  that.scene.enablePhysics(new Vector3(0, -9.8, 0), havokPlugin);

  // Create the torus instances
  that.torus = cloneTorus(that.scene);

  // code instances
  that.terrain = createTerrain(that.scene);
  that.ground = createGround(that.scene);
  that.skybox = createSkybox(that.scene);
  that.trees = createTrees(that.scene);
  that.box = createCube(that.scene, 2, 2, 2, that.torus);
  that.importMesh = importPlayerMesh(that.scene, that.terrain, 0, 0);
  that.actionManager = actionManager(that.scene);

  // Housing
  that.house = cloneHouse(that.scene);

  // button
  let advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI", true);
  let button1 = createSceneButton(that.scene, "but1", "Start Game", "0px", "-75px", advancedTexture);


  // Scene Lighting & Camera
  that.hemisphericLight = createHemiLight(that.scene);
  that.camera = createArcRotateCamera(that.scene);

  // Main render loop
  engine.runRenderLoop(() => {
    //rendering logic 
    that.scene.render();
  });

  return that;
}
//----------------------------------------------------
