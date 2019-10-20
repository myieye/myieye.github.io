import { Group, Graphics, Game, Color } from "phaser-ce";
import Menu from "./menu";
import MenuItem from "./menu-item";
import { Const } from "../helpers/const";

export default class Popup extends Group {

    background: Graphics;

    constructor(game: Game) {
        super(game);
        this.visible = false;

        this.background = this.add(game.add.graphics());
        this.background
            .beginFill(Color.BLACK, .6)
            .drawRect(0, 0, game.width, game.height);

        this.add(this.game.add.existing(new Menu(
            game, .4, .2, 
            new MenuItem(game, "Main Menu", () => {
                game.paused = false;
                game.state.start(Const.States.MainMenu);
            }),
            new MenuItem(game, "Resume", () => {
                game.paused = false;
            }))));

        this.resize();
    }

    resize() {
        this.game.scale.scaleSprite(this.background as any);
    }
}