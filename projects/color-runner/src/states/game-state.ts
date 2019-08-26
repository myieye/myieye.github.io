import { Sprite, Group } from "phaser-ce";
import GameLogic from "../game-logic";
import ScreenUtils from '../utils/utils';
import ScoreBoard from "../sprites/score";
import Player from "../sprites/player";
import ColorJoystick from "../sprites/color-joystick";
import { Const } from "../helpers/settings";

export default class GameState extends Phaser.State {
	gameLogic: GameLogic;

	obj: Group;
	ui: Group;
	platformGroup: Group;

	bg: Sprite;
	player: Player;
	score: ScoreBoard;

	started: boolean;
	currSpeed: number;

	init() {
		this.gameLogic = new GameLogic(this);
		this.bg = this.add.sprite(0, -100, 'game-bg');
		this.bg.scale.setTo(2, 2);
		this.bg.fixedToCamera = true;
	}

	create() {
		// SETUP WORLD ------------------------------------------------
		this.world.resize(ScreenUtils.width(), ScreenUtils.height());
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.physics.arcade.gravity.y = 1000;

		var colorWheelPadding = 30;
		var colorWheelRadius = 70;
		var colorWheelPinRadius = 35;
		var colorWheelPos = {
			x: (this.camera.x + this.camera.width) - (colorWheelRadius + colorWheelPadding),
			//x: this.camera.x + Const.platform.loadBuffer + 100,
			y: (this.camera.y + this.camera.height) - (colorWheelRadius + colorWheelPadding)
		}
		this.obj = this.game.add.group(undefined, "objects");
		this.ui = this.game.add.group(undefined, "controls");

		// Color-Joystick
		var colorWheelColors = this.gameLogic.getColorWheelHexColors();
		var colorJoystick = new ColorJoystick(this.game, colorWheelPos.x, colorWheelPos.y,
			colorWheelRadius, colorWheelPinRadius, colorWheelColors, (color) => this.onColorChanged(color));
		this.ui.add(this.game.add.existing(colorJoystick));

		// Score-board
		this.score = this.ui.add(this.game.add.existing(new ScoreBoard(this.game)));

		// Player
		var player = new Player(this, Const.Platform.StartX + 15, 50);
		this.player = this.obj.add(this.game.add.existing(player));

		// CAMERA
		this.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON);

		// PLATFORMS
		this.platformGroup = this.obj.add(this.add.group());
		this.platformGroup.enableBody = true;
		this.platformGroup.physicsBodyType = Phaser.Physics.ARCADE;
		this.gameLogic.initGame();

		this.game.time.events.add(Phaser.Timer.SECOND, () => {
			this.player.walk();
			this.started = true;
		}, this);

		this.currSpeed = Const.Speed.Start;
	}

	update() {
		if (this.started) {
			this.checkBounds();
		}

		this.gameLogic.update(this.game, this.platformGroup);
	}

	onColorChanged(newColor) {
		this.player.setColor(newColor);
	}

	checkBounds() {
		var playerBottom = this.player.position.y;
		var worldBottom = this.game.world.height;
		if (playerBottom > worldBottom) {
			this.restart();
		}
	}

	restart() {
		this.game.state.start('Game', true, false, this.gameLogic);
	}

	render() {
		//this.game.debug.bodyInfo(this.player.collider, 32, 32);
		//this.game.debug.body(this.player);
		//this.game.debug.body(this.player.collider);
	}
}

	// font example
	// this.fontMessage = { font: "24px Arial", fill: "#e4beef",  align: "center", stroke: "#320C3E", strokeThickness: 4 };
	//this.totalTimeText = this.game.add.text(120, 30, "Total time: "+this.totalTimer, this.fontMessage);