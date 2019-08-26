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
define(["require", "exports", "phaser-ce", "../helpers/math-helper"], function (require, exports, phaser_ce_1, math_helper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ColorJoystick = /** @class */ (function (_super) {
        __extends(ColorJoystick, _super);
        function ColorJoystick(game, x, y, radius, pinRadius, colors, onColorChanged) {
            var _this = _super.call(this, game, x, y) || this;
            // Save settings
            var pos = _this.pos = new phaser_ce_1.Point(x, y);
            _this.radius = radius;
            _this.onColorChanged = onColorChanged;
            _this.currColor = colors[0];
            _this.colors = [];
            // BORDER
            var border = _this.border = game.add.graphics();
            border.lineStyle(10, 0xFFFFFF);
            border.arc(0, 0, radius, -0.5, phaser_ce_1.Math.PI2, false);
            // Position Relative to camera
            border.fixedToCamera = true;
            border.cameraOffset.setTo(pos.x, pos.y);
            // COLOR PIE ----------------------------------------------
            var colorPie = _this.colorPie = game.add.graphics();
            var sliceAngleRads = phaser_ce_1.Math.PI2 / colors.length;
            //  Reset lineStyle
            colorPie.lineStyle(0);
            // Create the pie slices
            for (var i = 0; i < colors.length; i++) {
                colorPie.beginFill(colors[i]);
                var startAngle = phaser_ce_1.Math.PI2 - (i * sliceAngleRads);
                var endAngle = startAngle - sliceAngleRads;
                startAngle += 0.06; // Necessarry, because counterclockwise
                //  True draws anticlockwise
                colorPie.arc(0, 0, radius, startAngle, endAngle, true);
                colorPie.endFill();
                _this.colors[i] = {
                    color: colors[i],
                    angle: endAngle
                };
            }
            // Position Relative to camera
            colorPie.fixedToCamera = true;
            colorPie.cameraOffset.setTo(pos.x, pos.y);
            // PIN ---------------------------------
            var pin = _this.pin = game.add.sprite(pos.x, pos.y, "joystick");
            pin.anchor.set(0.5, 0.5);
            pin.width = pin.height = pinRadius * 2;
            pin.fixedToCamera = true;
            // DRAGGER ------------------------------
            var dragger = _this.dragger = game.add.sprite(pos.x, pos.y, null);
            dragger.anchor.set(0.5, 0.5);
            dragger.width = dragger.height = pin.width;
            dragger.fixedToCamera = true;
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
            return _this;
        }
        ColorJoystick.prototype.onDragStart = function (sprite, pointer) {
        };
        ColorJoystick.prototype.onDragStop = function (sprite, pointer) {
            // Move dragger to pin
            this.dragger.cameraOffset.x = this.pin.cameraOffset.x;
            this.dragger.cameraOffset.y = this.pin.cameraOffset.y;
            // Tween dragger and pin to the start position
            this.game.add.tween(this.pin.cameraOffset).to(this.pos, 20, null, true);
            this.game.add.tween(this.dragger.cameraOffset).to(this.pos, 20, null, true);
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
            var zeroBasedX = math_helper_1.default.getZeroBasedX(this.colorPie.x, this.dragger.x);
            var zeroBasedY = math_helper_1.default.getZeroBasedY(this.colorPie.y, this.dragger.y);
            var h = Math.sqrt(Math.pow(zeroBasedX, 2) + Math.pow(zeroBasedY, 2));
            return h > this.radius;
        };
        ColorJoystick.prototype.movePinToRadius = function () {
            var zeroBasedX = math_helper_1.default.getZeroBasedX(this.colorPie.cameraOffset.x, this.dragger.cameraOffset.x);
            var zeroBasedY = math_helper_1.default.getZeroBasedY(this.colorPie.cameraOffset.y, this.dragger.cameraOffset.y);
            var normalVector = math_helper_1.default.getNormalizedVector({ x: zeroBasedX, y: zeroBasedY });
            var zeroBasedVectorOnRadius = {
                x: normalVector.x * this.radius,
                y: normalVector.y * this.radius
            };
            var relativeVector = math_helper_1.default.getRelativeVector(zeroBasedVectorOnRadius, this.pos);
            this.pin.cameraOffset.x = relativeVector.x;
            this.pin.cameraOffset.y = relativeVector.y;
        };
        ColorJoystick.prototype.movePinToDragger = function () {
            this.pin.cameraOffset.x = this.dragger.cameraOffset.x;
            this.pin.cameraOffset.y = this.dragger.cameraOffset.y;
        };
        ColorJoystick.prototype.getCurrAngle = function () {
            // nagative on top
            var angle = phaser_ce_1.Math.angleBetweenPoints(this.pos, this.pin.cameraOffset);
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
        return ColorJoystick;
    }(phaser_ce_1.Sprite));
    exports.default = ColorJoystick;
});
//# sourceMappingURL=color-joystick.js.map