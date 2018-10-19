import Jimp = require("jimp");

import { ScreenCapture } from "./screen-capture/screen-capture";
import { ScreenParser } from "./screen-parser/screen-parser";
import { GameVisionFunctionGenerator } from "./function-generator";
import { TilePath } from "./models/tile-path.model";
import { WindowProcess } from "./models/window-process.model";

export class GameVision {
  captureBuffer: Buffer;
  captureEngine: ScreenCapture = new ScreenCapture();
  currentImage: Jimp;
  functionGenerator: GameVisionFunctionGenerator = new GameVisionFunctionGenerator();
  parserEngine: ScreenParser = new ScreenParser();
  tileImages: Array<{ id: string; image: Jimp }>;
  tilePaths: TilePath[];
  processes: WindowProcess[];

  activate: Function;
  getGameOverText: Function;
  getLevelIndicatorValue: Function;
  getSpareLifeCount: Function;
  getScoreValue: Function;
  getTriggerText: Function;

  name: string;
  gameResolution: {
    width: number;
    height: number;
    blockWidth: number;
    blockHeight: number;
  };

  livesStartX: number;
  livesEndX: number;
  livesY: number;

  scoreStartX: number;
  scoreEndX: number;
  scoreY: number;

  stageStartX: number;
  stageEndX: number;
  stageY: number;

  gameOverText: string;
  gameOverStartX: number;
  gameOverEndX: number;
  gameOverY: number;

  levelIndicatorPrefix: string;
  levelIndicatorStartX: number;
  levelIndicatorEndX: number;
  levelIndicatorY: number;

  triggerText: string;
  triggerTextWhitelist: string;
  triggerStartX: number;
  triggerEndX: number;
  triggerY: number;

  watchingIntervalMs: number;
  thinkingIntervalMs: number;

  constructor() {}

  async buildTileImages(tilePaths: TilePath[]): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let images: Array<{ id: string; image: Jimp }> = [];

      tilePaths.forEach(async tilePath => {
        let image = await Jimp.read(`assets/${tilePath.path}`);
        images.push({
          image: image,
          id: tilePath.id
        });
      });

      resolve(images);
    });
  }

  generateDriverFunctions() {
    // Trigger Text
    if (
      this.triggerStartX &&
      this.triggerEndX &&
      this.triggerY &&
      this.triggerText &&
      this.gameResolution
    ) {
      this.getTriggerText = this.functionGenerator.generateGetTriggerText(
        this.triggerStartX,
        this.triggerEndX,
        this.triggerY,
        this.triggerText,
        this.gameResolution
      );
    }

    // Score
    if (this.scoreStartX && this.scoreEndX && this.scoreY) {
      this.getScoreValue = this.functionGenerator.generateGetScoreValue(
        this.scoreStartX,
        this.scoreEndX,
        this.scoreY,
        this.gameResolution
      );
    }

    // Life Count
    if (
      this.livesStartX &&
      this.livesEndX &&
      this.livesY &&
      this.gameResolution
    ) {
      this.getSpareLifeCount = this.functionGenerator.generateGetLifeCount(
        this.livesStartX,
        this.livesEndX,
        this.livesY,
        this.gameResolution
      );
    }

    // Level Indicator
    if (
      this.levelIndicatorStartX &&
      this.levelIndicatorEndX &&
      this.levelIndicatorY &&
      this.gameResolution
    ) {
      this.getLevelIndicatorValue = this.functionGenerator.generateGetLevelIndicatorValue(
        this.levelIndicatorStartX,
        this.levelIndicatorEndX,
        this.levelIndicatorY,
        this.gameResolution,
        this.levelIndicatorPrefix
      );
    }

    // Game Over Text
    if (
      this.gameOverStartX &&
      this.gameOverEndX &&
      this.gameOverY &&
      this.gameOverText &&
      this.gameResolution
    ) {
      this.getGameOverText = this.functionGenerator.generateGetGameOverText(
        this.gameOverStartX,
        this.gameOverEndX,
        this.gameOverY,
        this.gameOverText,
        this.gameResolution
      );
    }

    // Generic Activation
    this.activate = this.functionGenerator.generateActivate(
      this.watchingIntervalMs,
      this.thinkingIntervalMs,
      this.gameResolution
    );
  }
}
