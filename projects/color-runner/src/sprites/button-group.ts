import { Group, Game } from "phaser-ce";
import Button from './button';
import { Const } from "../helpers/const";

export default class ButtonGroup extends Group {

    constructor(game: Game) {
        super(game);

        //this.alpha = 0.9;
        this.add(game.add.existing(Button.Fly(game, 200, 0)));
        this.add(game.add.existing(Button.Freeze(game, 400, 400)));
        this.add(game.add.existing(Button.Rainbow(game, 0, 400)));
    }

    update(): void {
        const maxHeight = Math.min(this.game.height / 5, Const.PowerButton.GroupSize.MaxSize);
        const maxWidth = Math.min(this.game.width / 5, Const.PowerButton.GroupSize.MaxSize);
        this.game.scale.scaleSprite(this as any, maxWidth, maxHeight);

        const padding = Math.min(this.game.height / 12, 25);
        this.alignIn(this.game.camera.bounds, Phaser.BOTTOM_LEFT, -padding, -padding);
    }
}