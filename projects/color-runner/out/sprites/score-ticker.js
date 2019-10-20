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
    var ScoreTicker = /** @class */ (function (_super) {
        __extends(ScoreTicker, _super);
        function ScoreTicker(game, width, height) {
            var _this = _super.call(this, game) || this;
            _this.score = 0;
            var text = _this.text = game.add.text(0, 0, _this.score.toString(), { font: "bold 35px tricolor-bw", fill: "#fff", boundsAlignH: "right", boundsAlignV: "middle",
                stroke: "#000", strokeThickness: 6 });
            //text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            text.setTextBounds(0, 0, width - 10, height + 10);
            _this.add(text);
            return _this;
        }
        ScoreTicker.prototype.increment = function () {
            this.text.text = (++this.score).toString();
        };
        return ScoreTicker;
    }(phaser_ce_1.Group));
    exports.default = ScoreTicker;
});
//# sourceMappingURL=score-ticker.js.map