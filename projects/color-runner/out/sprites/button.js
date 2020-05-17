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
    var Button = /** @class */ (function (_super) {
        __extends(Button, _super);
        function Button(game, x, y, up, down, icon) {
            var _this = _super.call(this, game) || this;
            _this.up = up;
            _this.down = down;
            _this.inputEnableChildren = true;
            _this.button = _this.add(game.add.sprite(x, y, up));
            _this.image = _this.add(game.add.sprite(x, y, icon));
            game.scale.scaleSprite(_this, 60, 60, true);
            _this.onChildInputDown.add(function () {
                _this.button.loadTexture(_this.down);
            });
            _this.onChildInputUp.add(function () {
                _this.button.loadTexture(_this.up);
            });
            _this.onChildInputOut.add(function () {
                _this.button.loadTexture(_this.up);
            });
            game.scale.scaleSprite(_this.image, _this.button.width * .5, _this.button.height * .5, true);
            _this.image.alignIn(_this.button, Phaser.CENTER);
            return _this;
        }
        Button.Fly = function (game, x, y) {
            var button = new Button(game, x, y, const_1.Const.Images.ButtonFly.name, const_1.Const.Images.ButtonFly_Pressed.name, const_1.Const.Images.FlyIcon.name);
            button.image.tint = 0x222222;
            return button;
        };
        Button.Freeze = function (game, x, y) {
            var button = new Button(game, x, y, const_1.Const.Images.ButtonFreeze.name, const_1.Const.Images.ButtonFreeze_Pressed.name, const_1.Const.Images.SnowflakeIcon.name);
            button.image.tint = 0xE4E4E4;
            return button;
        };
        Button.Rainbow = function (game, x, y) {
            var button = new Button(game, x, y, const_1.Const.Images.ButtonRainbow.name, const_1.Const.Images.ButtonRainbow_Pressed.name, const_1.Const.Images.StarIcon.name);
            button.image.tint = 0x222222;
            return button;
        };
        return Button;
    }(phaser_ce_1.Group));
    exports.default = Button;
});
//# sourceMappingURL=button.js.map