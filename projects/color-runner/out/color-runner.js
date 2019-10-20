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
define(["require", "exports", "./states/boot-state", "./states/preloader-state", "./states/game-state", "./helpers/const", "phaser-ce", "./states/main-menu-state"], function (require, exports, boot_state_1, preloader_state_1, game_state_1, const_1, phaser_ce_1, main_menu_state_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ColorRunnerGame = /** @class */ (function (_super) {
        __extends(ColorRunnerGame, _super);
        function ColorRunnerGame() {
            var _this = _super.call(this, "100%", "100%", phaser_ce_1.CANVAS, 'game') || this;
            _this.state.add(const_1.Const.States.Boot, boot_state_1.default);
            _this.state.add(const_1.Const.States.Preloader, preloader_state_1.default);
            _this.state.add(const_1.Const.States.MainMenu, main_menu_state_1.default);
            _this.state.add(const_1.Const.States.Game, game_state_1.default);
            return _this;
        }
        Object.defineProperty(ColorRunnerGame, "Instance", {
            get: function () { return ColorRunnerGame.instance = (ColorRunnerGame.instance || new ColorRunnerGame()); },
            enumerable: true,
            configurable: true
        });
        ;
        ColorRunnerGame.prototype.start = function () {
            this.state.start(const_1.Const.States.Boot);
        };
        return ColorRunnerGame;
    }(phaser_ce_1.Game));
    exports.ColorRunnerGame = ColorRunnerGame;
});
//# sourceMappingURL=color-runner.js.map