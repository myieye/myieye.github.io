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
define(["require", "exports", "phaser-ce", "../helpers/math-helper", "../helpers/const"], function (require, exports, phaser_ce_1, math_helper_1, const_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ColorJoystick = /** @class */ (function (_super) {
        __extends(ColorJoystick, _super);
        function ColorJoystick(game, onColorChanged) {
            var _this = _super.call(this, game) || this;
            _this.onColorChanged = onColorChanged;
            _this.fixedToCamera = true;
            _this.visible = false;
            _this.wheel = _this.add(game.add.group());
            // BORDER
            var border = _this.border = _this.wheel.add(game.add.graphics());
            border.lineStyle(8, const_1.Const.Joystick.DefaultBorderColor);
            border.arc(0, 0, const_1.Const.Joystick.Diameter / 2, -0.5, phaser_ce_1.Math.PI2, false);
            border.alpha = 0.8;
            // COLOR PIE ----------------------------------------------
            _this.colorPie = _this.wheel.add(game.add.graphics());
            _this.colorPie.alpha = 0.8;
            // PIN ---------------------------------
            var pin = _this.pin = _this.add(game.add.sprite(0, 0, const_1.Const.Images.Joystick.name));
            pin.anchor.set(0.5, 0.5);
            // DRAGGER ------------------------------
            var dragger = _this.dragger = _this.add(game.add.sprite(0, 0));
            dragger.anchor.set(0.5, 0.5);
            dragger.width = dragger.height = pin.width;
            dragger.inputEnabled = true;
            dragger.input.enableDrag(true);
            dragger.events.onDragStart.add(function (sprite, pointer) {
                return _this.onDragStart(sprite, pointer);
            }, game);
            dragger.events.onDragStop.add(function (sprite, pointer) {
                return _this.onDragStop(sprite, pointer);
            }, game);
            dragger.events.onDragUpdate.add(function (dragger, pointer, dragX, dragY, snapPoint) {
                return _this.dragUpdate(dragger, pointer, dragX, dragY, snapPoint);
            }, game);
            _this.resize();
            return _this;
        }
        Object.defineProperty(ColorJoystick.prototype, "enabled", {
            set: function (enabled) { this.dragger.inputEnabled = enabled; },
            enumerable: true,
            configurable: true
        });
        ColorJoystick.prototype.setColors = function (colors) {
            this.colors = [];
            var sliceAngleRads = phaser_ce_1.Math.PI2 / colors.length;
            this.colorPie.clear();
            this.colorPie.lineStyle(0);
            this.visible = true;
            // Create the pie slices
            for (var i = 0; i < colors.length; i++) {
                this.colorPie.beginFill(colors[i]);
                var startAngle = phaser_ce_1.Math.PI2 - (i * sliceAngleRads);
                var endAngle = startAngle - sliceAngleRads;
                startAngle += colors.length < 3 ? 0.09 : 0.055; // Necessarry, because counterclockwise?
                //  True draws anticlockwise
                this.colorPie.arc(0, 0, const_1.Const.Joystick.Diameter / 2, startAngle, endAngle, true);
                this.colorPie.endFill();
                this.colors[i] = {
                    color: colors[i],
                    angle: endAngle
                };
            }
        };
        ColorJoystick.prototype.update = function () {
            this.resize();
        };
        ColorJoystick.prototype.resize = function () {
            var size = Math.min(phaser_ce_1.Math.clamp(this.wheel.width, const_1.Const.Joystick.MinDiameter, const_1.Const.Joystick.MaxDiameter), this.game.height / 2, this.game.width / 4);
            this.wheel.width = this.wheel.height = size;
            this.pin.width = this.pin.height = size * const_1.Const.Joystick.PinDiameterPercent;
            var xOffset = this.colorPie.getBounds().halfWidth + Math.min(const_1.Const.Joystick.Padding, this.game.width / 20);
            var yOffset = (this.colorPie.getBounds().halfWidth + Math.min(const_1.Const.Joystick.Padding, this.game.height / 20));
            this.cameraOffset.setTo((this.game.camera.x + this.game.camera.width) - xOffset, (this.game.camera.y + this.game.camera.height) - yOffset);
        };
        ColorJoystick.prototype.onDragStart = function (sprite, pointer) {
        };
        ColorJoystick.prototype.onDragStop = function (sprite, pointer) {
            // Move dragger to pin
            this.dragger.x = this.pin.x;
            this.dragger.y = this.pin.y;
            // Tween dragger and pin to the start position
            this.game.add.tween(this.pin).to({ x: 0, y: 0 }, 20, null, true);
            this.game.add.tween(this.dragger).to({ x: 0, y: 0 }, 20, null, true);
        };
        ColorJoystick.prototype.dragUpdate = function (dragger, pointer, dragX, dragY, snapPoint) {
            // Move pin
            if (this.draggerOutsideOfRadius()) {
                this.movePinToRadius();
            }
            else { // move pin to dragger
                this.movePinToDragger();
            }
            // Check for color change
            var angle = this.getCurrAngle();
            var selectedColor = this.getColorForAngle(angle);
            if (selectedColor !== this.currColor) {
                this.currColor = selectedColor;
                this.border.tint = this.currColor;
                this.onColorChanged(this.currColor);
            }
        };
        ColorJoystick.prototype.draggerOutsideOfRadius = function () {
            var zeroBasedX = math_helper_1.default.getRelativeX(this.colorPie.x, this.dragger.x);
            var zeroBasedY = math_helper_1.default.getRelativeY(this.colorPie.y, this.dragger.y);
            var h = Math.sqrt(Math.pow(zeroBasedX, 2) + Math.pow(zeroBasedY, 2));
            return h > this.radius;
        };
        ColorJoystick.prototype.movePinToRadius = function () {
            var normalVector = math_helper_1.default
                .getRelativePoint(this.dragger.position, this.colorPie.position)
                .normalize();
            this.pin.x = normalVector.x * this.radius;
            this.pin.y = normalVector.y * this.radius;
        };
        ColorJoystick.prototype.movePinToDragger = function () {
            this.pin.x = this.dragger.x;
            this.pin.y = this.dragger.y;
        };
        ColorJoystick.prototype.getCurrAngle = function () {
            // nagative on top
            var angle = phaser_ce_1.Math.angleBetween(0, 0, this.pin.x, this.pin.y);
            // Convert to 360 degrees
            if (angle < 0)
                angle = Math.PI + (Math.PI + angle);
            return angle;
        };
        ColorJoystick.prototype.getColorForAngle = function (angle) {
            for (var i = 0; i < this.colors.length; i++) {
                if (angle > this.colors[i].angle) {
                    return this.colors[i].color;
                }
            }
        };
        ColorJoystick.prototype.onPhaseComplete = function () {
            this.currColor = const_1.Const.Color.DefaultPlayerTint;
            this.border.tint = const_1.Const.Joystick.DefaultBorderColor;
        };
        Object.defineProperty(ColorJoystick.prototype, "radius", {
            get: function () {
                return this.colorPie.getBounds().halfWidth;
            },
            enumerable: true,
            configurable: true
        });
        return ColorJoystick;
    }(phaser_ce_1.Group));
    exports.default = ColorJoystick;
});
//# sourceMappingURL=color-joystick.js.map