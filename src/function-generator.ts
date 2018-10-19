import Jimp = require("jimp");
import * as Tesseract from "tesseract.js";
import { compareTwoStrings } from "string-similarity";

import { ScreenCapture } from "./screen-capture/screen-capture";
import { ScreenParser } from "./screen-parser/screen-parser";

export class GameVisionFunctionGenerator {
  captureEngine: ScreenCapture = new ScreenCapture();
  parserEngine: ScreenParser = new ScreenParser();

  constructor() {}

  generateActivate(
    watchingIntervalMs: number,
    thinkingIntervalMs: number,
    gameResolution: any
  ): Function {
    const activate = async function() {
      let currentImage: Jimp;
      let isThinking = false;
      let lastReadLifeCount: number = null;
      let lastReadScore: number = null;
      let didLifeCountIncrease: boolean = false;
      let livesRemaining: number;
      let isShowingHowHighText: boolean;
      let currentScore: number;
      let currentLevelIndicatorValue: string;
      let tileImages: any[];

      if (this.tilePaths && this.tilePaths.length) {
        tileImages = await this.buildTileImages(this.tilePaths);
      }

      setInterval(async () => {
        if (!isThinking) {
          currentImage = await this.captureEngine.initializeImage(
            this.processes,
            gameResolution
          );

          if (this.getSpareLifeCount) {
            let newSpareLifeCount = await this.getSpareLifeCount(
              currentImage,
              tileImages
            );

            if (newSpareLifeCount > lastReadLifeCount) {
              didLifeCountIncrease = true;
            }
          }

          let initializerPromises = [this.getTriggerText(currentImage)];
          if (this.getGameOverText) {
            initializerPromises.push(this.getGameOverText(currentImage));
          }

          Promise.all(initializerPromises).then(
            ([isShowingTriggerText, isShowingGameOverText]) => {
              if (this.getGameOverText && isShowingGameOverText) {
                console.log("END");
              }

              if (isShowingTriggerText) {
                isThinking = true;

                setTimeout(async () => {
                  currentImage = await this.captureEngine.initializeImage(
                    this.processes,
                    gameResolution
                  );

                  let promises = [];
                  if (this.getScoreValue) {
                    promises.push(
                      this.getScoreValue(currentImage, currentScore)
                    );
                  }

                  if (this.getLevelIndicatorValue) {
                    promises.push(this.getLevelIndicatorValue(currentImage));
                  }

                  if (this.getSpareLifeCount) {
                    promises.push(
                      this.getSpareLifeCount(currentImage, tileImages)
                    );
                  }

                  Promise.all(promises).then(
                    ([
                      currentScore,
                      currentLevelIndicator,
                      reserveLifeCount
                    ]) => {
                      // If we're only grabbing the score.
                      if (
                        currentScore !== undefined &&
                        reserveLifeCount === undefined
                      ) {
                        console.log("CURRENT SCORE", currentScore);
                      }

                      // If we have a fully built out driver.
                      if (
                        currentScore !== undefined &&
                        reserveLifeCount !== undefined
                      ) {
                        // New Game
                        if (
                          currentLevelIndicator !== undefined &&
                          currentScore === 0 &&
                          currentLevelIndicator === "L=01" &&
                          reserveLifeCount === 2
                        ) {
                          console.log("START");
                        }

                        // Screen Cleared
                        else if (
                          !didLifeCountIncrease &&
                          reserveLifeCount >= lastReadLifeCount
                        ) {
                          console.log(
                            "CLEARED",
                            currentScore,
                            currentScore - lastReadScore
                          );
                        }

                        // Screen Cleared (gained a 1up)
                        else if (
                          didLifeCountIncrease &&
                          reserveLifeCount > lastReadLifeCount
                        ) {
                          console.log(
                            "CLEARED",
                            currentScore,
                            currentScore - lastReadScore
                          );
                        }

                        // Death
                        else if (
                          !didLifeCountIncrease &&
                          reserveLifeCount < lastReadLifeCount
                        ) {
                          console.log(
                            "DEATH",
                            currentScore,
                            currentScore - lastReadScore
                          );
                        }

                        // Death (gained a 1up)
                        else if (
                          didLifeCountIncrease &&
                          reserveLifeCount === lastReadLifeCount
                        ) {
                          console.log(
                            "DEATH",
                            currentScore,
                            currentScore - lastReadScore
                          );
                        }
                      }

                      lastReadLifeCount = reserveLifeCount;
                      lastReadScore = currentScore;
                      didLifeCountIncrease = false;

                      isThinking = false;
                    }
                  );
                }, thinkingIntervalMs);
              }
            }
          );
        }
      }, watchingIntervalMs);
    };

    return activate;
  }

