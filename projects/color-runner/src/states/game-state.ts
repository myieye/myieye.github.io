import { Sprite, Group, State, Physics, Camera, Timer, Text } from "phaser-ce";
import GameLogic, { PhaseState } from "../game-logic";
import Player from "../sprites/player";
import ColorJoystick from "../sprites/color-joystick";
import { Const } from '../helpers/const';
import ScoreKeeper from '../sprites/score-keeper';
import Popup from '../sprites/popup';
import PauseButton from '../sprites/pause-button';

export default class GameState extends State {
	gameLogic: GameLogic;

	obj: Group;
	ui: Group;
	platformGroup: Group;

	bg: Sprite;
	player: Player;
	score: ScoreKeeper;
	joystick: ColorJoystick;
	shouter: Text;
	popup: Popup;
	pause: PauseButton;

	MinWidth: number;
	MinHeight: number;

	firstUpdate = true;
	gameStarted = false;

	init() {
		this.gameLogic = new GameLogic(this);
		this.MinWidth = Const.Player.StartX + Const.Player.Size.Width +
			this.gameLogic.loadBuffer + this.gameLogic.loadSpace + Const.Platform.Animation.LockDist;
		this.MinHeight = Const.Score.Height + Const.Player.Size.Height + Const.Player.StartVerticalPadding * 2 +
			Const.Platform.Size.Height * (Const.Game.Life + 1);

		this.bg = this.add.sprite(0, 0, 'game-bg');
		this.bg.anchor.setTo(.5, .5);
		//this.game.scale.startFullScreen(false);
		//this.bg.fixedToCamera = true;
	}

	create() {
		// SETUP WORLD ------------------------------------------------
		this.physics.startSystem(Physics.ARCADE);
		this.physics.arcade.gravity.y = 200;

		this.obj = this.game.add.group(undefined, "objects");
		this.ui = this.game.add.group(undefined, "controls");
		this.platformGroup = this.obj.add(this.add.group());

		// Color-Joystick
		var colorJoystick = new ColorJoystick(this.game, (color) => this.onColorChanged(color));
		this.joystick = this.ui.add(this.game.add.existing(colorJoystick));
		this.joystick.setColors(Const.Color.StartColors);

		// Score-board
		this.score = this.ui.add(this.game.add.existing(new ScoreKeeper(this.game)));

		// Pause button
		this.pause = this.ui.add(this.game.add.existing(new PauseButton(this.game)));

		// Player
		var player = new Player(this, Const.Player.StartX, -20);// -Const.Player.Size.Height * 3.5);
		this.player = this.obj.add(this.game.add.existing(player));

		// Shouter
		var shouter = this.shouter = this.game.add.text(this.world.centerX, this.world.centerY, "",
			{
				font: "bold 10em tricolor-bw", fill: "#fff",
				stroke: "#000", strokeThickness: 15,
				boundsAlignH: "right", boundsAlignV: "middle",
			});
		shouter.anchor.setTo(0.5);

		// CAMERA
		this.camera.follow(this.player, Camera.FOLLOW_LOCKON);

		// PLATFORMS
		this.platformGroup.x = Const.Platform.StartX;
		this.platformGroup.y = this.game.height - Const.Platform.NegativeStartY;
		this.platformGroup.enableBody = true;
		this.platformGroup.physicsBodyType = Physics.ARCADE;

		this.popup = this.game.add.existing(new Popup(this.game));

		this.gameLogic.initGame();
		this.resize(); // This is necessary when restarting the state

		this.player.flyDown();

		this.input.keyboard.onDownCallback = (e: KeyboardEvent) => {
			if (e.which == Phaser.KeyCode.SPACEBAR) {
				this.game.paused = !this.game.paused;
			}
		};
		this.state.onPausedCallback = () => {
			this.joystick.enabled = false;
			this.pause.visible = false;
			this.popup.visible = true;
		};
		this.state.onResumedCallback = () => {
			this.joystick.enabled = true;
			this.pause.visible = true;
			this.popup.visible = false;
		};
	}

	update() {
		if (this.firstUpdate) {
			this.resize();
			this.firstUpdate = false;
		} else if (!this.gameStarted && this.player.speed > 0) {
			this.gameStarted = true;
			this.game.time.events.add(Timer.SECOND, () => this.gameLogic.startGame());
		}

		this.gameLogic.update();
	}

	onColorChanged(newColor: number) {
		this.player.setColor(newColor);
	}

	restart() {
		this.gameStarted = false;
		this.game.state.start('Game', true, false, this.gameLogic);
	}

	render() {
		//this.game.debug.spriteBounds(this.gameLogic.p.platform);
		//this.game.debug.pixel(this.player.getBounds().right, 70, "#FF0000", 10);
		//this.game.debug.pixel(this.player.getBounds().right + this.gameLogic.loadBuffer, 70, "#00FF00", 10);
		//this.game.debug.pixel(this.platformGroup.toGlobal(this.gameLogic.lastPlatform.target).x, 70, "#0000FF", 10);
		//this.game.debug.pixel(this.platformGroup.toGlobal(this.gameLogic.lastPlatform.target).x + this.gameLogic.platformWidth, 70, "#0000FF", 10);
		//this.game.debug.bodyInfo(this.player.collider, 32, 32);
		//this.game.debug.body(this.player);
		//this.game.debug.body(this.player.collider);
		//this.game.debug.spriteBounds(this.player);

		/*for (var p of this.player.currPlatforms) {
			this.game.debug.body(p);
		}*/
	}

	setGravity(body: Phaser.Physics.Arcade.Body, gravity: number): any {
		body.gravity.y = -this.physics.arcade.gravity.y + gravity;
	}

	resize(width?: number, height?: number) {
		//alert(this.joystick.getBounds().width);
		var scale = Math.min(this.game.height / this.MinHeight, this.game.width / this.MinWidth);
		this.obj.scale.setTo(scale);

		this.gameLogic.resize(!(width && height));
		this.shouter.position.setTo(this.world.centerX, this.world.centerY);
		this.shouter.fontSize = this.game.height / 4;

		this.game.scale.scaleSprite(this.bg).alignIn(this.camera.view, Phaser.CENTER);

		this.popup.resize();

		this.game.scale.scaleSprite(this.pause as any, 30, 30);
		this.pause.position.setTo(this.game.width - this.pause.width * 1.5, this.score.height + this.pause.height * .1);
		//alert("--" + window.devicePixelRatio + ":" + this.joystick.getBounds().width + ":" + this.joystick.worldScale.x);
	}
}

	// font example
	// this.fontMessage = { font: "24px Arial", fill: "#e4beef",  align: "center", stroke: "#320C3E", strokeThickness: 4 };
	//this.totalTimeText = this.game.add.text(120, 30, "Total time: "+this.totalTimer, this.fontMessage);