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
            //this.alpha = 0.9;
            _this.add(game.add.existing(button_1.default.Fly(game, 200, 0)));
            _this.add(game.add.existing(button_1.default.Freeze(game, 400, 400)));
            _this.add(game.add.existing(button_1.default.Rainbow(game, 0, 400)));
            return _this;
        }
        ButtonGroup.prototype.update = function () {
            var maxHeight = Math.min(this.game.height / 5, const_1.Const.PowerButton.GroupSize.MaxSize);
            var maxWidth = Math.min(this.game.width / 5, const_1.Const.PowerButton.GroupSize.MaxSize);
            this.game.scale.scaleSprite(this, maxWidth, maxHeight);
            var padding = Math.min(this.game.height / 12, 25);
            this.alignIn(this.game.camera.bounds, Phaser.BOTTOM_LEFT, -padding, -padding);
        };
        return ButtonGroup;
    }(phaser_ce_1.Group));
    exports.default = ButtonGroup;
});
//# sourceMappingURL=button-group.js.map