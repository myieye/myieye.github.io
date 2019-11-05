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
        function Button(game, x, y, color, image) {
            var _this = _super.call(this, game) || this;
            _this.inputEnableChildren = true;
            _this.bg = _this.add(game.add.sprite(x, y, const_1.Const.Images.Button.name));
            _this.bg.tint = color;
            _this.image = _this.add(game.add.sprite(x, y, image));
            _this.image.tint = 0x333333;
            game.scale.scaleSprite(_this, 60, 60, true);
            game.scale.scaleSprite(_this.image, _this.bg.width * .5, _this.bg.height * .5, true);
            _this.image.alignIn(_this.bg, Phaser.CENTER);
            _this.onChildInputOver.add(function () {
                _this.bg.loadTexture(const_1.Const.Images.ButtonPressed.name);
                _this.bg.alpha = .8;
            });
            _this.onChildInputOut.add(function () {
                _this.bg.loadTexture(const_1.Const.Images.Button.name);
                _this.bg.alpha = 1;
            });
            return _this;
        }
        return Button;
    }(phaser_ce_1.Group));
    exports.default = Button;
});
//# sourceMappingURL=button.js.map