(function(ColorRunner) {

    var settings;

    var currPlatformX;
    var currPlatformY;

    var that;

    ColorRunner.GameLogic = function(gameSettings) {
        settings = gameSettings;
        this.colors = settings.defaultColors;
        that = this;
    };

    ColorRunner.GameLogic.prototype = (function() {

        function setupWorld (game) {
            game.world.resize(ColorRunner.screenSize.x(), ColorRunner.screenSize.y());
            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.physics.arcade.gravity.y = 200;
        }

        function initGame(game, platformGroup) {
            that.lastPlatform = undefined;
            that.platformNum = 1;
            that.game = game;
            currPlatformY = game.world.height - settings.platformStartY;

            platformGroup.enableBody = true;
            platformGroup.physicsBodyType = Phaser.Physics.ARCADE;

            var startPlatforms = settings.startPlatforms;

            for (var p of startPlatforms) {
                _addPlatform(platformGroup, p);
            }
        }

        function _addPlatform(platformGroup, p) {
            var newPlatformX = that.lastPlatform
                ? that.lastPlatform.x + settings.platformWidth
                : settings.platformStartX;
            var platform = platformGroup.create(
                newPlatformX, currPlatformY, 'platform');
            platform.body.allowGravity = false;
            platform.body.immovable = true;
            platform.tint = (p.t || settings.defaultTint);
            platform.number = that.platformNum++;
            that.lastPlatform = platform;
        }

        function update(game, platformGroup) {
            if (that.lastPlatform && (that.lastPlatform.worldPosition.x < settings.platformLoadBuffer)) {
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

        function onPlatformMissed (platformGroup) {
            platformGroup.y += ColorRunner.settings.platformHeight;
            platformGroup.x += ColorRunner.settings.platformWidth / 4;
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