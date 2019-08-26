import { Text, Group } from "phaser-ce";

export default class ScoreBoard extends Group {

    private score: number;
    private text: Text;

    constructor(game, x?, y?, width?, height?) {
        super(game);

        x = x || 10;
        y = y || 10;
        width = width || 60;
        height = height || 30;
        this.score = 0;

        this.fixedToCamera = true;
        this.cameraOffset.setTo(x, y);

        var background = game.add.graphics(0, 0);
        background.beginFill(0x000000, 0.2);
        background.drawRect(0, 0, width, height);

        var text = this.text = game.add.text(0, 0, this.score,
            { font: "bold 20px Arial", fill: "#fff", boundsAlignH: "right", boundsAlignV: "middle" });

        text.padding.set(5);
        text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        text.setTextBounds(0, 0, width, height + 10);

        this.addMultiple([background, text]);
    }

    increment() {
        this.text.text = (++this.score).toString();
    }
}