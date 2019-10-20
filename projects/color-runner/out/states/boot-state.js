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
    var BootState = /** @class */ (function (_super) {
        __extends(BootState, _super);
        function BootState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BootState.prototype.init = function () {
        };
        BootState.prototype.create = function () {
            this.game.scale.scaleMode = phaser_ce_1.ScaleManager.RESIZE;
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
            this.game.add.text(0, 0, "hack", { font: "1px tricolor-bw" });
            this.game.state.start(const_1.Const.States.Preloader);
        };
        return BootState;
    }(phaser_ce_1.State));
    exports.default = BootState;
});
//# sourceMappingURL=boot-state.js.map