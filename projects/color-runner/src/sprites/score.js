(function(ColorRunner) {
    (function(sprites) {

        var ScoreBoard = sprites.ScoreBoard = function (game, x, y, width, height) {
            Phaser.Group.call(this, game);

            x = x || 10;
            y = y || 10;
            width = width || 60;
            height = height || 30;

            this.score = 0;

            var scoreBoard = game.add.group();
            scoreBoard.fixedToCamera = true;
            scoreBoard.cameraOffset.setTo(x, y);

            var background = game.add.graphics(0, 0);
            background.beginFill(0x000000, 0.2);
            background.drawRect(0, 0, width, height);

            var text = this.text = game.add.text(0, 0, this.score,
                { font: "bold 20px Arial", fill: "#fff", boundsAlignH: "right", boundsAlignV: "middle" });
            
            text.padding.set(5);
            text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            text.setTextBounds(0, 0, width, height + 10);
            
            scoreBoard.addMultiple([background, text]);
        };

        ScoreBoard.prototype = Object.create(Phaser.Group.prototype);
        ScoreBoard.prototype.constructor = ScoreBoard;

        ScoreBoard.prototype.increment = function() {
            this.text.text = ++this.score;
        }

    })(ColorRunner.sprites = ColorRunner.sprites || {});
})(ColorRunner = window.ColorRunner || {});