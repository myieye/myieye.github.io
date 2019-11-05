import { Group, Game, Sprite } from 'phaser-ce';
import { Const } from '../helpers/const';

export default class Button extends Group {

    private bg: Sprite;
    private image: Sprite;

    constructor(game: Game, x: number, y: number, color: number, image: string) {
        super(game);

        this.inputEnableChildren = true;
        this.bg = this.add(game.add.sprite(x, y, Const.Images.Button.name));
        this.bg.tint = color;

        this.image = this.add(game.add.sprite(x, y, image));
        this.image.tint = 0x333333;

        game.scale.scaleSprite(this as any, 60, 60, true);
        
        game.scale.scaleSprite(this.image, this.bg.width * .5, this.bg.height * .5, true);
        this.image.alignIn(this.bg, Phaser.CENTER);

        this.onChildInputOver.add(() => {
            this.bg.loadTexture(Const.Images.ButtonPressed.name);
            this.bg.alpha = .8;
        });
        this.onChildInputOut.add(() => {
            this.bg.loadTexture(Const.Images.Button.name);
            this.bg.alpha = 1;
        });
    }
}