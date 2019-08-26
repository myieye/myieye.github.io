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
    var Player = /** @class */ (function (_super) {
        __extends(Player, _super);
        function Player(gameState, x, y) {
            var _this = _super.call(this, gameState.game, x, y, "player", "default/000") || this;
            _this.currPlatforms = [];
            _this.game = gameState.game;
            _this.gameState = gameState;
            _this.game.physics.enable(_this, Phaser.Physics.ARCADE);
            _this.scale.setTo(0.4, 0.4);
            _this.body.setSize(120, 160);
            //this.anchor.set(0.5, 1);
            _this.animations.add('walk', Phaser.Animation.generateFrameNames('default/', 0, 8, '', 3), 20, true, false);
            var collider = _this.collider = _this.game.add.sprite();
            _this.game.physics.enable(collider, Phaser.Physics.ARCADE);
            collider.scale.setTo(0.4, 0.4);
            collider.body.allowGravity = false;
            collider.body.setSize(_this.body.width * .5, settings_1.Const.Platform.Height);
            //collider.anchor.set(1, 1);
            _this.tint = 0xFFFFFF;
            return _this;
        }
        Player.prototype.update = function () {
            if (this.targetTint) {
                this.tint = Phaser.Color.interpolateColor(this.tint, this.targetTint, 100, settings_1.Const.Color.ChangeSpeed, 1);
            }
            this.collider.x = this.x + (this.width * this.scale.x);
            this.collider.y = this.y + this.height;
            this.game.physics.arcade.collide(this, this.gameState.platformGroup);
            this.checkForMissedPlatform();
            this.currPlatforms = [];
            this.game.physics.arcade.overlap(this.collider, this.gameState.platformGroup, this.onPlatformCollision, null, this);
        };
        Player.prototype.setColor = function (color) {
            this.targetTint = color;
        };
        Player.prototype.getColor = function () {
            return this.targetTint || this.tint;
        };
        Player.prototype.walk = function () {
            this.animations.play("walk");
        };
        Player.prototype.onPlatformCollision = function (_, platform) {
            this.currPlatforms.push(platform);
            if (!platform.matched && this.platformMatches(platform)) {
                this.gameState.gameLogic.onPlatformMatched(platform);
            }
        };
        Player.prototype.platformMatches = function (platform) {
            return this.getColor() === platform.tint;
        };
        Player.prototype.checkForMissedPlatform = function () {
            for (var _i = 0, _a = this.currPlatforms; _i < _a.length; _i++) {
                var platform = _a[_i];
                if (!platform.matched && !platform.missed &&
                    platform.worldPosition.x + platform.width <= this.collider.x) {
                    this.gameState.gameLogic.onPlatformMissed(platform);
                }
            }
        };
        return Player;
    }(phaser_ce_1.Sprite));
    exports.default = Player;
});
//# sourceMappingURL=player.js.map