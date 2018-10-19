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
var PacMan = /** @class */ (function (_super) {
    __extends(PacMan, _super);
    function PacMan() {
        var _this = _super.call(this) || this;
        _this.processes = [
            {
                processName: "mame64",
                windowTitle: "MAME: Pac-Man (Midway, speedup hack) [pacmanf]"
            }
        ];
        _this.name = "Pac-Man";
        _this.gameResolution = {
            width: 224,
            height: 288,
            blockWidth: 8,
            blockHeight: 8
        };
        _this.scoreStartX = 1;
        _this.scoreEndX = 6;
        _this.scoreY = 1;
        _this.triggerText = "ready";
        _this.triggerStartX = 11;
        _this.triggerEndX = 15;
        _this.triggerY = 20;
        _this.watchingIntervalMs = 1000;
        _this.thinkingIntervalMs = 800;
        _this.generateDriverFunctions();
        _this.activate();
        return _this;
    }
    return PacMan;
}(game_vision_1.GameVision));
exports.PacMan = PacMan;
//# sourceMappingURL=pac-man.driver.js.map