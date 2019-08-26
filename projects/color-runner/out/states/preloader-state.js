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
define(["require", "exports", "phaser-ce", "../helpers/sound-helper"], function (require, exports, phaser_ce_1, sound_helper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PreloaderState = /** @class */ (function (_super) {
        __extends(PreloaderState, _super);
        function PreloaderState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PreloaderState.prototype.preload = function () {
            // LGOIC --------------------------------------------------
            this.load.atlasJSONHash('player', 'img/player-gray.png', 'img/player.json');
            this.load.image('platform', 'img/platform.gif');
            this.load.image('game-bg', 'img/backgrounds/background.jpg');
            this.load.image('joystick', 'img/joystick.png');
            sound_helper_1.default.Instance.preload();
        };
        PreloaderState.prototype.create = function () {
            this.game.state.start('Game', true, false);
            sound_helper_1.default.Instance.create();
        };
        return PreloaderState;
    }(phaser_ce_1.State));
    exports.default = PreloaderState;
});
//# sourceMappingURL=preloader-state.js.map