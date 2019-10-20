import { State, ScaleManager } from "phaser-ce";
import { Const } from "../helpers/const";

export default class BootState extends State {

	init() {
		
	}

	create() {
		this.game.scale.scaleMode = ScaleManager.RESIZE;
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;
		this.game.state.start(Const.States.Preloader);
		this.game.add.text(0, 0, "hack", {font:"1px tricolor-bw"});
	}
}