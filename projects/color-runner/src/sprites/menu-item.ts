import { Group, Game, Sprite, Text, Color } from "phaser-ce";
import { Const } from "../helpers/const";

export default class MenuItem extends Group {

    private color: number;
    private platform: Sprite;
    private text: Text;

    constructor(game: Game, text: string, callback: Function) {
        super(game);

        this.inputEnableChildren = true;
        this.onChildInputOver.add(this.onInputOver, this);
        this.onChildInputOut.add(this.onInputOut, this);
        this.onChildInputDown.add(this.onInputOut, this);
        if (callback) this.onChildInputDown.add(callback);

        this.platform = this.add(game.add.sprite(0, 0, Const.Images.Platform.name));
        this.platform.anchor.setTo(.5);
        this.platform.smoothed = false;
        this.game.scale.scaleSprite(this.platform, this.game.width * .3, this.game.height * .4, true);

        this.text = this.add(game.add.text(0, 0, text, {
            font: "tricolor-bw", fontSize: this.platform.height, fill: "#000"
        }));
        this.text.anchor.setTo(.5);
        this.resize();
    }

    resize() {
        this.game.scale.scaleSprite(this.platform, this.game.width * .3, this.game.height * .4, true);
    }

    setColor(tint: number) {
        this.color = this.platform.tint = tint;
    }

    onInputOver() {
        this.platform.tint = Const.Color.DefaultPlatformTint;
        this.text.addColor("#FFFFFF", 0);
    }

    onInputOut() {
        this.platform.tint = this.color;
        this.text.addColor("#000000", 0);
    }

    setEnabled(enabled = true) {
        this.platform.inputEnabled = enabled;
        this.text.inputEnabled = enabled;
    }
}