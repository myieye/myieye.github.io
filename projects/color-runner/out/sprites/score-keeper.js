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
define(["require", "exports", "phaser-ce", "./score-bars", "./score-ticker", "../utils/utils", "../helpers/const"], function (require, exports, phaser_ce_1, score_bars_1, score_ticker_1, utils_1, const_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ScoreKeeper = /** @class */ (function (_super) {
        __extends(ScoreKeeper, _super);
        function ScoreKeeper(game) {
            var _this = _super.call(this, game) || this;
            _this.x = 0;
            _this.y = 0;
            _this.fixedToCamera = true;
            _this.cameraOffset.setTo(0, 0);
            var height = const_1.Const.Score.Height;
            var tickerWidth = 90;
            var borderWidth = 6;
            var background = game.add.graphics(0, 0, _this);
            background
                .lineStyle(borderWidth, phaser_ce_1.Color.BLACK)
                .moveTo(0, height)
                .lineTo(utils_1.ScreenUtils.width(), height)
                .moveTo(tickerWidth, 0)
                .lineTo(tickerWidth, height)
                .beginFill(phaser_ce_1.Color.BLACK, 0.4)
                .lineStyle(0)
                .drawRect(0, 0, utils_1.ScreenUtils.width(), height);
            _this.scoreTicker = new score_ticker_1.default(game, tickerWidth, height);
            _this.scoreBars = new score_bars_1.default(game, tickerWidth + borderWidth / 2, 0, utils_1.ScreenUtils.width() - tickerWidth, height - borderWidth / 2);
            _this.addMultiple([background, _this.scoreTicker, _this.scoreBars]);
            return _this;
        }
        ScoreKeeper.prototype.init = function (colors, target) {
            this.scoreBars.init(colors);
            this.points = [];
            this.target = target;
            for (var _i = 0, colors_1 = colors; _i < colors_1.length; _i++) {
                var color = colors_1[_i];
                this.points[color] = 0;
            }
        };
        ScoreKeeper.prototype.increment = function (color) {
            this.points[color]++;
            this.scoreBars.setColor(color, this.points[color] / this.target);
            this.scoreTicker.increment();
            return this.points[color] >= this.target;
        };
        ScoreKeeper.prototype.resetColors = function () {
            this.scoreBars.reset();
        };
        return ScoreKeeper;
    }(phaser_ce_1.Group));
    exports.default = ScoreKeeper;
});
//# sourceMappingURL=score-keeper.js.map