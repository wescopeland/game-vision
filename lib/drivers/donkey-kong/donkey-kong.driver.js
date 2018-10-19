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
Object.defineProperty(exports, "__esModule", { value: true });
var game_vision_1 = require("../../game-vision");
var donkey_kong_tile_paths_1 = require("./donkey-kong.tile-paths");
var donkey_kong_processes_1 = require("./donkey-kong.processes");
var DonkeyKong = /** @class */ (function (_super) {
    __extends(DonkeyKong, _super);
    function DonkeyKong() {
        var _this = _super.call(this) || this;
        _this.tilePaths = donkey_kong_tile_paths_1.tilePaths;
        _this.processes = donkey_kong_processes_1.processes;
        _this.name = "Donkey Kong";
        _this.gameResolution = {
            width: 224,
            height: 256,
            blockWidth: 8,
            blockHeight: 8
        };
        _this.livesStartX = 1;
        _this.livesEndX = 6;
        _this.livesY = 3;
        _this.scoreStartX = 1;
        _this.scoreEndX = 6;
        _this.scoreY = 1;
        _this.stageStartX = 23;
        _this.stageEndX = 24;
        _this.stageY = 3;
        _this.gameOverText = "game";
        _this.gameOverStartX = 9;
        _this.gameOverEndX = 12;
        _this.gameOverY = 22;
        _this.triggerText = "how";
        _this.triggerStartX = 3;
        _this.triggerEndX = 5;
        _this.triggerY = 30;
        _this.levelIndicatorPrefix = "L=";
        _this.levelIndicatorStartX = 23;
        _this.levelIndicatorEndX = 24;
        _this.levelIndicatorY = 3;
        _this.watchingIntervalMs = 1500;
        _this.thinkingIntervalMs = 2500;
        _this.generateDriverFunctions();
        _this.activate();
        return _this;
    }
    return DonkeyKong;
}(game_vision_1.GameVision));
exports.DonkeyKong = DonkeyKong;
//# sourceMappingURL=donkey-kong.driver.js.map