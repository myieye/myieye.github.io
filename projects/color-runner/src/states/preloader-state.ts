import { State } from "phaser-ce";
import SoundHelper from "../helpers/sound-helper";
import { Const, Image } from "../helpers/const";

export default class PreloaderState extends State {

	preload() {
		this.loadImages();
		this.game.load.bitmapFont("tricolor", "./assets/font/tricolor.png", "./assets/font/tricolor.fnt");
		SoundHelper.Instance.init(this.game);
	}

	private loadImages() {
		for (var i of Object.keys(Const.Images)) {
			var img:Image = Const.Images[i];

			if (img.frameFile) {
				this.load.atlasJSONHash(img.name, Const.Path.Image + img.file, Const.Path.Image + img.frameFile);
			} else {
				this.load.image(img.name, Const.Path.Image + img.file);
			}
		}
	}

	create() {
		this.game.state.start(Const.States.Game, true, false);
	}
}