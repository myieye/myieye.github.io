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
define(["require", "exports", "phaser-ce"], function (require, exports, phaser_ce_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PauseButton = /** @class */ (function (_super) {
        __extends(PauseButton, _super);
        function PauseButton(game) {
            var _this = _super.call(this, game) || this;
            _this.inputEnableChildren = true;
            _this.onChildInputDown.add(function () { return _this.game.paused = true; });
            _this.button = _this.add(_this.game.add.graphics());
            _this.button
                // pause bars
                .beginFill(phaser_ce_1.Color.WHITE, .8)
                .drawRect(0, 0, PauseButton.BAR_WIDTH, PauseButton.HEIGHT)
                .drawRect(PauseButton.BAR_WIDTH + PauseButton.SPACE, 0, PauseButton.BAR_WIDTH, PauseButton.HEIGHT)
                // clickable background
                .beginFill(phaser_ce_1.Color.WHITE, 0)
                .drawRect(0, 0, _this.width, _this.height);
            return _this;
        }
        PauseButton.BAR_WIDTH = 6;
        PauseButton.HEIGHT = 18;
        PauseButton.SPACE = 6;
        return PauseButton;
    }(phaser_ce_1.Group));
    exports.default = PauseButton;
});
//# sourceMappingURL=pause-button.js.map