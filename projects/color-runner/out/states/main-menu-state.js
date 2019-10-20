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
define(["require", "exports", "phaser-ce", "../sprites/menu-item", "../helpers/const", "../sprites/menu"], function (require, exports, phaser_ce_1, menu_item_1, const_1, menu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MainMenuState = /** @class */ (function (_super) {
        __extends(MainMenuState, _super);
        function MainMenuState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MainMenuState.prototype.init = function () {
            var _this = this;
            this.menu = null;
            this.bg = this.add.sprite(0, 0, 'main-menu-bg');
            this.bg.anchor.setTo(.5, .5);
            this.bg.alpha = .5;
            this.title = this.game.add.bitmapText(0, 0, 'tricolor', 'Color Runner', 10);
            this.title.anchor.setTo(.5, .5);
            this.resize();
            var paddingPer = .15;
            var sizePer = ((this.game.height - this.title.bottom) / this.game.height) - paddingPer * 2;
            var startPer = (this.title.bottom / this.game.height) + paddingPer * 1.1;
            this.menu = this.game.add.existing(new menu_1.default(this.game, startPer, sizePer, new menu_item_1.default(this.game, "Start", function () { return _this.startGame(); }), new menu_item_1.default(this.game, "High scores", null), new menu_item_1.default(this.game, "Credits", null)));
            this.resize();
        };
        MainMenuState.prototype.startGame = function () {
            var _this = this;
            this.camera.fade(0, phaser_ce_1.Timer.SECOND * 1);
            this.camera.onFadeComplete.add(function () { return _this.game.state.start(const_1.Const.States.Game); });
        };
        MainMenuState.prototype.resize = function (width, height) {
            this.game.scale.scaleSprite(this.bg).alignIn(this.camera.view, Phaser.CENTER);
            this.game.scale.scaleSprite(this.title, this.game.width * .8, this.game.height * .25, true);
            this.title.position.setTo(this.game.world.centerX, this.game.world.height * .15);
            if (this.menu)
                this.menu.resize();
        };
        MainMenuState.prototype.render = function () {
            var i = this.menu.children[0];
            //this.game.debug.spriteBounds(i.platform);
            //this.game.debug.spriteBounds(i.text);
        };
        return MainMenuState;
    }(phaser_ce_1.State));
    exports.default = MainMenuState;
});
//# sourceMappingURL=main-menu-state.js.map