import { State } from "phaser-ce";
import SoundHelper from "../helpers/sound-helper";

export default class BootState extends State {

	init() {
		SoundHelper.Instance.init(this.game);
	}

	create() {
		this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;
		//this.game.scale.setShowAll();
		this.game.state.start('Preloader');
	}
}