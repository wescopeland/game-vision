// Right now only works on OSX, but could on other platforms as well, see:
//  https://github.com/uiureo/node-screencapture/blob/cdaf9522ed5063f54b3efd917bc19ab81118d9c1/lib/capture_exec.js
// On Windows use: nircmdc.exe, on Linux use: scrot

import Jimp = require("jimp");
import { tmpdir, platform } from "os";
import * as uuid from "shortid";
import * as path from "path";
import * as fs from "fs";
import * as child from "child_process";

import { GameResolution } from "../models/game-resolution.model";
import { WindowProcess } from "../models/window-process.model";

export class ScreenCapture {
  private _processId: number;

  constructor() {}

  initializeImage(
    processes: WindowProcess[],
    gameResolution: GameResolution
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (platform() === "darwin") {
        this._processId = await this.getWindowId(processes[0]);
      }

      let buffer: Buffer = await this.captureWindow(this._processId);
      let image: Jimp = await this.readBuffer(buffer);

      this.dumpImage(image);

      image = this.resizeToBounds(
        image,
        gameResolution.width,
        gameResolution.height
      );

      resolve(image);
    });
  }

  getWindowId(process: WindowProcess): Promise<any> {
    return new Promise((resolve, reject) => {
      // For MacOS, GetWindowID is a dependency.
      if (platform() === "darwin") {
        const cmd = `GetWindowID ${process.processName} '${
          process.windowTitle
        }'`;

        child.exec(cmd, (err, stdout) => {
          if (err) {
            console.log(err);
            reject();
          }

          resolve(parseInt(stdout));
        });
      }
    });
  }

  dumpBlock(
    image: Jimp,
    gameResolution: GameResolution,
    blockX: number,
    blockY: number,
    isDumpingImage = false
  ) {
    let clonedImage = image.clone();

    clonedImage.crop(
      blockX * gameResolution.blockWidth,
      blockY * gameResolution.blockHeight,
      gameResolution.blockWidth,
      gameResolution.blockHeight
    );

    if (isDumpingImage) {
      this.dumpImage(clonedImage);
    }

    return clonedImage.getBufferAsync(Jimp.MIME_PNG);
  }

  async dumpBlocks(
    image: Jimp,
    gameResolution: GameResolution,
    xPath: { startX: number; endX: number },
    yPath: { startY: number; endY: number },
    isDumpingImage = false
  ) {
    let clonedImage = image.clone();

    let captureWidth = 0;
    for (let i = xPath.startX; i <= xPath.endX; i += 1) {
      captureWidth += gameResolution.blockWidth;
    }

    let captureHeight = 0;
    for (let i = yPath.startY; i <= yPath.endY; i += 1) {
      captureHeight += gameResolution.blockHeight;
    }

    clonedImage.crop(
      xPath.startX * gameResolution.blockWidth,
      yPath.startY * gameResolution.blockHeight,
      captureWidth,
      captureHeight
    );

    if (isDumpingImage) {
      this.dumpImage(clonedImage);
    }

    return clonedImage.getBufferAsync(Jimp.MIME_PNG);
  }

  dumpImage(image: Jimp) {
    image.write("dump.png");
  }

  generatePngPath(): string {
    return path.join(tmpdir(), `${uuid.generate()}.png`);
  }

  captureWindow(windowId = null, isDumpingImage = false): Promise<any> {
    return new Promise((resolve, reject) => {
      const pngPath = this.generatePngPath();
      let cmd = "";

      // We need a different window capture mechanism based on our OS.
      if (platform() === "darwin") {
        cmd = `screencapture -x -o -l ${windowId} ${pngPath}`;
      }

      if (platform() === "win32") {
        cmd = `screenshot-cmd -wt "AmaRecTV 2.31" -o ${pngPath}`;
      }

      child.exec(cmd, err => {
        if (err) {
          console.log(err);
          return;
        }

        fs.readFile(pngPath, (err, imageBuffer: Buffer) => {
          if (err) {
            console.log("Error in image capture.");
            reject();
          }

          resolve(imageBuffer);
        });
      });
    });
  }

  readBuffer(buffer: Buffer): Promise<Jimp> {
    return new Promise((resolve, reject) => {
      Jimp.read(buffer)
        .then((image: Jimp) => {
          if (platform() === "darwin") {
            image = this._cropForMac(image);
          } else if (platform() === "win32") {
            image = this._cropForWindows(image);
          }

          resolve(image);
        })
        .catch(err => {
          console.log("Unable to read the input buffer.");
          reject(err);
        });
    });
  }

  resizeToBounds(image: Jimp, x: number, y: number): Jimp {
    return image.resize(x, y);
  }

  private _cropForMac(image: Jimp): Jimp {
    image.crop(0, 22, image.bitmap.width, image.bitmap.height - 22);
    return image;
  }

  private _cropForWindows(image: Jimp): Jimp {
    image.crop(8, 67, image.bitmap.width - 16, image.bitmap.height - 97);

    // TODO: If this is direct capture...
    if (true) {
      image.rotate(90, false);
      image.crop(23, 64, image.bitmap.width - 41, image.bitmap.height - 186);
    }

    return image;
  }
}
