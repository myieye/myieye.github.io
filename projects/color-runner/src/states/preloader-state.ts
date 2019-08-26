import { State } from "phaser-ce";
import SoundHelper from "../helpers/sound-helper";

export default class PreloaderState extends State {

	preload() {
		// LGOIC --------------------------------------------------
		this.load.atlasJSONHash('player', 'img/player-gray.png', 'img/player.json');
		this.load.image('platform', 'img/platform.gif');
		this.load.image('game-bg', 'img/backgrounds/background.jpg');
		this.load.image('joystick', 'img/joystick.png');
		SoundHelper.Instance.preload();
	}

	create() {
		this.game.state.start('Game', true, false);
		SoundHelper.Instance.create();
	}
}