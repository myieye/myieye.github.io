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
    var MenuItem = /** @class */ (function (_super) {
        __extends(MenuItem, _super);
        function MenuItem(game, text, callback) {
            var _this = _super.call(this, game) || this;
            _this.inputEnableChildren = true;
            _this.onChildInputOver.add(_this.onInputOver, _this);
            _this.onChildInputOut.add(_this.onInputOut, _this);
            if (callback)
                _this.onChildInputDown.add(callback);
            _this.platform = _this.add(game.add.sprite(0, 0, const_1.Const.Images.Platform.name));
            _this.platform.anchor.setTo(.5);
            _this.platform.smoothed = false;
            _this.game.scale.scaleSprite(_this.platform, _this.game.width * .3, _this.game.height * .4, true);
            _this.text = _this.add(game.add.text(0, 0, text, {
                font: "tricolor-bw", fontSize: _this.platform.height, fill: "#000"
            }));
            _this.text.anchor.setTo(.5);
            return _this;
        }
        MenuItem.prototype.setColor = function (tint) {
            this.color = this.platform.tint = tint;
        };
        MenuItem.prototype.onInputOver = function () {
            this.platform.tint = const_1.Const.Color.DefaultPlatformTint;
            this.text.addColor("#FFFFFF", 0);
        };
        MenuItem.prototype.onInputOut = function () {
            this.platform.tint = this.color;
            this.text.addColor("#000000", 0);
        };
        return MenuItem;
    }(phaser_ce_1.Group));
    exports.default = MenuItem;
});
//# sourceMappingURL=menu-item.js.map