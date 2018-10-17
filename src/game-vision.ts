import Jimp = require("jimp");

import { ScreenCapture } from "./screen-capture/screen-capture";
import { ScreenParser } from "./screen-parser/screen-parser";
import { Split } from "./models/split.model";
import { TilePath } from "./models/tile-path.model";
import { WindowProcess } from "./models/window-process.model";

export class GameVision {
  captureBuffer: Buffer;
  captureEngine: ScreenCapture = new ScreenCapture();
  currentImage: Jimp;
  parserEngine: ScreenParser = new ScreenParser();
  splits: Split[];
  tileImages: Array<{ id: string; image: Jimp }>;
  tilePaths: TilePath[];
  processes: WindowProcess[];

  gameResolution: {
    width: number;
    height: number;
    blockWidth: number;
    blockHeight: number;
  };

  constructor() {
    console.log("Started GameVision...");
  }
}
