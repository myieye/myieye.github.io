(function(ColorRunner) {

    var settings;

    var currPlatformX;
    var currPlatformY;

    ColorRunner.GameLogic = function(gameSettings) {
        settings = gameSettings;
        this.colors = settings.defaultColors;
    };

    ColorRunner.GameLogic.prototype = (function() {

        function setupWorld (game) {
            game.world.resize(settings.startWorldSize.x, settings.startWorldSize.y);
            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.physics.arcade.gravity.y = 200;
        }

        function initGame(game, platformGroup) {

            currPlatformY = settings.platformY;
            currPlatformX = settings.platformStartX;

            platformGroup.enableBody = true;
            platformGroup.physicsBodyType = Phaser.Physics.ARCADE;

            var startPlatforms = settings.startPlatforms;

            for (var p of startPlatforms) {
                _addPlatform(platformGroup, p);
            }
        }

        function _addPlatform(platformGroup, p) {
            var platform = platformGroup.create(
                    currPlatformX, currPlatformY, 'platform'); 
            platform.body.allowGravity = false;
            platform.body.immovable = true;
            platform.tint = (p.t || settings.defaultTint);

            currPlatformX += settings.platformWidth;
        }

        function update(game, platformGroup) {
            var playerX = game.player.x;
            
            while (playerX > (currPlatformX - settings.platformLoadBuffer)) {
                var tint = _getRandomTint.call(this);
                var newP = { t: tint };
                _addPlatform(platformGroup, newP);
            }
        }

        function getColorWheelHexColors() {
            return this.colors;
        }

        function _getRandomTint() {
            var i = ColorRunner.mathHelper.getRandomInt(0, this.colors.length);
            return this.colors[i];
        }

        function onPlatformMissed () {
            settings.currPlatformY += 15;
        }

        return {
            setupWorld: setupWorld,
            initGame: initGame,
            update: update,
            getColorWheelHexColors: getColorWheelHexColors,
            onPlatformMissed: onPlatformMissed
        };
    })();

})(ColorRunner = window.ColorRunner || {});