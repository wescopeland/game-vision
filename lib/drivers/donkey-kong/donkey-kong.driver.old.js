// import Jimp = require("jimp");
// import * as Tesseract from "tesseract.js";
//
// import { GameVision } from "../../game-vision";
// import { splits } from "./donkey-kong.splits";
// import { tilePaths } from "./donkey-kong.tile-paths";
// import { processes } from "./donkey-kong.processes";
//
// import { TilePath } from "../../models/tile-path.model";
//
// export class DonkeyKong extends GameVision {
//   public currentLevelIndicatorValue: string;
//   public currentScore: number;
//   public isShowingHowHighText: boolean;
//   public livesRemaining: number;
//
//   public lastReadLifeCount: number = null;
//   public lastReadScore: number = null;
//   public didLifeCountIncrease: boolean = false;
//   public isThinking: boolean = false;
//
//   constructor() {
//     super();
//
//     this.splits = splits;
//     this.tilePaths = tilePaths;
//     this.processes = processes;
//
//     this.name = "Donkey Kong";
//     this.gameResolution = {
//       width: 224,
//       height: 256,
//       blockWidth: 8,
//       blockHeight: 8
//     };
//
//     this.livesStartX = 1;
//     this.livesEndX = 6;
//     this.livesY = 3;
//
//     this.scoreStartX = 1;
//     this.scoreEndX = 6;
//     this.scoreY = 1;
//
//     this.stageStartX = 23;
//     this.stageEndX = 24;
//     this.stageY = 3;
//
//     this.gameOverText = "game";
//     this.gameOverStartX = 9;
//     this.gameOverEndX = 12;
//     this.gameOverY = 22;
//
//     this.triggerText = "how";
//     this.triggerStartX = 3;
//     this.triggerEndX = 5;
//     this.triggerY = 30;
//
//     this.activate();
//   }
//
//   async activate() {
//     this.tileImages = await this.buildTileImages(this.tilePaths);
//
//     setInterval(async () => {
//       if (!this.isThinking) {
//         this.currentImage = await this.captureEngine.initializeImage(
//           this.processes,
//           this.gameResolution
//         );
//
//         // Did we gain an extra life while playing the stage?
//         let newSpareLifeCount = await this.getSpareLifeCount(
//           this.currentImage,
//           this.tileImages
//         );
//
//         if (newSpareLifeCount > this.lastReadLifeCount) {
//           this.didLifeCountIncrease = true;
//         }
//
//         let initializerPromises = [
//           this.getHowHighText(this.currentImage),
//           this.getGameOverText(this.currentImage)
//         ];
//
//         Promise.all(initializerPromises).then(
//           ([isShowingHowHighText, isShowingGameOverText]) => {
//             if (isShowingGameOverText) {
//               console.log("END");
//             }
//
//             if (isShowingHowHighText) {
//               this.isThinking = true;
//
//               setTimeout(async () => {
//                 this.currentImage = await this.captureEngine.initializeImage(
//                   this.processes,
//                   this.gameResolution
//                 );
//
//                 let promises = [
//                   this.getScoreValue(this.currentImage, this.currentScore),
//                   this.getLevelIndicatorValue(this.currentImage),
//                   this.getSpareLifeCount(this.currentImage, this.tileImages)
//                 ];
//
//                 Promise.all(promises).then(
//                   ([currentScore, currentLevelIndicator, reserveLifeCount]) => {
//                     // New Game
//                     if (
//                       currentScore === 0 &&
//                       currentLevelIndicator === "L=01" &&
//                       reserveLifeCount === 2
//                     ) {
//                       console.log("START");
//                     }
//
//                     // Screen Cleared
//                     else if (
//                       !this.didLifeCountIncrease &&
//                       reserveLifeCount >= this.lastReadLifeCount
//                     ) {
//                       console.log(
//                         "CLEARED",
//                         currentScore,
//                         currentScore - this.lastReadScore
//                       );
//                     }
//
//                     // Screen Cleared (gained a 1up)
//                     else if (
//                       this.didLifeCountIncrease &&
//                       reserveLifeCount > this.lastReadLifeCount
//                     ) {
//                       console.log(
//                         "CLEARED",
//                         currentScore,
//                         currentScore - this.lastReadScore
//                       );
//                     }
//
//                     // Death
//                     else if (
//                       !this.didLifeCountIncrease &&
//                       reserveLifeCount < this.lastReadLifeCount
//                     ) {
//                       console.log(
//                         "DEATH",
//                         currentScore,
//                         currentScore - this.lastReadScore
//                       );
//                     }
//
//                     // Death (gained a 1up)
//                     else if (
//                       this.didLifeCountIncrease &&
//                       reserveLifeCount === this.lastReadLifeCount
//                     ) {
//                       console.log(
//                         "DEATH",
//                         currentScore,
//                         currentScore - this.lastReadScore
//                       );
//                     }
//
//                     this.lastReadLifeCount = reserveLifeCount;
//                     this.lastReadScore = currentScore;
//                     this.didLifeCountIncrease = false;
//
//                     this.isThinking = false;
//                   }
//                 );
//               }, 2500);
//             }
//           }
//         );
//       }
//     }, 1500);
//   }
//
//   async getSpareLifeCount(
//     image: Jimp,
//     tileImages: Array<{ id: string; image: Jimp }>
//   ): Promise<any> {
//     return new Promise(async (resolve, reject) => {
//       let currentLifeCount = 0;
//
//       // It is possible to have six lives in the bank.
//       for (let i = 1; i <= 6; i += 1) {
//         let tileBuffer = await this.captureEngine.dumpBlock(
//           image,
//           this.gameResolution,
//           i,
//           3
//         );
//
//         let comparisonValue = await this.parserEngine.compareBlockToTiles(
//           tileBuffer,
//           tileImages
//         );
//
//         if (comparisonValue[0].id === "life") {
//           currentLifeCount += 1;
//         }
//       }
//
//       resolve(currentLifeCount);
//     });
//   }
//
//   async determineCurrentScreen(
//     image: Jimp,
//     tileImages: Array<{ id: string; image: Jimp }>
//   ): Promise<any> {
//     return new Promise(async (resolve, reject) => {
//       let tileBuffer = await this.captureEngine.dumpBlock(
//         image,
//         this.gameResolution,
//         13,
//         17
//       );
//
//       this.parserEngine.compareBlockToTiles(tileBuffer, tileImages);
//
//       resolve();
//     });
//   }
//
//   async getHowHighText(image: Jimp): Promise<any> {
//     return new Promise(async (resolve, reject) => {
//       let buffer = await this.captureEngine.dumpBlocks(
//         image,
//         this.gameResolution,
//         { startX: 3, endX: 5 },
//         { startY: 30, endY: 30 }
//       );
//
//       let result = await Tesseract.recognize(buffer);
//
//       if (
//         result.text
//           .toLowerCase()
//           .trim()
//           .includes("how")
//       ) {
//         resolve(true);
//       } else {
//         resolve(false);
//       }
//     });
//   }
//
//   async getGameOverText(image: Jimp): Promise<any> {
//     return new Promise(async (resolve, reject) => {
//       let buffer = await this.captureEngine.dumpBlocks(
//         image,
//         this.gameResolution,
//         { startX: 9, endX: 12 },
//         { startY: 22, endY: 22 }
//       );
//
//       let result = await Tesseract.recognize(buffer);
//
//       if (
//         result.text
//           .toLowerCase()
//           .trim()
//           .includes("game")
//       ) {
//         resolve(true);
//       } else {
//         resolve(false);
//       }
//     });
//   }
//
//   async getLevelIndicatorValue(image: Jimp): Promise<any> {
//     return new Promise(async (resolve, reject) => {
//       let buffer = await this.captureEngine.dumpBlocks(
//         image,
//         this.gameResolution,
//         { startX: 23, endX: 24 },
//         { startY: 3, endY: 3 }
//       );
//
//       let result = await Tesseract.recognize(buffer, {
//         tessedit_char_whitelist: "L=1234567890"
//       });
//
//       resolve(`L=${result.text.trim()}`);
//     });
//   }
//
//   async getScoreValue(image: Jimp, currentScore: number): Promise<any> {
//     return new Promise(async (resolve, reject) => {
//       let buffer = await this.captureEngine.dumpBlocks(
//         image,
//         this.gameResolution,
//         { startX: 1, endX: 6 },
//         { startY: 1, endY: 1 }
//       );
//
//       let result = await Tesseract.recognize(buffer, {
//         tessedit_char_whitelist: "1234567890"
//       });
//
//       if (parseInt(result.text) !== currentScore) {
//         buffer = null;
//         resolve(parseInt(result.text));
//       }
//     });
//   }
// }
//# sourceMappingURL=donkey-kong.driver.old.js.map