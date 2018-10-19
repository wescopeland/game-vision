import { GameVision } from "../../game-vision";

export class PacMan extends GameVision {
  constructor() {
    super();

    this.processes = [
      {
        processName: "mame64",
        windowTitle: "MAME: Pac-Man (Midway, speedup hack) [pacmanf]"
      }
    ];

    this.name = "Pac-Man";
    this.gameResolution = {
      width: 224,
      height: 288,
      blockWidth: 8,
      blockHeight: 8
    };

    this.scoreStartX = 1;
    this.scoreEndX = 6;
    this.scoreY = 1;

    this.triggerText = "ready";
    this.triggerStartX = 11;
    this.triggerEndX = 15;
    this.triggerY = 20;

    this.watchingIntervalMs = 1000;
    this.thinkingIntervalMs = 800;

    this.generateDriverFunctions();
    this.activate();
  }
}
