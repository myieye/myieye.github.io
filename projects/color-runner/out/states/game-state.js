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
define(["require", "exports", "../game-logic", "../utils/utils", "../sprites/score", "../sprites/player", "../sprites/color-joystick", "../helpers/settings"], function (require, exports, game_logic_1, utils_1, score_1, player_1, color_joystick_1, settings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GameState = /** @class */ (function (_super) {
        __extends(GameState, _super);
        function GameState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GameState.prototype.init = function () {
            this.gameLogic = new game_logic_1.default(this);
            this.bg = this.add.sprite(0, -100, 'game-bg');
            this.bg.scale.setTo(2, 2);
            this.bg.fixedToCamera = true;
        };
        GameState.prototype.create = function () {
            var _this = this;
            // SETUP WORLD ------------------------------------------------
            this.world.resize(utils_1.default.width(), utils_1.default.height());
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.physics.arcade.gravity.y = 1000;
            var colorWheelPadding = 30;
            var colorWheelRadius = 70;
            var colorWheelPinRadius = 35;
            var colorWheelPos = {
                x: (this.camera.x + this.camera.width) - (colorWheelRadius + colorWheelPadding),
                //x: this.camera.x + Const.platform.loadBuffer + 100,
                y: (this.camera.y + this.camera.height) - (colorWheelRadius + colorWheelPadding)
            };
            this.obj = this.game.add.group(undefined, "objects");
            this.ui = this.game.add.group(undefined, "controls");
            // Color-Joystick
            var colorWheelColors = this.gameLogic.getColorWheelHexColors();
            var colorJoystick = new color_joystick_1.default(this.game, colorWheelPos.x, colorWheelPos.y, colorWheelRadius, colorWheelPinRadius, colorWheelColors, function (color) { return _this.onColorChanged(color); });
            this.ui.add(this.game.add.existing(colorJoystick));
            // Score-board
            this.score = this.ui.add(this.game.add.existing(new score_1.default(this.game)));
            // Player
            var player = new player_1.default(this, settings_1.Const.Platform.StartX + 15, 50);
            this.player = this.obj.add(this.game.add.existing(player));
            // CAMERA
            this.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON);
            // PLATFORMS
            this.platformGroup = this.obj.add(this.add.group());
            this.platformGroup.enableBody = true;
            this.platformGroup.physicsBodyType = Phaser.Physics.ARCADE;
            this.gameLogic.initGame();
            this.game.time.events.add(Phaser.Timer.SECOND, function () {
                _this.player.walk();
                _this.started = true;
            }, this);
            this.currSpeed = settings_1.Const.Speed.Start;
        };
        GameState.prototype.update = function () {
            if (this.started) {
                this.checkBounds();
            }
            this.gameLogic.update(this.game, this.platformGroup);
        };
        GameState.prototype.onColorChanged = function (newColor) {
            this.player.setColor(newColor);
        };
        GameState.prototype.checkBounds = function () {
            var playerBottom = this.player.position.y;
            var worldBottom = this.game.world.height;
            if (playerBottom > worldBottom) {
                this.restart();
            }
        };
        GameState.prototype.restart = function () {
            this.game.state.start('Game', true, false, this.gameLogic);
        };
        GameState.prototype.render = function () {
            //this.game.debug.bodyInfo(this.player.collider, 32, 32);
            //this.game.debug.body(this.player);
            //this.game.debug.body(this.player.collider);
        };
        return GameState;
    }(Phaser.State));
    exports.default = GameState;
});
// font example
// this.fontMessage = { font: "24px Arial", fill: "#e4beef",  align: "center", stroke: "#320C3E", strokeThickness: 4 };
//this.totalTimeText = this.game.add.text(120, 30, "Total time: "+this.totalTimer, this.fontMessage);
//# sourceMappingURL=game-state.js.map