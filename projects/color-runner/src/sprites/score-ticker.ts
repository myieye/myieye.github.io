import { Text, Group, Game } from 'phaser-ce';

export default class ScoreTicker extends Group {

    private score: number;
    private text: Text;

    constructor(game:Game, width, height) {
        super(game);
        
        this.score = 0;

        var text = this.text = game.add.text(0, 0, this.score.toString(),
            { font: "bold 25px Arial", fill: "#fff", boundsAlignH: "right", boundsAlignV: "middle" });

        //text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        text.setTextBounds(0, 0, width - 10, height + 10);

        this.add(text);
    }

    increment() {
        this.text.text = (++this.score).toString();
    }
}