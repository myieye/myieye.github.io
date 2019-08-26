var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "phaser-ce"], function (require, exports, phaser_ce_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ScoreBoard = /** @class */ (function (_super) {
        __extends(ScoreBoard, _super);
        function ScoreBoard(game, x, y, width, height) {
            var _this = _super.call(this, game) || this;
            x = x || 10;
            y = y || 10;
            width = width || 60;
            height = height || 30;
            _this.score = 0;
            _this.fixedToCamera = true;
            _this.cameraOffset.setTo(x, y);
            var background = game.add.graphics(0, 0);
            background.beginFill(0x000000, 0.2);
            background.drawRect(0, 0, width, height);
            var text = _this.text = game.add.text(0, 0, _this.score, { font: "bold 20px Arial", fill: "#fff", boundsAlignH: "right", boundsAlignV: "middle" });
            text.padding.set(5);
            text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            text.setTextBounds(0, 0, width, height + 10);
            _this.addMultiple([background, text]);
            return _this;
        }
        ScoreBoard.prototype.increment = function () {
            this.text.text = (++this.score).toString();
        };
        return ScoreBoard;
    }(phaser_ce_1.Group));
    exports.default = ScoreBoard;
});
//# sourceMappingURL=score.js.map