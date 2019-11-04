import { State, Sprite, Text, BitmapText, Group, Timer } from "phaser-ce";
import MenuItem from "../sprites/menu-item";
import { Const } from "../helpers/const";
import Menu from "../sprites/menu";

export default class MainMenuState extends State {

    private bg: Sprite;
    private title: BitmapText;
    private menu: Menu;
    private tapToStart: BitmapText;
    private credits: HTMLElement;
    private started = false;

    constructor() {
        super();
        this.credits = document.getElementById("credits-container");
        document.getElementById("close-credits").onclick = () => this.showCredits(false);
    }

    init() {
        this.menu = null;

        this.bg = this.add.sprite(0, 0, 'main-menu-bg');
        this.bg.anchor.setTo(.5, .5);
        this.bg.alpha = .5;
        this.bg.events.onInputDown.add(() => this.showCredits(false));

        this.title = this.game.add.bitmapText(0, 0, 'tricolor', 'Color Runner');
        this.title.smoothed = true;
        this.title.anchor.setTo(.5, .5);
        this.title.visible = false;

        this.tapToStart = this.game.add.bitmapText(0, 0, 'tricolor', 'Tap to Start', 190);
        this.tapToStart.smoothed = true;

        this.resize();

        var paddingPerc = (this.title.height / this.game.height) / 3;

        var sizePer = ((this.game.height - this.title.bottom) / this.game.height) - (paddingPerc * 2.2);
        var startPer = (this.title.bottom / this.game.height) + paddingPerc * 1.8;

        this.menu = this.game.add.existing(new Menu(
            this.game, startPer, sizePer,
            new MenuItem(this.game, "Start", () => this.startGame()),
            new MenuItem(this.game, "High scores", null),
            new MenuItem(this.game, "Credits", () => this.showCredits()))
        );
        this.menu.visible = false;


        this.resize();

        if (this.started || Const.Config.Dev) {
            this.start();
        } else {
            this.input.onDown.addOnce(() => this.start());
        }
    }

    private start() {
        this.tapToStart.visible = false;
        this.started = this.title.visible = this.menu.visible = true;
    }

    private showCredits(show = true) {
        this.credits.style.display = show ? "initial" : "";
        this.menu.setEnabled(!show);
        this.bg.inputEnabled = show;
    }

    private startGame() {
        this.camera.fade(0, Timer.SECOND * 1);
        this.camera.onFadeComplete.add(() => this.game.state.start(Const.States.Game));
    }

    resize(width?: number, height?: number) {
        this.game.scale.scaleSprite(this.bg).alignIn(this.camera.view, Phaser.CENTER);

        this.game.scale.scaleSprite(this.title as any, this.game.width * .8, this.game.height * .25, true);
        this.title.position.setTo(this.game.world.centerX, this.game.world.height * .15);

        this.game.scale.scaleSprite(this.tapToStart as any, this.game.width * .4, this.game.height * .3, true);
        this.tapToStart.alignIn(this.camera.view, Phaser.CENTER);

        if (this.menu) this.menu.resize();
    }

    render() {
        var i = this.menu.children[0];
        //this.game.debug.spriteBounds(i.platform);
        //this.game.debug.spriteBounds(this.credits);
        //this.game.debug.spriteBounds(this.credits.text); 
    }
}