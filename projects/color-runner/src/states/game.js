ColorRunner.Game = function (game) { };
ColorRunner.Game.prototype = {
	init: function (gameLogic) {
		this.gameLogic = gameLogic;

		this.bg = this.add.sprite(0, -100, 'game-bg');
		this.bg.scale.setTo(2, 2);
		this.bg.fixedToCamera = true;
	},

	create: function () {
		// SETUP WORLD ------------------------------------------------

		this.world.resize(ColorRunner.settings.startWorldSize.x, ColorRunner.settings.startWorldSize.y);
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.physics.arcade.gravity.y = 200;

		var colorWheelPadding = 30;
		var colorWheelRadius = 40;
		var colorWheelPinRadius = 20;
		var colorWheelPos = {
			x: (this.camera.x + this.camera.width) - (colorWheelRadius + colorWheelPadding),
			y: (this.camera.y + this.camera.height) - (colorWheelRadius + colorWheelPadding)
		}
		var colorWheelColors = this.gameLogic.getColorWheelHexColors();

		var colorJoystick = new ColorRunner.sprites.ColorJoystick(this, colorWheelPos.x, colorWheelPos.y,
			colorWheelRadius, colorWheelPinRadius, colorWheelColors, this);

		this.game.add.existing(colorJoystick);

		// PREPARE PLAYER
		this.player = this.add.sprite(100, 50, 'player', 'default/000');

		// physics
		this.physics.enable(this.player, Phaser.Physics.ARCADE);

		// size & position
		this.player.scale.setTo(0.4, 0.4);
		this.player.body.setSize(120, 160);
		this.player.anchor.set(0.5, 1);

		// animate
		this.player.animations.add('walk', Phaser.Animation.generateFrameNames('default/', 0, 8, '', 3), 20, true, false);

		// color
		this.player.tint = 0xFFFFFF;

		//this.player.checkWorldBounds = true;
		//this.player.events.onOutOfBounds.add(this.restart, this);

		// CAMERA
		this.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON);


		// PLATFORMS
		this.platformGroup = this.add.group();
		this.gameLogic.initGame(this, this.platformGroup);

		this.keys = this.game.input.keyboard.createCursorKeys();

		this.game.time.events.add(Phaser.Timer.SECOND, function () {
			this.player.animations.play('walk');
			this.player.body.velocity.x += ColorRunner.settings.startSpeed;
			this.started = true;
		}, this);
	},
	update: function () {

		this.gameLogic.update(this, this.platformGroup);

		if (this.started) {
			this.updateSpeed ();
			this.checkBounds ();
		}

		this.lerpPlayerColor();
		this.physics.arcade.collide(this.player, this.platformGroup, this.platformCollision, null, this);
	},
	platformCollision: function (player, platform) {

		if (player.lastPlatform !== platform || !platform.matched) {

			if (player.lastPlatform && !player.lastPlatform.matched) {
				this.gameLogic.onPlatformMissed();
				player.lastPlatform.matched = true;
			}

			player.lastPlatform = platform;
			this.checkColor(platform);
		}
	},
	checkColor: function (platform) {
		if (platform.tint != ColorRunner.settings.defaultTint) {
			if (this.player.targetTint === platform.tint) {
				platform.matched = true;
				platform.tint = ColorRunner.settings.defaultTint;
			}
		} else {
			platform.matched = true;
		}
	},
	lerpPlayerColor: function () {
		if (this.player.targetTint) {
			this.player.tint = Phaser.Color.interpolateColor(
				this.player.tint, this.player.targetTint, 100,
				ColorRunner.settings.colorChangeSpeed, 1)
		}
	},

	notifyColorChanged: function (newColor) {
		this.player.targetTint = newColor;
	},

	updateSpeed: function () {
		this.player.body.velocity.x = this.game.math.clamp(
			this.player.body.velocity.x + 0.5,
			0, ColorRunner.settings.maxSpeed);
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
	}
};

// font example
// this.fontMessage = { font: "24px Arial", fill: "#e4beef",  align: "center", stroke: "#320C3E", strokeThickness: 4 };
//this.totalTimeText = this.game.add.text(120, 30, "Total time: "+this.totalTimer, this.fontMessage);
