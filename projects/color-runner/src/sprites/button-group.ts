import { Group, Game } from "phaser-ce";
import Button from './button';
import { Const } from "../helpers/const";

export default class ButtonGroup extends Group {

    constructor(game:Game) {
        super(game);

        this.add(game.add.existing(new Button(game, 600, 400, Const.Color.StartColors[2], Const.Images.FlyIcon.name)));
        this.add(game.add.existing(new Button(game, 800, 800, Const.Color.StartColors[1], Const.Images.SnowflakeIcon.name)));
        this.add(game.add.existing(new Button(game, 400, 800, Const.Color.StartColors[0], Const.Images.StarIcon.name)));
    }
}