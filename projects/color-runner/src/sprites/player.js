(function(ColorRunner) {
    (function(sprites) {

        var Player = function (game, x, y) {
            Phaser.Sprite.call(this, game, x, y, 'player', 'default/000');

            game.physics.enable(this, Phaser.Physics.ARCADE);

            this.scale.setTo(0.4, 0.4);
            this.body.setSize(120, 160);
            this.anchor.set(0.5, 1);
    
            this.animations.add('walk', Phaser.Animation.generateFrameNames('default/', 0, 8, '', 3), 20, true, false);
    
            this.tint = 0xFFFFFF;
        }

        Player.prototype = Object.create(Phaser.Sprite.prototype);
        Player.prototype.constructor = sprites.Player;
        ColorRunner.sprites.Player = Player;

        Player.prototype.setColor = function(color) {
            this.targetTint = color;
        }

        Player.prototype.getColor = function() {
            return this.targetTint || this.tint;
        }

        Player.prototype.update = function() {
            if (this.targetTint) {
                this.tint = Phaser.Color.interpolateColor(
                    this.tint, this.targetTint, 100,
                    ColorRunner.settings.colorChangeSpeed, 1)
            }
        }

        Player.prototype.walk = function() {
            this.animations.play("walk");
        }

    })(ColorRunner.sprites = ColorRunner.sprites || {});
})(ColorRunner = window.ColorRunner || {});