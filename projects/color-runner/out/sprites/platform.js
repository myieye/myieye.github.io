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
define(["require", "exports", "phaser-ce", "../helpers/const"], function (require, exports, phaser_ce_1, const_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Platform = /** @class */ (function (_super) {
        __extends(Platform, _super);
        function Platform(game, x, platformGroup, number, tint, animate) {
            if (tint === void 0) { tint = const_1.Const.Color.DefaultTint; }
            if (animate === void 0) { animate = false; }
            var _this = _super.call(this, game, x, 0, "platform") || this;
            Platform.lastPlatform = _this;
            _this.target = new phaser_ce_1.Point(x, 0);
            _this.x = !animate ? x : x + const_1.Const.Platform.Animation.LockDist;
            if (animate && platformGroup) {
                _this.y = -(platformGroup.y + const_1.Const.Platform.Size.Height);
            }
            else {
                _this.y = 0;
            }
            game.physics.enable(_this, phaser_ce_1.Physics.ARCADE);
            _this.body.allowGravity = false;
            _this.body.immovable = true;
            _this.body.syncBounds = true;
            _this.tint = tint || const_1.Const.Color.DefaultTint;
            _this.number = number;
            _this.matched = _this.tint == const_1.Const.Color.DefaultTint;
            if (animate) {
                _this.animateIntoGame(game, x, 0);
            }
            return _this;
        }
        Platform.prototype.update = function () {
            // Make it collidable from after the "lock"
            var bounds = this.getBounds();
            var bodyWidthPercent = 1 - const_1.Const.Platform.Size.LockSizePerc;
            this.body.height = bounds.height;
            this.body.width = bounds.width * bodyWidthPercent;
            var bodyOffset = bounds.width * const_1.Const.Platform.Size.LockSizePerc;
            this.body.offset.x = bodyOffset / this.scale.x;
        };
        Platform.prototype.onMatched = function () {
            this.matched = true;
            this.tint = const_1.Const.Color.DefaultTint;
        };
        Platform.prototype.onMissed = function () {
            this.missed = true;
        };
        Platform.prototype.animateIntoGame = function (game, x, y) {
            var up = game.add.tween(this)
                .to({ x: this.x, y: y }, const_1.Const.Platform.Animation.DownSpeed, phaser_ce_1.Easing.Quadratic.Out, true);
            var lockIn = game.add.tween(this)
                .to({ x: x, y: y }, const_1.Const.Platform.Animation.LockSpeed);
            up.chain(lockIn);
            this.game;
        };
        Object.defineProperty(Platform, "width", {
            get: function () {
                if (Platform.lastPlatform && Platform.lastPlatform.worldTransform) {
                    return Platform.lastPlatform.getBounds().width; // / this.lastPlatform.worldScale.x;
                }
                else {
                    return const_1.Const.Platform.Size.Width;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Platform, "height", {
            get: function () {
                if (Platform.lastPlatform && Platform.lastPlatform.worldTransform) {
                    return Platform.lastPlatform.getBounds().height / Platform.lastPlatform.worldScale.y;
                }
                else {
                    return const_1.Const.Platform.Size.Height;
                }
            },
            enumerable: true,
            configurable: true
        });
        return Platform;
    }(phaser_ce_1.Sprite));
    exports.default = Platform;
});
//# sourceMappingURL=platform.js.map