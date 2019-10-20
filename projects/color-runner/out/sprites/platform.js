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
define(["require", "exports", "phaser-ce", "../helpers/const", "../helpers/color-exploder"], function (require, exports, phaser_ce_1, const_1, color_exploder_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Platform = /** @class */ (function (_super) {
        __extends(Platform, _super);
        function Platform(game, x, platformGroup, number, tint, animate) {
            if (tint === void 0) { tint = const_1.Const.Color.DefaultPlatformTint; }
            if (animate === void 0) { animate = false; }
            var _this = _super.call(this, game) || this;
            _this.x = x;
            _this.y = 0;
            _this.platform = _this.add(new phaser_ce_1.Sprite(game, 0, 0, const_1.Const.Images.Platform.name));
            _this.platform.smoothed = false;
            Platform.lastPlatform = _this.platform;
            _this.target = new phaser_ce_1.Point(x, 0);
            _this.x = !animate ? x : x + const_1.Const.Platform.Animation.LockDist;
            if (animate && platformGroup) {
                _this.y = -(platformGroup.y + const_1.Const.Platform.Size.Height);
            }
            else {
                _this.y = 0;
            }
            game.physics.enable(_this, phaser_ce_1.Physics.ARCADE);
            _this.platform.body.allowGravity = false;
            _this.platform.body.immovable = true;
            _this.platform.body.syncBounds = true;
            _this.platform.tint = tint || const_1.Const.Color.DefaultPlatformTint;
            _this.number = number;
            _this.matched = _this.platform.tint == const_1.Const.Color.DefaultPlatformTint;
            if (_this.platform.tint !== const_1.Const.Color.DefaultPlatformTint) {
                _this.glow = new phaser_ce_1.Sprite(game, _this.x + const_1.Const.Platform.Size.LockSize + _this.width / 2, 0, "platform-glow");
                _this.glow.width = const_1.Const.Platform.Size.Width - const_1.Const.Platform.Size.LockSize;
                _this.glow.anchor.setTo(.5, 1);
                _this.add(_this.glow);
                _this.glow.tint = _this.platform.tint;
            }
            if (animate) {
                _this.animateIntoGame(game, x, 0);
            }
            return _this;
        }
        Object.defineProperty(Platform.prototype, "tint", {
            get: function () { return this.platform.tint; },
            enumerable: true,
            configurable: true
        });
        Platform.prototype.update = function () {
            // Make it collidable from after the "lock"
            var bounds = this.getBounds();
            var bodyWidthPercent = 1 - const_1.Const.Platform.Size.LockSizePerc;
            this.platform.body.height = bounds.height;
            this.platform.body.width = bounds.width * bodyWidthPercent;
            var bodyOffset = bounds.width * const_1.Const.Platform.Size.LockSizePerc;
            this.platform.body.offset.x = bodyOffset / this.scale.x;
            if (this.glow) {
                this.glow.x = this.platform.centerX;
                this.glow.y = this.platform.y;
            }
            if (this.getBounds().right < -100) {
                this.destroy();
            }
        };
        Platform.prototype.onMatched = function () {
            var _this = this;
            this.matched = true;
            if (this.glow) {
                color_exploder_1.default.Instance(this.game).explode(this.platform, this.tint);
                this.game.add.tween(this.glow)
                    .to({ width: this.glow.width * .3, height: 0 }, 500, phaser_ce_1.Easing.Elastic.In, true)
                    .onComplete.addOnce(function () { return _this.platform.tint = const_1.Const.Color.DefaultPlatformTint; });
            }
            else {
                this.platform.tint = const_1.Const.Color.DefaultPlatformTint;
            }
        };
        Platform.prototype.onMissed = function () {
            this.missed = true;
        };
        Platform.prototype.animateIntoGame = function (game, x, y) {
            var up = game.add.tween(this)
                .to({ x: this.x, y: y }, const_1.Const.Platform.Animation.DownSpeed, phaser_ce_1.Easing.Quadratic.Out, true);
            var lockIn = game.add.tween(this)
                .to({ x: x, y: y }, const_1.Const.Platform.Animation.LockSpeed);
            if (this.glow) {
                this.glow.height = 0;
                this.glow.width = this.platform.width * .3;
                var addGlow = game.add.tween(this.glow)
                    .to({ height: this.height * .9, width: this.platform.width * (1 - const_1.Const.Platform.Size.LockSizePerc) }, 500, phaser_ce_1.Easing.Quadratic.Out);
                up.chain(lockIn, addGlow);
            }
            else {
                up.chain(lockIn);
            }
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
    }(phaser_ce_1.Group));
    exports.default = Platform;
});
//# sourceMappingURL=platform.js.map