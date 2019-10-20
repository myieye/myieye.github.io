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
    var Menu = /** @class */ (function (_super) {
        __extends(Menu, _super);
        function Menu(game, startPer, sizePer) {
            var menuItems = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                menuItems[_i - 3] = arguments[_i];
            }
            var _this = _super.call(this, game) || this;
            _this.startPer = startPer;
            _this.sizePer = sizePer;
            _this.addMultiple(menuItems);
            _this.resize();
            var itemX = menuItems[0];
            var spacePerItem = ((_this.game.height * sizePer) - itemX.height) / menuItems.length;
            spacePerItem = Math.max(Math.min(itemX.height * 2, spacePerItem), itemX.height * 1.5);
            var startY = itemX.height / 2;
            menuItems.forEach(function (item, i) {
                item.setColor(const_1.Const.Color.StartColors[i]);
                item.y = startY + i * spacePerItem;
            });
            _this.resize();
            return _this;
        }
        Menu.prototype.resize = function () {
            this.game.scale.scaleSprite(this, this.game.width * .5, this.game.height * this.sizePer, true);
            this.position.setTo(this.game.world.centerX, this.game.height * this.startPer);
        };
        return Menu;
    }(phaser_ce_1.Group));
    exports.default = Menu;
});
//# sourceMappingURL=menu.js.map