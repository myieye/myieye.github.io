import { State, Sprite, Color, BitmapText, Group, Timer } from "phaser-ce";
import MenuItem from "../sprites/menu-item";
import { Const } from "../helpers/const";
import Menu from "../sprites/menu";

export default class MainMenuState extends State {

    private bg: Sprite;
    private title: BitmapText;
    private menu: Menu;

    init() {
        this.menu = null;

        this.bg = this.add.sprite(0, 0, 'main-menu-bg');
        this.bg.anchor.setTo(.5, .5);
        this.bg.alpha = .5;

        this.title = this.game.add.bitmapText(0, 0, 'tricolor', 'Color Runner', 10);
        this.title.anchor.setTo(.5, .5);

        this.resize();
        
        var paddingPer = .15;
        var sizePer = ((this.game.height - this.title.bottom) / this.game.height) - paddingPer * 2;
        var startPer = (this.title.bottom / this.game.height) + paddingPer * 1.1;

        this.menu = this.game.add.existing(new Menu(
            this.game, startPer, sizePer,
            new MenuItem(this.game, "Start", () => this.startGame()),
            new MenuItem(this.game, "High scores", null),
            new MenuItem(this.game, "Credits", null)
        )
        );

        this.resize();
    }

    private startGame() {
        this.camera.fade(0, Timer.SECOND * 1);
        this.camera.onFadeComplete.add(() => this.game.state.start(Const.States.Game));
    }

    resize(width?: number, height?: number) {
        this.game.scale.scaleSprite(this.bg).alignIn(this.camera.view, Phaser.CENTER);

        this.game.scale.scaleSprite(this.title as any, this.game.width * .8, this.game.height * .25, true);
        this.title.position.setTo(this.game.world.centerX, this.game.world.height * .15);
        
        if (this.menu) this.menu.resize();
    }

    render() {
        var i = this.menu.children[0];
        //this.game.debug.spriteBounds(i.platform);
        //this.game.debug.spriteBounds(i.text);
    }
}