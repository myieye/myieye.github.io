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
define(["require", "exports", "phaser-ce", "./button", "../helpers/const"], function (require, exports, phaser_ce_1, button_1, const_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ButtonGroup = /** @class */ (function (_super) {
        __extends(ButtonGroup, _super);
        function ButtonGroup(game) {
            var _this = _super.call(this, game) || this;
            _this.add(game.add.existing(new button_1.default(game, 600, 400, const_1.Const.Color.StartColors[2], const_1.Const.Images.FlyIcon.name)));
            _this.add(game.add.existing(new button_1.default(game, 800, 800, const_1.Const.Color.StartColors[1], const_1.Const.Images.SnowflakeIcon.name)));
            _this.add(game.add.existing(new button_1.default(game, 400, 800, const_1.Const.Color.StartColors[0], const_1.Const.Images.StarIcon.name)));
            return _this;
        }
        return ButtonGroup;
    }(phaser_ce_1.Group));
    exports.default = ButtonGroup;
});
//# sourceMappingURL=button-group.js.map