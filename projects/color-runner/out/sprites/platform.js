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
define(["require", "exports", "phaser-ce", "../helpers/settings"], function (require, exports, phaser_ce_1, settings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Platform = /** @class */ (function (_super) {
        __extends(Platform, _super);
        function Platform(game, x, y, number, tint, animate) {
            var _this = _super.call(this, game, x, y) || this;
            _this.targetX = x;
            _this.targetY = y;
            var createX = !animate ? x : x + settings_1.Const.Platform.Animation.LockDist;
            var createY = !animate ? y : -settings_1.Const.Platform.Height;
            Phaser.Sprite.call(_this, game, createX, createY, 'platform');
            game.physics.enable(_this, Phaser.Physics.ARCADE);
            _this.body.allowGravity = false;
            _this.body.immovable = true;
            _this.tint = tint || settings_1.Const.Platform.DefaultTint;
            _this.number = number;
            _this.matched = _this.tint == settings_1.Const.Platform.DefaultTint;
            if (animate) {
                _this.animateIntoGame(game, x, y);
            }
            return _this;
        }
        Platform.prototype.onMatched = function () {
            this.matched = true;
            this.tint = settings_1.Const.Platform.DefaultTint;
        };
        Platform.prototype.onMissed = function () {
            this.missed = true;
        };
        Platform.prototype.animateIntoGame = function (game, x, y) {
            var up = game.add.tween(this)
                .to({ x: this.x, y: y }, settings_1.Const.Platform.Animation.DownSpeed, Phaser.Easing.Quadratic.Out, true);
            var lockIn = game.add.tween(this)
                .to({ x: x, y: y }, settings_1.Const.Platform.Animation.LockSpeed);
            up.chain(lockIn);
        };
        return Platform;
    }(phaser_ce_1.Sprite));
    exports.default = Platform;
});
//# sourceMappingURL=platform.js.map