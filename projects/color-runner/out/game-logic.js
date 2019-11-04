define(["require", "exports", "phaser-ce", "./sprites/platform", "./helpers/const", "./helpers/sound-helper", "./helpers/color-exploder"], function (require, exports, phaser_ce_1, platform_1, const_1, sound_helper_1, color_exploder_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PhaseState;
    (function (PhaseState) {
        PhaseState[PhaseState["Unstarted"] = 0] = "Unstarted";
        PhaseState[PhaseState["Play"] = 1] = "Play";
        PhaseState[PhaseState["Transition"] = 2] = "Transition";
        PhaseState[PhaseState["Lost"] = 3] = "Lost";
    })(PhaseState = exports.PhaseState || (exports.PhaseState = {}));
    var GameLogic = /** @class */ (function () {
        function GameLogic(gameState) {
            this.state = gameState;
            this.currLife = const_1.Const.Game.Life;
            this.phaseState = PhaseState.Unstarted;
        }
        GameLogic.prototype.initGame = function () {
            this.game = this.state.game;
            this.platformGroup = this.state.platformGroup;
            this.platforms = [];
            this.soundHelper = sound_helper_1.default.Instance;
            this.currNegPlatformY = this.game.height - this.platformGroup.y;
            for (var _i = 0, _a = const_1.Const.Platform.StartPlatforms; _i < _a.length; _i++) {
                var tint = _a[_i];
                this.addPlatform(this.state.platformGroup, tint);
            }
            //this.testExplode();
            this.configureNextPhase();
        };
        GameLogic.prototype.startGame = function () {
            var _this = this;
            this.phaseState = PhaseState.Transition;
            this.game.time.events.add(phaser_ce_1.Timer.SECOND, function () {
                _this.startCurrentPhase();
            });
        };
        GameLogic.prototype.update = function () {
            var _this = this;
            if (this.currSpeed * this.state.player.speed) {
                if (this.playerOutOfBounds()) {
                    this.state.platformGroup.removeAll(true);
                    this.phaseState = PhaseState.Lost;
                    this.game.time.events.add(phaser_ce_1.Timer.SECOND * 2, function () { return _this.state.restart(); });
                }
                this.platformGroup.x -= this.currSpeed * this.state.player.speed;
                if (this.phaseState !== PhaseState.Lost && this.lastPlatform && this.needNewPlatform()) {
                    var tint = this.pickPlatformColor();
                    this.addPlatform(this.platformGroup, tint, true);
                }
            }
        };
        GameLogic.prototype.startCurrentPhase = function () {
            var _this = this;
            this.state.joystick.setColors(this.colors);
            this.state.score.init(this.colors, this.currPhase.target);
            this.state.shouter.text = "Phase " + this.currPhaseNum;
            this.game.time.events.add(phaser_ce_1.Timer.SECOND * 3, function () {
                _this.state.shouter.text = "";
                _this.phaseState = PhaseState.Play;
            });
        };
        GameLogic.prototype.configureNextPhase = function () {
            this.phaseState = PhaseState.Transition;
            this.currPhaseNum = (this.currPhaseNum || 0) + 1;
            this.colors = const_1.Const.Color.StartColors.slice()
                .concat(const_1.Const.Color.FutureColors.slice(0, Math.floor((this.currPhaseNum - 1) / 1)));
            var nextPhase = const_1.Const.Phase.Phases[this.currPhaseNum - 1];
            if (nextPhase) {
                this.currPhase = nextPhase;
            }
            else {
                this.currPhase = {
                    speed: {
                        start: this.currPhase.speed.start * 1.05,
                        increment: this.currPhase.speed.increment * 1,
                        increaseInterval: this.currPhase.speed.increaseInterval
                    },
                    target: Math.ceil(this.currPhase.target * 1.1)
                };
            }
            this.currSpeed = this.currPhase.speed.start;
        };
        GameLogic.prototype.addPlatform = function (platformGroup, tint, animate) {
            if (animate === void 0) { animate = false; }
            var newPlatformX = this.lastPlatform
                ? this.lastPlatform.target.x + this.lastPlatform.width - this.lastPlatform.width * const_1.Const.Platform.Size.LockSizePerc
                : 0;
            var prevPlatformNumber = (this.lastPlatform && this.lastPlatform.number) || 0;
            var platform = platformGroup.add(this.game.add.existing(new platform_1.default(this.game, newPlatformX, platformGroup, prevPlatformNumber + 1, tint, animate)));
            this.lastPlatform = platform;
            this.platforms.push(platform.platform);
        };
        GameLogic.prototype.pickPlatformColor = function () {
            if (this.phaseState !== PhaseState.Play) {
                return const_1.Const.Color.DefaultPlatformTint;
            }
            else if (this.lastPlatform.tint != const_1.Const.Color.DefaultPlatformTint) {
                return this.game.rnd.pick(this.colors);
            }
            else {
                return this.game.rnd.pick(this.colors.filter(function (color) { return color != const_1.Const.Color.DefaultPlatformTint; }));
            }
        };
        GameLogic.prototype.resize = function (forcedResize) {
            this.platformGroup.y = this.game.height / this.state.obj.scale.y - this.currLife * platform_1.default.height;
            if (!forcedResize) {
                this.state.player.y = this.platformGroup.y - this.state.player.height;
            }
        };
        GameLogic.prototype.onPlatformMissed = function (platform) {
            return;
            this.onPlatformComplete(platform);
            this.currLife--;
            platform.parent.y += const_1.Const.Platform.Size.Height;
            this.state.player.y += const_1.Const.Platform.Size.Height;
            platform.onMissed();
        };
        GameLogic.prototype.onPlatformMatched = function (platform) {
            var color = platform.tint;
            platform.onMatched();
            this.onPlatformComplete(platform);
            this.soundHelper.onPlatformMatched();
            if (this.state.score.increment(color)) {
                if (this.onColorComplete(color) && this.allPlatformsComplete()) {
                    this.onPhaseComplete();
                }
            }
        };
        GameLogic.prototype.onPhaseComplete = function () {
            var _this = this;
            this.state.shouter.text = this.game.rnd.pick(["Nice!", "Woohoo!", "Solid!", "Incredible!", "Great!"]);
            this.state.player.onPhaseComplete();
            this.state.joystick.onPhaseComplete();
            this.game.time.events.add(phaser_ce_1.Timer.SECOND * 2, function () {
                _this.state.score.resetColors();
                _this.configureNextPhase();
                _this.startCurrentPhase();
            });
        };
        GameLogic.prototype.needNewPlatform = function () {
            return this.state.player.getBounds().right + this.loadBuffer >
                this.platformGroup.toGlobal(this.lastPlatform.target).x;
        };
        GameLogic.prototype.playerOutOfBounds = function () {
            var playerBottom = this.state.player.getBounds().bottom;
            var worldBottom = this.game.world.height;
            return Math.ceil(playerBottom) >= worldBottom;
        };
        GameLogic.prototype.onPlatformComplete = function (platform) {
            if (platform.number % this.currPhase.speed.increaseInterval == 0) {
                this.currSpeed = phaser_ce_1.Math.clamp(this.currSpeed + this.currPhase.speed.increment, 0, const_1.Const.Speed.Max);
                this.state.player.onChangeSpeed(this.currSpeed);
            }
        };
        GameLogic.prototype.onColorComplete = function (color) {
            for (var i in this.colors) {
                if (this.colors[i] === color) {
                    this.colors[i] = const_1.Const.Color.DefaultPlatformTint;
                }
            }
            return this.colors.reduce(function (others, curr) { return others && curr === const_1.Const.Color.DefaultPlatformTint; }, true);
        };
        GameLogic.prototype.allPlatformsComplete = function () {
            return this.platformGroup.children.reduce(function (others, curr) {
                return others && (curr.missed || curr.matched || curr.tint == const_1.Const.Color.DefaultPlatformTint);
            }, true);
        };
        Object.defineProperty(GameLogic.prototype, "hasLost", {
            get: function () {
                return this.phaseState === PhaseState.Lost;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameLogic.prototype, "loadBuffer", {
            get: function () {
                return platform_1.default.width * const_1.Const.Platform.Foresight - this.loadSpace;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameLogic.prototype, "loadSpace", {
            get: function () {
                return platform_1.default.width * 2;
            },
            enumerable: true,
            configurable: true
        });
        GameLogic.prototype.testExplode = function () {
            var _this = this;
            var p = this.p = new platform_1.default(this.game, 100);
            p.y = 100;
            p.scale.setTo(2);
            p.platform.tint = const_1.Const.Color.StartColors[0];
            //this.game.time.events.add(1000, () => ColorExploder.Instance(this.game).explode(p.platform, p.tint));
            this.game.time.events.repeat(1500, 1000, function () {
                color_exploder_1.default.Instance(_this.game).explode(p.platform, p.tint);
            });
        };
        return GameLogic;
    }());
    exports.default = GameLogic;
});
//# sourceMappingURL=game-logic.js.map