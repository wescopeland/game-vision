"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var Jimp = require("jimp");
var Tesseract = require("tesseract.js");
var game_vision_1 = require("../../game-vision");
var donkey_kong_splits_1 = require("./donkey-kong.splits");
var donkey_kong_tile_paths_1 = require("./donkey-kong.tile-paths");
var donkey_kong_processes_1 = require("./donkey-kong.processes");
var DonkeyKong = /** @class */ (function (_super) {
    __extends(DonkeyKong, _super);
    function DonkeyKong() {
        var _this = _super.call(this) || this;
        _this.lastReadLifeCount = null;
        _this.lastReadScore = null;
        _this.didLifeCountIncrease = false;
        _this.isThinking = false;
        _this.splits = donkey_kong_splits_1.splits;
        _this.tilePaths = donkey_kong_tile_paths_1.tilePaths;
        _this.processes = donkey_kong_processes_1.processes;
        _this.gameResolution = {
            width: 224,
            height: 256,
            blockWidth: 8,
            blockHeight: 8
        };
        _this.activate();
        return _this;
    }
    DonkeyKong.prototype.newActivate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.buildTileImages(this.tilePaths)];
                    case 1:
                        _a.tileImages = _b.sent();
                        console.log(this.tileImages);
                        return [2 /*return*/];
                }
            });
        });
    };
    DonkeyKong.prototype.activate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.buildTileImages(this.tilePaths)];
                    case 1:
                        _a.tileImages = _b.sent();
                        setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _a, newSpareLifeCount, initializerPromises;
                            var _this = this;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!!this.isThinking) return [3 /*break*/, 3];
                                        _a = this;
                                        return [4 /*yield*/, this.captureEngine.initializeImage(this.processes, this.gameResolution)];
                                    case 1:
                                        _a.currentImage = _b.sent();
                                        return [4 /*yield*/, this.getSpareLifeCount(this.currentImage, this.tileImages)];
                                    case 2:
                                        newSpareLifeCount = _b.sent();
                                        if (newSpareLifeCount > this.lastReadLifeCount) {
                                            this.didLifeCountIncrease = true;
                                        }
                                        initializerPromises = [
                                            this.getHowHighText(this.currentImage),
                                            this.getGameOverText(this.currentImage)
                                        ];
                                        Promise.all(initializerPromises).then(function (_a) {
                                            var isShowingHowHighText = _a[0], isShowingGameOverText = _a[1];
                                            if (isShowingGameOverText) {
                                                console.log("game over");
                                            }
                                            if (isShowingHowHighText) {
                                                _this.isThinking = true;
                                                setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                                    var _a, promises;
                                                    var _this = this;
                                                    return __generator(this, function (_b) {
                                                        switch (_b.label) {
                                                            case 0:
                                                                _a = this;
                                                                return [4 /*yield*/, this.captureEngine.initializeImage(this.processes, this.gameResolution)];
                                                            case 1:
                                                                _a.currentImage = _b.sent();
                                                                promises = [
                                                                    this.getScoreValue(this.currentImage, this.currentScore),
                                                                    this.getLevelIndicatorValue(this.currentImage),
                                                                    this.getSpareLifeCount(this.currentImage, this.tileImages)
                                                                ];
                                                                Promise.all(promises).then(function (_a) {
                                                                    var currentScore = _a[0], currentLevelIndicator = _a[1], reserveLifeCount = _a[2];
                                                                    // New Game
                                                                    if (currentScore === 0 &&
                                                                        currentLevelIndicator === "L=01" &&
                                                                        reserveLifeCount === 2) {
                                                                        console.log("new game");
                                                                    }
                                                                    // Screen Cleared
                                                                    else if (!_this.didLifeCountIncrease &&
                                                                        reserveLifeCount >= _this.lastReadLifeCount) {
                                                                        console.log("screen cleared", currentScore, currentScore - _this.lastReadScore);
                                                                    }
                                                                    // Screen Cleared (gained a 1up)
                                                                    else if (_this.didLifeCountIncrease &&
                                                                        reserveLifeCount > _this.lastReadLifeCount) {
                                                                        console.log("screen cleared", currentScore, currentScore - _this.lastReadScore);
                                                                    }
                                                                    // Death
                                                                    else if (!_this.didLifeCountIncrease &&
                                                                        reserveLifeCount < _this.lastReadLifeCount) {
                                                                        console.log("death", currentScore - _this.lastReadScore);
                                                                    }
                                                                    // Death (gained a 1up)
                                                                    else if (_this.didLifeCountIncrease &&
                                                                        reserveLifeCount === _this.lastReadLifeCount) {
                                                                        console.log("death", currentScore - _this.lastReadScore);
                                                                    }
                                                                    _this.lastReadLifeCount = reserveLifeCount;
                                                                    _this.lastReadScore = currentScore;
                                                                    _this.didLifeCountIncrease = false;
                                                                    _this.isThinking = false;
                                                                });
                                                                return [2 /*return*/];
                                                        }
                                                    });
                                                }); }, 2500);
                                            }
                                        });
                                        _b.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }, 1500);
                        return [2 /*return*/];
                }
            });
        });
    };
    DonkeyKong.prototype.getSpareLifeCount = function (image, tileImages) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var currentLifeCount, i, tileBuffer, comparisonValue;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    currentLifeCount = 0;
                                    i = 1;
                                    _a.label = 1;
                                case 1:
                                    if (!(i <= 6)) return [3 /*break*/, 5];
                                    return [4 /*yield*/, this.captureEngine.dumpBlock(image, this.gameResolution, i, 3)];
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
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    DonkeyKong.prototype.buildTileImages = function (tilePaths) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var images;
                        var _this = this;
                        return __generator(this, function (_a) {
                            images = [];
                            tilePaths.forEach(function (tilePath) { return __awaiter(_this, void 0, void 0, function () {
                                var image;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, Jimp.read("assets/" + tilePath.path)];
                                        case 1:
                                            image = _a.sent();
                                            images.push({
                                                image: image,
                                                id: tilePath.id
                                            });
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            resolve(images);
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    DonkeyKong.prototype.determineCurrentScreen = function (image, tileImages) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var tileBuffer;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.captureEngine.dumpBlock(image, this.gameResolution, 13, 17)];
                                case 1:
                                    tileBuffer = _a.sent();
                                    this.parserEngine.compareBlockToTiles(tileBuffer, tileImages);
                                    resolve();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    DonkeyKong.prototype.getHowHighText = function (image) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var buffer, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.captureEngine.dumpBlocks(image, this.gameResolution, { startX: 3, endX: 5 }, { startY: 30, endY: 30 })];
                                case 1:
                                    buffer = _a.sent();
                                    return [4 /*yield*/, Tesseract.recognize(buffer)];
                                case 2:
                                    result = _a.sent();
                                    if (result.text
                                        .toLowerCase()
                                        .trim()
                                        .includes("how")) {
                                        resolve(true);
                                    }
                                    else {
                                        resolve(false);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    DonkeyKong.prototype.getGameOverText = function (image) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var buffer, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.captureEngine.dumpBlocks(image, this.gameResolution, { startX: 9, endX: 12 }, { startY: 22, endY: 22 }, true)];
                                case 1:
                                    buffer = _a.sent();
                                    return [4 /*yield*/, Tesseract.recognize(buffer)];
                                case 2:
                                    result = _a.sent();
                                    if (result.text
                                        .toLowerCase()
                                        .trim()
                                        .includes("game")) {
                                        resolve(true);
                                    }
                                    else {
                                        resolve(false);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    DonkeyKong.prototype.getLevelIndicatorValue = function (image) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var buffer, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.captureEngine.dumpBlocks(image, this.gameResolution, { startX: 23, endX: 24 }, { startY: 3, endY: 3 })];
                                case 1:
                                    buffer = _a.sent();
                                    return [4 /*yield*/, Tesseract.recognize(buffer, {
                                            tessedit_char_whitelist: "L=1234567890"
                                        })];
                                case 2:
                                    result = _a.sent();
                                    resolve("L=" + result.text.trim());
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    DonkeyKong.prototype.getScoreValue = function (image, currentScore) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var buffer, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.captureEngine.dumpBlocks(image, this.gameResolution, { startX: 1, endX: 6 }, { startY: 1, endY: 1 })];
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
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    return DonkeyKong;
}(game_vision_1.GameVision));
exports.DonkeyKong = DonkeyKong;
//# sourceMappingURL=donkey-kong.driver.js.map