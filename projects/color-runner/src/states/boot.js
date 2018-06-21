
var w = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0];

var ColorRunner = ColorRunner || {};
ColorRunner.screenSize = {
	x: w.innerWidth || e.clientWidth || g.clientWidth,
	y: w.innerHeight || e.clientHeight || g.clientHeight
};

ColorRunner.Boot = function (game) { };
ColorRunner.Boot.prototype = {
	create: function () {
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;
		this.game.state.start('Preloader');
		ColorRunner.settings = ColorRunner.settings || {};
		ColorRunner.settings.colorChangeSpeed = 5;
	}
};