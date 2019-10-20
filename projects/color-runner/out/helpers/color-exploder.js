define(["require", "exports", "./const"], function (require, exports, const_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ColorExploder = /** @class */ (function () {
        function ColorExploder(game) {
            this.game = game;
            this.buildExploder();
        }
        ColorExploder.Instance = function (game) {
            return ColorExploder._instance = (ColorExploder._instance || new ColorExploder(game));
        };
        ColorExploder.prototype.explode = function (sprite, color) {
            //sprite.parent.addChild(this.emitter);
            this.emitter.position.setTo(sprite.getBounds().centerX, sprite.getBounds().centerY);
            this.emitter.setSize(sprite.getBounds().width, sprite.getBounds().height);
            this.emitter.start(true, 5000, 100, 100);
            return;
            //
            //this.exploder.setSize(sprite.width, sprite.height);
            this.exploder.setSize(100, 50);
            //this.exploder.setSize(sprite.width, sprite.height);
            //this.exploder.position.setTo(sprite.width / 2, sprite.height / 2);
            //this.exploder.start(true, 2000, 50, 50);
            return;
            console.log(this.exploder.children);
            this.exploder.children.forEach(function (p) { return p.tint == color; });
        };
        ColorExploder.prototype.buildExploder = function () {
            this.emitter = this.game.add.emitter(0, 0);
            this.emitter.makeParticles(const_1.Const.Images.ColorExplosion.name);
            this.emitter
                .setRotation(.1, .5)
                .setScale(0.1, .2, 0.1, .2, 2000, Phaser.Easing.Quintic.Out);
            this.emitter.gravity.y = -200;
            this.exploder = this.game.add.emitter(0, 0);
            this.exploder.makeParticles(const_1.Const.Images.ColorExplosion.name);
            this.exploder
                .setRotation(.1, .5)
                .setScale(0.1, 1, 0.1, 1, 6000, Phaser.Easing.Quintic.Out);
            this.exploder.gravity.y = -200;
        };
        return ColorExploder;
    }());
    exports.default = ColorExploder;
});
//# sourceMappingURL=color-exploder.js.map