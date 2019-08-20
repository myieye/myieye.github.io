ColorRunner.Game = function (game) { };
ColorRunner.Game.prototype = {
	init: function (gameLogic) {
		game = this;
		this.gameLogic = gameLogic;

		this.bg = this.add.sprite(0, -100, 'game-bg');
		this.bg.scale.setTo(2, 2);
		this.bg.fixedToCamera = true;
	},

	create: function () {
		// SETUP WORLD ------------------------------------------------
		this.world.resize(ColorRunner.screenSize.x(), ColorRunner.screenSize.y());
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.physics.arcade.gravity.y = 1000;

		var colorWheelPadding = 30;
		var colorWheelRadius = 70;
		var colorWheelPinRadius = 35;
		var colorWheelPos = {
			//x: (this.camera.x + this.camera.width) - (colorWheelRadius + colorWheelPadding),
			x: this.camera.x + ColorRunner.settings.platformLoadBuffer + 100,
			y: (this.camera.y + this.camera.height) - (colorWheelRadius + colorWheelPadding)
		}
		this.game.obj = this.game.add.group(undefined, "objects");
		this.game.ui = this.game.add.group(undefined, "controls");

		// Color-Joystick
		var colorWheelColors = this.gameLogic.getColorWheelHexColors();
		var colorJoystick = new ColorRunner.sprites.ColorJoystick(this.game, colorWheelPos.x, colorWheelPos.y,
			colorWheelRadius, colorWheelPinRadius, colorWheelColors, (color) => this.onColorChanged(color));
		this.game.ui.add(this.game.add.existing(colorJoystick));

		// Score-board
		this.score = this.game.ui.add(this.game.add.existing(new ColorRunner.sprites.ScoreBoard(this.game)));

		// Player
		var player = new ColorRunner.sprites.Player(this.game, ColorRunner.settings.platformStartX + 15, 50);
		this.player = this.game.obj.add(this.game.add.existing(player));

		// CAMERA
		this.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON);

		// PLATFORMS
		this.platformGroup = this.game.obj.add(this.add.group());
		this.gameLogic.initGame(this.game, this.platformGroup);

		this.keys = this.game.input.keyboard.createCursorKeys();

		this.game.time.events.add(Phaser.Timer.SECOND, function () {
			this.player.walk();
			this.started = true;
		}, this);

		this.game.currSpeed = ColorRunner.settings.startSpeed;
	},
	update: function () {
		
		this.gameLogic.update(this, this.platformGroup);
		if (this.started) {
			this.checkBounds ();
		}

		if (this.started) {
			this.platformGroup.x -= this.game.currSpeed;
		}

		this.physics.arcade.collide(this.player, this.platformGroup, this.platformCollision, null, this);
	},
	
	platformCollision: function (player, platform) {
		if (player.lastPlatform !== platform || !platform.matched) {

			if (player.lastPlatform && !player.lastPlatform.matched) {
				this.gameLogic.onPlatformMissed(this.platformGroup);
				player.lastPlatform.matched = true;
				this.onPlatformComplete(platform.number);
			}

			player.lastPlatform = platform;
			this.checkColor(platform);
		}
	},

	checkColor: function (platform) {
		if (platform.tint != ColorRunner.settings.defaultTint) {
			if (this.player.getColor() === platform.tint) {
				platform.matched = true;
				platform.tint = ColorRunner.settings.defaultTint;
				this.score.increment();
				this.onPlatformComplete(platform.number);
			}
		} else {
			platform.matched = true;
		}
	},

	onColorChanged: function (newColor) {
		this.player.setColor(newColor);
	},

	onPlatformComplete: function(platformNumber) {
		if (platformNumber % ColorRunner.settings.speedIncreaseInterval == 0) {
			this.game.currSpeed = this.game.math.clamp(this.game.currSpeed + ColorRunner.settings.speedIncrement,
				0, ColorRunner.settings.maxSpeed);
		}
	},

	checkBounds: function () {
		var playerBottom = this.player.position.y;
		var worldBottom = this.game.world.height;
		if (playerBottom > worldBottom) {
			this.restart ();
		}
	},

	restart: function () {
		this.game.state.start('Game', true, false, this.gameLogic);
	},
};

// font example
// this.fontMessage = { font: "24px Arial", fill: "#e4beef",  align: "center", stroke: "#320C3E", strokeThickness: 4 };
//this.totalTimeText = this.game.add.text(120, 30, "Total time: "+this.totalTimer, this.fontMessage);
