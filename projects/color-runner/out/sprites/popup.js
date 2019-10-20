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
define(["require", "exports", "phaser-ce", "./menu", "./menu-item", "../helpers/const"], function (require, exports, phaser_ce_1, menu_1, menu_item_1, const_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Popup = /** @class */ (function (_super) {
        __extends(Popup, _super);
        function Popup(game) {
            var _this = _super.call(this, game) || this;
            _this.visible = false;
            _this.background = _this.add(game.add.graphics());
            _this.background
                .beginFill(phaser_ce_1.Color.BLACK, .6)
                .drawRect(0, 0, game.width, game.height);
            _this.add(_this.game.add.existing(new menu_1.default(game, .4, .2, new menu_item_1.default(game, "Main Menu", function () {
                game.paused = false;
                game.state.start(const_1.Const.States.MainMenu);
            }), new menu_item_1.default(game, "Resume", function () {
                game.paused = false;
            }))));
            _this.resize();
            return _this;
        }
        Popup.prototype.resize = function () {
            this.game.scale.scaleSprite(this.background);
        };
        return Popup;
    }(phaser_ce_1.Group));
    exports.default = Popup;
});
//# sourceMappingURL=popup.js.map