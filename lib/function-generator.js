"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Tesseract = require("tesseract.js");
var string_similarity_1 = require("string-similarity");
var screen_capture_1 = require("./screen-capture/screen-capture");
var screen_parser_1 = require("./screen-parser/screen-parser");
var GameVisionFunctionGenerator = /** @class */ (function () {
    function GameVisionFunctionGenerator() {
        this.captureEngine = new screen_capture_1.ScreenCapture();
        this.parserEngine = new screen_parser_1.ScreenParser();
    }
    GameVisionFunctionGenerator.prototype.generateActivate = function (watchingIntervalMs, thinkingIntervalMs, gameResolution) {
        var activate = function () {
            return __awaiter(this, void 0, void 0, function () {
                var currentImage, isThinking, lastReadLifeCount, lastReadScore, didLifeCountIncrease, livesRemaining, isShowingHowHighText, currentScore, currentLevelIndicatorValue, tileImages;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            isThinking = false;
                            lastReadLifeCount = null;
                            lastReadScore = null;
                            didLifeCountIncrease = false;
                            if (!(this.tilePaths && this.tilePaths.length)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.buildTileImages(this.tilePaths)];
                        case 1:
                            tileImages = _a.sent();
                            _a.label = 2;
                        case 2:
                            setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                                var newSpareLifeCount, initializerPromises;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!!isThinking) return [3 /*break*/, 4];
                                            return [4 /*yield*/, this.captureEngine.initializeImage(this.processes, gameResolution)];
                                        case 1:
                                            currentImage = _a.sent();
                                            if (!this.getSpareLifeCount) return [3 /*break*/, 3];
                                            return [4 /*yield*/, this.getSpareLifeCount(currentImage, tileImages)];
                                        case 2:
                                            newSpareLifeCount = _a.sent();
                                            if (newSpareLifeCount > lastReadLifeCount) {
                                                didLifeCountIncrease = true;
                                            }
                                            _a.label = 3;
                                        case 3:
                                            initializerPromises = [this.getTriggerText(currentImage)];
                                            if (this.getGameOverText) {
                                                initializerPromises.push(this.getGameOverText(currentImage));
                                            }
                                            Promise.all(initializerPromises).then(function (_a) {
                                                var isShowingTriggerText = _a[0], isShowingGameOverText = _a[1];
                                                if (_this.getGameOverText && isShowingGameOverText) {
                                                    console.log("END");
                                                }
                                                if (isShowingTriggerText) {
                                                    isThinking = true;
                                                    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                                        var promises;
                                                        return __generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0: return [4 /*yield*/, this.captureEngine.initializeImage(this.processes, gameResolution)];
                                                                case 1:
                                                                    currentImage = _a.sent();
                                                                    promises = [];
                                                                    if (this.getScoreValue) {
                                                                        promises.push(this.getScoreValue(currentImage, currentScore));
                                                                    }
                                                                    if (this.getLevelIndicatorValue) {
                                                                        promises.push(this.getLevelIndicatorValue(currentImage));
                                                                    }
                                                                    if (this.getSpareLifeCount) {
                                                                        promises.push(this.getSpareLifeCount(currentImage, tileImages));
                                                                    }
                                                                    Promise.all(promises).then(function (_a) {
                                                                        var currentScore = _a[0], currentLevelIndicator = _a[1], reserveLifeCount = _a[2];
                                                                        // If we're only grabbing the score.
                                                                        if (currentScore !== undefined &&
                                                                            reserveLifeCount === undefined) {
                                                                            console.log("CURRENT SCORE", currentScore);
                                                                        }
                                                                        // If we have a fully built out driver.
                                                                        if (currentScore !== undefined &&
                                                                            reserveLifeCount !== undefined) {
                                                                            // New Game
                                                                            if (currentLevelIndicator !== undefined &&
                                                                                currentScore === 0 &&
                                                                                currentLevelIndicator === "L=01" &&
                                                                                reserveLifeCount === 2) {
                                                                                console.log("START");
                                                                            }
                                                                            // Screen Cleared
                                                                            else if (!didLifeCountIncrease &&
                                                                                reserveLifeCount >= lastReadLifeCount) {
                                                                                console.log("CLEARED", currentScore, currentScore - lastReadScore);
                                                                            }
                                                                            // Screen Cleared (gained a 1up)
                                                                            else if (didLifeCountIncrease &&
                                                                                reserveLifeCount > lastReadLifeCount) {
                                                                                console.log("CLEARED", currentScore, currentScore - lastReadScore);
                                                                            }
                                                                            // Death
                                                                            else if (!didLifeCountIncrease &&
                                                                                reserveLifeCount < lastReadLifeCount) {
                                                                                console.log("DEATH", currentScore, currentScore - lastReadScore);
                                                                            }
                                                                            // Death (gained a 1up)
                                                                            else if (didLifeCountIncrease &&
                                                                                reserveLifeCount === lastReadLifeCount) {
                                                                                console.log("DEATH", currentScore, currentScore - lastReadScore);
                                                                            }
                                                                        }
                                                                        lastReadLifeCount = reserveLifeCount;
                                                                        lastReadScore = currentScore;
                                                                        didLifeCountIncrease = false;
                                                                        isThinking = false;
                                                                    });
                                                                    return [2 /*return*/];
                                                            }
                                                        });
                                                    }); }, thinkingIntervalMs);
                                                }
                                            });
                                            _a.label = 4;
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); }, watchingIntervalMs);
                            return [2 /*return*/];
                    }
                });
            });
        };
        return activate;
    };
    GameVisionFunctionGenerator.prototype.generateGetTriggerText = function (startX, endX, y, text, gameResolution) {
        var getTriggerText = function (image) {
            var _this = this;
            return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                var buffer, result, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.captureEngine.dumpBlocks(image, gameResolution, { startX: startX, endX: endX }, { startY: y, endY: y })];
                        case 1:
                            buffer = _a.sent();
                            return [4 /*yield*/, Tesseract.recognize(buffer)];
                        case 2:
                            result = _a.sent();
                            if (string_similarity_1.compareTwoStrings(text, result.text.toLowerCase().trim()) >= 0.6) {
                                resolve(true);
                            }
                            else {
                                resolve(false);
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            reject(e_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
        };
        return getTriggerText;
    };
    GameVisionFunctionGenerator.prototype.generateGetGameOverText = function (startX, endX, y, text, gameResolution) {
        var getGameOverText = function (image) {
            var _this = this;
            return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                var buffer, result, e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.captureEngine.dumpBlocks(image, gameResolution, { startX: startX, endX: endX }, { startY: y, endY: y })];
                        case 1:
                            buffer = _a.sent();
                            return [4 /*yield*/, Tesseract.recognize(buffer)];
                        case 2:
                            result = _a.sent();
                            if (result.text
                                .toLowerCase()
                                .trim()
                                .includes(text)) {
                                resolve(true);
                            }
                            else {
                                resolve(false);
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            e_2 = _a.sent();
                            reject(e_2);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
        };
        return getGameOverText;
    };
    GameVisionFunctionGenerator.prototype.generateGetLevelIndicatorValue = function (startX, endX, y, gameResolution, prefix, characterWhitelist) {
        if (characterWhitelist === void 0) { characterWhitelist = "1234567890"; }
        var getLevelIndicatorValue = function (image) {
            var _this = this;
            return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                var buffer, result, resolution, e_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.captureEngine.dumpBlocks(image, gameResolution, { startX: startX, endX: endX }, { startY: y, endY: y })];
                        case 1:
                            buffer = _a.sent();
                            return [4 /*yield*/, Tesseract.recognize(buffer, {
                                    tessedit_char_whitelist: characterWhitelist
                                })];
                        case 2:
                            result = _a.sent();
                            resolution = "";
                            if (prefix) {
                                resolution = "" + prefix + result.text.trim();
                            }
                            else {
                                resolution = result.text.trim();
                            }
                            resolve(resolution);
                            return [3 /*break*/, 4];
                        case 3:
                            e_3 = _a.sent();
                            reject(e_3);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
        };
        return getLevelIndicatorValue;
    };
    GameVisionFunctionGenerator.prototype.generateGetScoreValue = function (startX, endX, y, gameResolution) {
        var getScoreValue = function (image, currentScore) {
            var _this = this;
            return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                var buffer, result, e_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.captureEngine.dumpBlocks(image, gameResolution, { startX: startX, endX: endX }, { startY: y, endY: y })];
                        case 1:
                            buffer = _a.sent();
                            return [4 /*yield*/, Tesseract.recognize(buffer, {
                                    tessedit_char_whitelist: "1234567890"
                                })];
                        case 2:
                            result = _a.sent();
                            if (parseInt(result.text) !== currentScore) {
                                buffer = null;
                                resolve(parseInt(result.text));
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            e_4 = _a.sent();
                            reject(e_4);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
        };
        return getScoreValue;
    };
    GameVisionFunctionGenerator.prototype.generateGetLifeCount = function (startX, endX, y, gameResolution) {
        var getSpareLifeCount = function (image, tileImages) {
            var _this = this;
            return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                var currentLifeCount, i, tileBuffer, comparisonValue, e_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 6, , 7]);
                            currentLifeCount = 0;
                            i = startX;
                            _a.label = 1;
                        case 1:
                            if (!(i <= endX)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.captureEngine.dumpBlock(image, gameResolution, i, y)];
                        case 2:
                            tileBuffer = _a.sent();
                            return [4 /*yield*/, this.parserEngine.compareBlockToTiles(tileBuffer, tileImages)];
                        case 3:
                            comparisonValue = _a.sent();
                            if (comparisonValue[0].id === "life") {
                                currentLifeCount += 1;
                            }
                            _a.label = 4;
                        case 4:
                            i += 1;
                            return [3 /*break*/, 1];
                        case 5:
                            resolve(currentLifeCount);
                            return [3 /*break*/, 7];
                        case 6:
                            e_5 = _a.sent();
                            reject(e_5);
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            }); });
        };
        return getSpareLifeCount;
    };
    return GameVisionFunctionGenerator;
}());
exports.GameVisionFunctionGenerator = GameVisionFunctionGenerator;
//# sourceMappingURL=function-generator.js.map