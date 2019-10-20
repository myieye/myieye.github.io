import { Group, Game } from "phaser-ce";
import MenuItem from "./menu-item";
import { Const } from '../helpers/const';

export default class Menu extends Group {

    private startPer: number;
    private sizePer: number;

    constructor(game: Game, startPer: number, sizePer: number, ...menuItems: MenuItem[]) {
        super(game);
        this.startPer = startPer;
        this.sizePer = sizePer;

        this.addMultiple(menuItems);

        this.resize();

        var itemX = menuItems[0];
        var spacePerItem = ((this.game.height * sizePer) - itemX.height) / menuItems.length;
        spacePerItem = Math.max(Math.min(itemX.height * 2, spacePerItem), itemX.height * 1.5);
        var startY = itemX.height / 2;

        menuItems.forEach((item, i) => {
            item.setColor(Const.Color.StartColors[i]);
            item.y = startY + i * spacePerItem;
        });

        this.resize();
    }

    resize() {
        this.game.scale.scaleSprite(this as any, this.game.width * .5, this.game.height * this.sizePer, true);
        this.position.setTo(this.game.world.centerX, this.game.height * this.startPer);
    }
}