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
define(["require", "exports", "phaser-ce", "../helpers/sound-helper", "../helpers/const"], function (require, exports, phaser_ce_1, sound_helper_1, const_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PreloaderState = /** @class */ (function (_super) {
        __extends(PreloaderState, _super);
        function PreloaderState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PreloaderState.prototype.preload = function () {
            this.loadImages();
            sound_helper_1.default.Instance.init(this.game);
        };
        PreloaderState.prototype.create = function () {
            this.game.state.start(const_1.Const.States.Game, true, false);
        };
        PreloaderState.prototype.loadImages = function () {
            for (var _i = 0, _a = Object.keys(const_1.Const.Images); _i < _a.length; _i++) {
                var i = _a[_i];
                var img = const_1.Const.Images[i];
                if (img.frameFile) {
                    this.load.atlasJSONHash(img.name, const_1.Const.Path.Image + img.file, const_1.Const.Path.Image + img.frameFile);
                }
                else {
                    this.load.image(img.name, const_1.Const.Path.Image + img.file);
                }
            }
        };
        return PreloaderState;
    }(phaser_ce_1.State));
    exports.default = PreloaderState;
});
//# sourceMappingURL=preloader-state.js.map