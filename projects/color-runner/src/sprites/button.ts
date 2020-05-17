import { Group, Game, Sprite, BitmapData } from 'phaser-ce';
import { Const } from '../helpers/const';

export default class Button extends Group {

    private button: Sprite;
    private image: Sprite;
    private rainbow: Sprite;

    private up: string;
    private down: string;

    private constructor(game: Game, x: number, y: number, up: string, down: string, icon: string) {
        super(game);

        this.up = up;
        this.down = down;

        this.inputEnableChildren = true;
        this.button = this.add(game.add.sprite(x, y, up));
        this.image = this.add(game.add.sprite(x, y, icon));
        game.scale.scaleSprite(this as any, 60, 60, true);

        this.onChildInputDown.add(() => {
            this.button.loadTexture(this.down);
        });
        this.onChildInputUp.add(() => {
            this.button.loadTexture(this.up);
        });
        this.onChildInputOut.add(() => {
            this.button.loadTexture(this.up);
        });
        
        game.scale.scaleSprite(this.image, this.button.width * .5, this.button.height * .5, true);
        this.image.alignIn(this.button, Phaser.CENTER);
    }

    static Fly(game: Game, x:number, y:number) {
        let button = new Button(game, x, y, Const.Images.ButtonFly.name, Const.Images.ButtonFly_Pressed.name, Const.Images.FlyIcon.name);
        button.image.tint = 0x222222;
        return button;
    }

    static Freeze(game: Game, x:number, y:number) {
        let button = new Button(game, x, y, Const.Images.ButtonFreeze.name, Const.Images.ButtonFreeze_Pressed.name, Const.Images.SnowflakeIcon.name);
        button.image.tint = 0xE4E4E4;
        return button;
    }

    static Rainbow(game: Game, x:number, y:number) {
        let button = new Button(game, x, y, Const.Images.ButtonRainbow.name, Const.Images.ButtonRainbow_Pressed.name, Const.Images.StarIcon.name);
        button.image.tint = 0x222222;
        return button;
    }
}