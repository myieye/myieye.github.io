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
    var Player = /** @class */ (function (_super) {
        __extends(Player, _super);
        function Player(gameState, x, y) {
            var _this = _super.call(this, gameState.game, x, y, "player", "fly/000") || this;
            _this.numColorSteps = 20;
            _this.currPlatforms = [];
            _this.game = gameState.game;
            _this.gameState = gameState;
            _this.game.physics.enable(_this, phaser_ce_1.Physics.ARCADE);
            _this.scale.setTo(0.4, 0.4);
            _this.animations.add('run', phaser_ce_1.Animation.generateFrameNames('run/', 0, 14, '', 3), 20, true, false);
            _this.animations.add('fly', phaser_ce_1.Animation.generateFrameNames('fly/', 0, 14, '', 3), 20, true, false);
            _this.animations.add('stand', phaser_ce_1.Animation.generateFrameNames('stand/', 0, 14, '', 3), 20, true, false);
            _this.animations.add('jump', phaser_ce_1.Animation.generateFrameNames('jump/', 0, 9, '', 3), 10, false, false);
            _this.tint = phaser_ce_1.Color.WHITE;
            var collider = _this.collider = gameState.obj.add(_this.game.add.sprite());
            _this.game.physics.enable(collider, phaser_ce_1.Physics.ARCADE);
            collider.body.allowGravity = false;
            collider.scale.setTo(0.4, 0.4);
            collider.body.syncBounds = true;
            return _this;
        }
        Object.defineProperty(Player.prototype, "speed", {
            get: function () {
                if (this.is("run")) {
                    return 1;
                }
                else if (this.is("jump")) {
                    return this.currFrame < 2 ? .5
                        : this.currFrame < 3 ? .75
                            : this.currFrame < 7 ? 2.5
                                : this.currFrame < 8 ? 1.8
                                    : this.currFrame < 9 ? 1.5
                                        : 1.2;
                }
                else {
                    return 0;
                }
            },
            enumerable: true,
            configurable: true
        });
        Player.prototype.update = function () {
            if (this.gameState.gameLogic.hasLost)
                return;
            if (this.targetTint) {
                this.currColorStep += this.gameState.gameLogic.currSpeed / 1.5;
                if (this.currColorStep >= this.numColorSteps) {
                    this.tint = this.targetTint;
                }
                else {
                    // This is nonsense, but the phaser code seems to have
                    // bugs. E.g. in its bit shifting (js can't handle 0xFF000000 << 24)
                    // That's the reason why we need to pass a low value as alpha?
                    this.tint = Phaser.Color.interpolateColor(this.tint, this.targetTint, this.numColorSteps, const_1.Const.Color.ChangeSpeed / this.numColorSteps, 0);
                }
            }
            var onPlatforms = this.game.physics.arcade.collide(this, this.gameState.gameLogic.platforms);
            this.checkForMissedPlatform();
            this.currPlatforms = [];
            this.game.physics.arcade.overlap(this.collider, this.gameState.gameLogic.platforms, this.onPlatformCollision, null, this);
            if (this.is("stand") && onPlatforms) {
                this.run();
            }
            this.syncBody();
            if (this.is("fly")) {
                this.body.velocity.y = this.gameState.platformGroup.y - this.bottom + 20;
            }
            else if (this.is("jump", 3)) {
                this.body.velocity.y = -50;
            }
        };
        Player.prototype.onChangeSpeed = function (newSpeed) {
            if (this.is("run")) {
                this.animations.currentAnim.speed = newSpeed * 7;
            }
        };
        Player.prototype.setColor = function (color) {
            this.currColorStep = 0;
            this.targetTint = color;
        };
        Player.prototype.getColor = function () {
            return this.tint;
        };
        Player.prototype.run = function () {
            this.animations.play("run");
            this.onChangeSpeed(this.gameState.gameLogic.currSpeed);
            this.animations.currentAnim.setFrame(12, true);
            this.body.allowGravity = true;
        };
        Player.prototype.flyUp = function () {
            this.animations.play("fly");
            this.body.allowGravity = false;
        };
        Player.prototype.flyDown = function () {
            this.animations.play("fly");
            this.body.allowGravity = false;
        };
        Player.prototype.stand = function () {
            this.animations.play("stand");
            this.body.allowGravity = true;
        };
        Player.prototype.jump = function () {
            var _this = this;
            this.play("jump");
            this.events.onAnimationComplete.addOnce(function () { return _this.run(); });
        };
        Player.prototype.onPhaseComplete = function () {
            var _this = this;
            this.game.time.events.add(phaser_ce_1.Timer.SECOND * 1, function () {
                _this.setColor(const_1.Const.Color.DefaultPlayerTint);
                _this.jump();
            });
        };
        Player.prototype.is = function (anim, frame) {
            return this.animations.currentAnim.name === anim &&
                (frame === undefined || frame === this.currFrame);
        };
        Player.prototype.onPlatformCollision = function (_, platform) {
            var platformGroup = platform.parent;
            if (platformGroup.number === 1)
                return;
            this.currPlatforms.push(platformGroup);
            if (this.is("fly")) {
                this.stand();
            }
            if (!platformGroup.matched && this.platformMatches(platform)) {
                this.gameState.gameLogic.onPlatformMatched(platformGroup);
            }
        };
        Player.prototype.platformMatches = function (platform) {
            return this.getColor() === platform.tint;
        };
        Player.prototype.checkForMissedPlatform = function () {
            for (var _i = 0, _a = this.currPlatforms; _i < _a.length; _i++) {
                var platform = _a[_i];
                var pPos = platform.getBounds();
                if (!platform.matched && !platform.missed &&
                    pPos.x + pPos.width <= this.collider.getBounds().x) {
                    this.gameState.gameLogic.onPlatformMissed(platform);
                }
            }
        };
        Player.prototype.syncBody = function () {
            var bounds = this.getBounds();
            var bodyPercent = .4;
            this.body.height = bounds.height - bounds.height * .12;
            this.body.width = bounds.width * bodyPercent;
            var bodyOffset = (bounds.width - this.body.width) / 2;
            this.body.offset.x = bodyOffset / this.scale.x;
            this.collider.width = this.width * bodyPercent;
            this.collider.y = this.y + this.height - 10;
            var colliderOffset = (this.width - this.collider.width) / 2;
            this.collider.x = this.x + colliderOffset;
        };
        Object.defineProperty(Player.prototype, "currFrame", {
            get: function () {
                return this.animations.currentAnim && Number(this.animations.frameName.split("/")[1]);
            },
            enumerable: true,
            configurable: true
        });
        return Player;
    }(phaser_ce_1.Sprite));
    exports.default = Player;
});
//# sourceMappingURL=player.js.map