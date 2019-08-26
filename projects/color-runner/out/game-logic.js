define(["require", "exports", "phaser-ce", "./sprites/platform", "./helpers/settings"], function (require, exports, phaser_ce_1, platform_1, settings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GameLogic = /** @class */ (function () {
        function GameLogic(gameState) {
            this.colors = settings_1.Const.Color.StartColors;
            this.gameState = gameState;
            this.game = gameState.game;
        }
        GameLogic.prototype.initGame = function () {
            this.currPlatformY = this.gameState.world.height - settings_1.Const.Platform.StartY;
            var startPlatforms = settings_1.Const.Platform.StartPlatforms;
            for (var _i = 0, startPlatforms_1 = startPlatforms; _i < startPlatforms_1.length; _i++) {
                var tint = startPlatforms_1[_i];
                this.addPlatform(this.gameState.platformGroup, tint);
            }
        };
        GameLogic.prototype.addPlatform = function (platformGroup, tint, animate) {
            if (animate === void 0) { animate = false; }
            var newPlatformX = this.lastPlatform
                ? this.lastPlatform.targetX + settings_1.Const.Platform.Width
                : settings_1.Const.Platform.StartX;
            var platformNumber = (this.lastPlatform && this.lastPlatform.number) || 1;
            this.lastPlatform = platformGroup.add(this.game.add.existing(new platform_1.default(this.game, newPlatformX, this.currPlatformY, platformNumber, tint, animate)));
        };
        GameLogic.prototype.update = function (game, platformGroup) {
            if (this.gameState.started && this.lastPlatform && (this.lastPlatform.worldPosition.x < settings_1.Const.Platform.LoadBuffer)) {
                var tint = game.rnd.pick(this.colors);
                this.addPlatform(platformGroup, tint, true);
            }
            platformGroup.x -= this.gameState.currSpeed;
        };
        GameLogic.prototype.getColorWheelHexColors = function () {
            return this.colors;
        };
        GameLogic.prototype.onPlatformMissed = function (platform) {
            this.onPlatformComplete(platform);
            platform.parent.y += settings_1.Const.Platform.Height;
            this.gameState.player.y += settings_1.Const.Platform.Height;
            platform.onMissed();
        };
        GameLogic.prototype.onPlatformMatched = function (platform) {
            this.onPlatformComplete(platform);
            this.gameState.score.increment();
            platform.onMatched();
        };
        GameLogic.prototype.onPlatformComplete = function (platform) {
            if (platform.number % settings_1.Const.Speed.IncreaseInterval == 0) {
                this.gameState.currSpeed = phaser_ce_1.Math.clamp(this.gameState.currSpeed + settings_1.Const.Speed.Increment, 0, settings_1.Const.Speed.Max);
            }
        };
        return GameLogic;
    }());
    exports.default = GameLogic;
});
//# sourceMappingURL=game-logic.js.map