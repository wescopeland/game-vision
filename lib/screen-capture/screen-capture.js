"use strict";
// Right now only works on OSX, but could on other platforms as well, see:
//  https://github.com/uiureo/node-screencapture/blob/cdaf9522ed5063f54b3efd917bc19ab81118d9c1/lib/capture_exec.js
// On Windows use: nircmdc.exe, on Linux use: scrot
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
var os_1 = require("os");
var uuid = require("shortid");
var path = require("path");
var fs = require("fs");
var child = require("child_process");
var ScreenCapture = /** @class */ (function () {
    function ScreenCapture() {
    }
    ScreenCapture.prototype.initializeImage = function (processes, gameResolution) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _a, buffer, image;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(os_1.platform() === "darwin")) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.getWindowId(processes[0])];
                    case 1:
                        _a._processId = _b.sent();
                        _b.label = 2;
                    case 2: return [4 /*yield*/, this.captureWindow(this._processId)];
                    case 3:
                        buffer = _b.sent();
                        return [4 /*yield*/, this.readBuffer(buffer)];
                    case 4:
                        image = _b.sent();
                        this.dumpImage(image);
                        image = this.resizeToBounds(image, gameResolution.width, gameResolution.height);
                        resolve(image);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    ScreenCapture.prototype.getWindowId = function (process) {
        return new Promise(function (resolve, reject) {
            // For MacOS, GetWindowID is a dependency.
            if (os_1.platform() === "darwin") {
                var cmd = "GetWindowID " + process.processName + " '" + process.windowTitle + "'";
                child.exec(cmd, function (err, stdout) {
                    if (err) {
                        console.log(err);
                        reject();
                    }
                    resolve(parseInt(stdout));
                });
            }
        });
    };
    ScreenCapture.prototype.dumpBlock = function (image, gameResolution, blockX, blockY, isDumpingImage) {
        if (isDumpingImage === void 0) { isDumpingImage = false; }
        var clonedImage = image.clone();
        clonedImage.crop(blockX * gameResolution.blockWidth, blockY * gameResolution.blockHeight, gameResolution.blockWidth, gameResolution.blockHeight);
        if (isDumpingImage) {
            this.dumpImage(clonedImage);
        }
        return clonedImage.getBufferAsync(Jimp.MIME_PNG);
    };
    ScreenCapture.prototype.dumpBlocks = function (image, gameResolution, xPath, yPath, isDumpingImage) {
        if (isDumpingImage === void 0) { isDumpingImage = false; }
        return __awaiter(this, void 0, void 0, function () {
            var clonedImage, captureWidth, i, captureHeight, i;
            return __generator(this, function (_a) {
                clonedImage = image.clone();
                captureWidth = 0;
                for (i = xPath.startX; i <= xPath.endX; i += 1) {
                    captureWidth += gameResolution.blockWidth;
                }
                captureHeight = 0;
                for (i = yPath.startY; i <= yPath.endY; i += 1) {
                    captureHeight += gameResolution.blockHeight;
                }
                clonedImage.crop(xPath.startX * gameResolution.blockWidth, yPath.startY * gameResolution.blockHeight, captureWidth, captureHeight);
                if (isDumpingImage) {
                    this.dumpImage(clonedImage);
                }
                return [2 /*return*/, clonedImage.getBufferAsync(Jimp.MIME_PNG)];
            });
        });
    };
    ScreenCapture.prototype.dumpImage = function (image) {
        image.write("dump.png");
    };
    ScreenCapture.prototype.generatePngPath = function () {
        return path.join(os_1.tmpdir(), uuid.generate() + ".png");
    };
    ScreenCapture.prototype.captureWindow = function (windowId, isDumpingImage) {
        var _this = this;
        if (windowId === void 0) { windowId = null; }
        if (isDumpingImage === void 0) { isDumpingImage = false; }
        return new Promise(function (resolve, reject) {
            var pngPath = _this.generatePngPath();
            var cmd = "";
            // We need a different window capture mechanism based on our OS.
            if (os_1.platform() === "darwin") {
                cmd = "screencapture -x -o -l " + windowId + " " + pngPath;
            }
            if (os_1.platform() === "win32") {
                cmd = "screenshot-cmd -wt \"AmaRecTV 2.31\" -o " + pngPath;
            }
            child.exec(cmd, function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                fs.readFile(pngPath, function (err, imageBuffer) {
                    if (err) {
                        console.log("Error in image capture.");
                        reject();
                    }
                    resolve(imageBuffer);
                });
            });
        });
    };
    ScreenCapture.prototype.readBuffer = function (buffer) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            Jimp.read(buffer)
                .then(function (image) {
                if (os_1.platform() === "darwin") {
                    image = _this._cropForMac(image);
                }
                else if (os_1.platform() === "win32") {
                    image = _this._cropForWindows(image);
                }
                resolve(image);
            })
                .catch(function (err) {
                console.log("Unable to read the input buffer.");
                reject(err);
            });
        });
    };
    ScreenCapture.prototype.resizeToBounds = function (image, x, y) {
        return image.resize(x, y);
    };
    ScreenCapture.prototype._cropForMac = function (image) {
        image.crop(0, 22, image.bitmap.width, image.bitmap.height - 22);
        return image;
    };
    ScreenCapture.prototype._cropForWindows = function (image) {
        image.crop(8, 67, image.bitmap.width - 16, image.bitmap.height - 97);
        // TODO: If this is direct capture...
        if (true) {
            image.rotate(90, false);
            image.crop(33, 64, image.bitmap.width - 41, image.bitmap.height - 186);
        }
        return image;
    };
    return ScreenCapture;
}());
exports.ScreenCapture = ScreenCapture;
//# sourceMappingURL=screen-capture.js.map