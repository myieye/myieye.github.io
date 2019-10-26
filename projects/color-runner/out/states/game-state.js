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
define(["require", "exports", "phaser-ce", "../game-logic", "../sprites/player", "../sprites/color-joystick", "../helpers/const", "../sprites/score-keeper", "../sprites/popup", "../sprites/pause-button"], function (require, exports, phaser_ce_1, game_logic_1, player_1, color_joystick_1, const_1, score_keeper_1, popup_1, pause_button_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GameState = /** @class */ (function (_super) {
        __extends(GameState, _super);
        function GameState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GameState.prototype.init = function () {
            this.firstUpdate = true;
            this.gameStarted = false;
            this.gameLogic = new game_logic_1.default(this);
            this.MinWidth = const_1.Const.Player.StartX + const_1.Const.Player.Size.Width +
                this.gameLogic.loadBuffer + this.gameLogic.loadSpace + const_1.Const.Platform.Animation.LockDist;
            this.MinHeight = const_1.Const.Score.Height + const_1.Const.Player.Size.Height + const_1.Const.Player.StartVerticalPadding * 2 +
                const_1.Const.Platform.Size.Height * (const_1.Const.Game.Life + 1);
            this.bg = this.add.sprite(0, 0, 'game-bg');
            this.bg.anchor.setTo(.5, .5);
            //this.game.scale.startFullScreen(false);
            //this.bg.fixedToCamera = true;
        };
        GameState.prototype.create = function () {
            var _this = this;
            // SETUP WORLD ------------------------------------------------
            this.physics.startSystem(phaser_ce_1.Physics.ARCADE);
            this.physics.arcade.gravity.y = 200;
            this.obj = this.game.add.group(undefined, "objects");
            this.ui = this.game.add.group(undefined, "controls");
            this.platformGroup = this.obj.add(this.add.group());
            // Color-Joystick
            var colorJoystick = new color_joystick_1.default(this.game, function (color) { return _this.onColorChanged(color); });
            this.joystick = this.ui.add(this.game.add.existing(colorJoystick));
            this.joystick.setColors(const_1.Const.Color.StartColors);
            // Score-board
            this.score = this.ui.add(this.game.add.existing(new score_keeper_1.default(this.game)));
            // Pause button
            this.pause = this.ui.add(this.game.add.existing(new pause_button_1.default(this.game)));
            // Player
            var player = new player_1.default(this, const_1.Const.Player.StartX, -20); // -Const.Player.Size.Height * 3.5);
            this.player = this.obj.add(this.game.add.existing(player));
            // Shouter
            var shouter = this.shouter = this.game.add.text(this.world.centerX, this.world.centerY, "", {
                font: "bold 10em tricolor-bw", fill: "#fff",
                stroke: "#000", strokeThickness: 15,
                boundsAlignH: "right", boundsAlignV: "middle",
            });
            shouter.anchor.setTo(0.5);
            // CAMERA
            this.camera.follow(this.player, phaser_ce_1.Camera.FOLLOW_LOCKON);
            // PLATFORMS
            this.platformGroup.x = const_1.Const.Platform.StartX;
            this.platformGroup.y = this.game.height - const_1.Const.Platform.NegativeStartY;
            this.platformGroup.enableBody = true;
            this.platformGroup.physicsBodyType = phaser_ce_1.Physics.ARCADE;
            this.popup = this.game.add.existing(new popup_1.default(this.game));
            this.gameLogic.initGame();
            this.resize(); // This is necessary when restarting the state
            this.player.flyDown();
            this.input.keyboard.onDownCallback = function (e) {
                if (e.which == Phaser.KeyCode.SPACEBAR) {
                    _this.game.paused = !_this.game.paused;
                }
            };
            this.state.onPausedCallback = function () {
                _this.joystick.enabled = false;
                _this.pause.visible = false;
                _this.popup.visible = true;
            };
            this.state.onResumedCallback = function () {
                _this.joystick.enabled = true;
                _this.pause.visible = true;
                _this.popup.visible = false;
            };
        };
        GameState.prototype.update = function () {
            var _this = this;
            if (this.firstUpdate) {
                this.resize();
                this.firstUpdate = false;
            }
            else if (!this.gameStarted && this.player.speed > 0) {
                this.gameStarted = true;
                this.game.time.events.add(phaser_ce_1.Timer.SECOND, function () { return _this.gameLogic.startGame(); });
            }
            this.gameLogic.update();
        };
        GameState.prototype.onColorChanged = function (newColor) {
            this.player.setColor(newColor);
        };
        GameState.prototype.restart = function () {
            this.gameStarted = false;
            this.game.state.start('Game', true, false, this.gameLogic);
        };
        GameState.prototype.render = function () {
            //this.game.debug.spriteBounds(this.gameLogic.p.platform);
            //this.game.debug.pixel(this.player.getBounds().right, 70, "#FF0000", 10);
            //this.game.debug.pixel(this.player.getBounds().right + this.gameLogic.loadBuffer, 70, "#00FF00", 10);
            //this.game.debug.pixel(this.platformGroup.toGlobal(this.gameLogic.lastPlatform.target).x, 70, "#0000FF", 10);
            //this.game.debug.pixel(this.platformGroup.toGlobal(this.gameLogic.lastPlatform.target).x + this.gameLogic.platformWidth, 70, "#0000FF", 10);
            //this.game.debug.bodyInfo(this.player.collider, 32, 32);
            //this.game.debug.body(this.player);
            //this.game.debug.body(this.player.collider);
            //this.game.debug.spriteBounds(this.player);
            /*for (var p of this.player.currPlatforms) {
                this.game.debug.body(p);
            }*/
        };
        GameState.prototype.setGravity = function (body, gravity) {
            body.gravity.y = -this.physics.arcade.gravity.y + gravity;
        };
        GameState.prototype.resize = function (width, height) {
            //alert(this.joystick.getBounds().width);
            var scale = Math.min(this.game.height / this.MinHeight, this.game.width / this.MinWidth);
            this.obj.scale.setTo(scale);
            this.gameLogic.resize(!(width && height));
            this.shouter.position.setTo(this.world.centerX, this.world.centerY);
            this.shouter.fontSize = this.game.height / 4;
            this.game.scale.scaleSprite(this.bg).alignIn(this.camera.view, Phaser.CENTER);
            this.popup.resize();
            this.game.scale.scaleSprite(this.pause, 30, 30);
            this.pause.position.setTo(this.game.width - this.pause.width * 1.5, this.score.height + this.pause.height * .1);
            //alert("--" + window.devicePixelRatio + ":" + this.joystick.getBounds().width + ":" + this.joystick.worldScale.x);
        };
        return GameState;
    }(phaser_ce_1.State));
    exports.default = GameState;
});
// font example
// this.fontMessage = { font: "24px Arial", fill: "#e4beef",  align: "center", stroke: "#320C3E", strokeThickness: 4 };
//this.totalTimeText = this.game.add.text(120, 30, "Total time: "+this.totalTimer, this.fontMessage);
//# sourceMappingURL=game-state.js.map