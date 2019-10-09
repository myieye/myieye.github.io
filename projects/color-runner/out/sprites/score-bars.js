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
    var ScoreBars = /** @class */ (function (_super) {
        __extends(ScoreBars, _super);
        function ScoreBars(game, x, y, width, height) {
            var _this = _super.call(this, game) || this;
            _this.x = x;
            _this.y = y;
            _this.xSpace = width;
            _this.ySpace = height;
            return _this;
        }
        ScoreBars.prototype.init = function (colors) {
            this.bars = [];
            var barHeight = this.ySpace / colors.length;
            var currY = this.y;
            for (var _i = 0, colors_1 = colors; _i < colors_1.length; _i++) {
                var color = colors_1[_i];
                var bar = this.game.add.graphics(0, currY, this);
                bar.tint = color;
                bar.lineColor = color;
                bar.boundsPadding = 0;
                this.bars[color] = {
                    width: 0,
                    height: barHeight,
                    bar: this.add(bar)
                };
                currY += barHeight;
            }
            this.render();
        };
        ScoreBars.prototype.render = function () {
            for (var i in this.bars) {
                var scoreBar = this.bars[i];
                if (!scoreBar.bar.width) {
                    scoreBar.bar.beginFill(scoreBar.bar.tint);
                    scoreBar.bar.drawRect(0, 0, 1, scoreBar.height);
                }
                this.game.add.tween(scoreBar.bar).to({ width: scoreBar.width }, 400, undefined, true);
            }
        };
        ScoreBars.prototype.setColor = function (color, percent) {
            var bar = this.bars[color];
            bar.width = this.xSpace * percent;
            this.render();
        };
        ScoreBars.prototype.reset = function () {
            for (var _i = 0, _a = Object.keys(this.bars); _i < _a.length; _i++) {
                var color = _a[_i];
                this.bars[color].width = 0;
            }
            this.render();
        };
        return ScoreBars;
    }(phaser_ce_1.Group));
    exports.default = ScoreBars;
});
//# sourceMappingURL=score-bars.js.map