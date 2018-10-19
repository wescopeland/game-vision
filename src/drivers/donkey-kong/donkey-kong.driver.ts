import { GameVision } from "../../game-vision";
import { tilePaths } from "./donkey-kong.tile-paths";
import { processes } from "./donkey-kong.processes";

export class DonkeyKong extends GameVision {
  constructor() {
    super();

    this.tilePaths = tilePaths;
    this.processes = processes;

    this.name = "Donkey Kong";
    this.gameResolution = {
      width: 224,
      height: 256,
      blockWidth: 8,
      blockHeight: 8
    };

    this.livesStartX = 1;
    this.livesEndX = 6;
    this.livesY = 3;

    this.scoreStartX = 1;
    this.scoreEndX = 6;
    this.scoreY = 1;

    this.stageStartX = 23;
    this.stageEndX = 24;
    this.stageY = 3;

    this.gameOverText = "game";
    this.gameOverStartX = 9;
    this.gameOverEndX = 12;
    this.gameOverY = 22;

    this.triggerText = "how";
    this.triggerStartX = 3;
    this.triggerEndX = 5;
    this.triggerY = 30;

    this.levelIndicatorPrefix = "L=";
    this.levelIndicatorStartX = 23;
    this.levelIndicatorEndX = 24;
    this.levelIndicatorY = 3;

    this.watchingIntervalMs = 1500;
    this.thinkingIntervalMs = 2500;

    this.generateDriverFunctions();
    this.activate();
  }
}
