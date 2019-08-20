ColorRunner.Preloader = function(game) {};
ColorRunner.Preloader.prototype = {
	preload: function() {
		// LGOIC --------------------------------------------------
		this.gameLogic = new ColorRunner.GameLogic(ColorRunner.settings);
		this.load.atlasJSONHash('player', 'img/player-gray.png', 'img/player.json');
		this.load.image('platform', 'img/platform.gif');
    	this.load.image('game-bg', 'img/backgrounds/background.jpg');
		this.load.image('joystick', 'img/joystick.png');
		ColorRunner.soundHelper.preload(this.game);
	},
	create: function() {
		this.game.state.start('Game', true, false, this.gameLogic);
		ColorRunner.soundHelper.create(this.game);
	}
};