  generateGetTriggerText(
    startX: number,
    endX: number,
    y: number,
    text: string,
    gameResolution: any
  ): Function {
    const getTriggerText = function(image: Jimp): Promise<any> {
      return new Promise(async (resolve, reject) => {
        try {
          let buffer = await this.captureEngine.dumpBlocks(
            image,
            gameResolution,
            { startX: startX, endX: endX },
            { startY: y, endY: y }
          );

          let result = await Tesseract.recognize(buffer);

          if (
            compareTwoStrings(text, result.text.toLowerCase().trim()) >= 0.6
          ) {
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (e) {
          reject(e);
        }
      });
    };

    return getTriggerText;
  }

  generateGetGameOverText(
    startX: number,
    endX: number,
    y: number,
    text: string,
    gameResolution: any
  ): Function {
    const getGameOverText = function(image: Jimp): Promise<any> {
      return new Promise(async (resolve, reject) => {
        try {
          let buffer = await this.captureEngine.dumpBlocks(
            image,
            gameResolution,
            { startX: startX, endX: endX },
            { startY: y, endY: y }
          );

          let result = await Tesseract.recognize(buffer);

          if (
            result.text
              .toLowerCase()
              .trim()
              .includes(text)
          ) {
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (e) {
          reject(e);
        }
      });
    };

    return getGameOverText;
  }

  generateGetLevelIndicatorValue(
    startX: number,
    endX: number,
    y: number,
    gameResolution: any,
    prefix?: string,
    characterWhitelist: string = "1234567890"
  ): Function {
    const getLevelIndicatorValue = function(image: Jimp): Promise<any> {
      return new Promise(async (resolve, reject) => {
        try {
          let buffer = await this.captureEngine.dumpBlocks(
            image,
            gameResolution,
            { startX: startX, endX: endX },
            { startY: y, endY: y }
          );

          let result = await Tesseract.recognize(buffer, {
            tessedit_char_whitelist: characterWhitelist
          });

          let resolution = "";
          if (prefix) {
            resolution = `${prefix}${result.text.trim()}`;
          } else {
            resolution = result.text.trim();
          }

          resolve(resolution);
        } catch (e) {
          reject(e);
        }
      });
    };

    return getLevelIndicatorValue;
  }

  generateGetScoreValue(
    startX: number,
    endX: number,
    y: number,
    gameResolution: any
  ): Function {
    const getScoreValue = function(
      image: Jimp,
      currentScore: number
    ): Promise<any> {
      return new Promise(async (resolve, reject) => {
        try {
          let buffer = await this.captureEngine.dumpBlocks(
            image,
            gameResolution,
            { startX: startX, endX: endX },
            { startY: y, endY: y }
          );

          let result = await Tesseract.recognize(buffer, {
            tessedit_char_whitelist: "1234567890"
          });

          if (parseInt(result.text) !== currentScore) {
            buffer = null;
            resolve(parseInt(result.text));
          }
        } catch (e) {
          reject(e);
        }
      });
    };

    return getScoreValue;
  }

  generateGetLifeCount(
    startX: number,
    endX: number,
    y: number,
    gameResolution: any
  ): Function {
    const getSpareLifeCount = function(
      image: Jimp,
      tileImages: Array<{ id: string; image: Jimp }>
    ): Promise<any> {
      return new Promise(async (resolve, reject) => {
        try {
          let currentLifeCount = 0;

          for (let i = startX; i <= endX; i += 1) {
            let tileBuffer = await this.captureEngine.dumpBlock(
              image,
              gameResolution,
              i,
              y
            );

            let comparisonValue = await this.parserEngine.compareBlockToTiles(
              tileBuffer,
              tileImages
            );

            if (comparisonValue[0].id === "life") {
              currentLifeCount += 1;
            }
          }

          resolve(currentLifeCount);
        } catch (e) {
          reject(e);
        }
      });
    };

    return getSpareLifeCount;
  }
}
