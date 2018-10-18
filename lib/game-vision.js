"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var screen_capture_1 = require("./screen-capture/screen-capture");
var screen_parser_1 = require("./screen-parser/screen-parser");
var GameVision = /** @class */ (function () {
    function GameVision() {
        this.captureEngine = new screen_capture_1.ScreenCapture();
        this.parserEngine = new screen_parser_1.ScreenParser();
        console.log("Started GameVision...");
    }
    return GameVision;
}());
exports.GameVision = GameVision;
//# sourceMappingURL=game-vision.js.map