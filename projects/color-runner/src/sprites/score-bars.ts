import { Group, Game, Graphics } from "phaser-ce";

export default class ScoreBars extends Group {

    private xSpace:number;
    private ySpace:number;
    private bars:ScoreBar[];

    constructor(game:Game, x:number, y:number, width:number, height:number) {
        super(game);

        this.x = x;
        this.y = y;
        this.xSpace = width;
        this.ySpace = height;
    }

    init(colors:number[]) {
        this.bars = [];
        
        var barHeight = this.ySpace / colors.length;
        var currY = this.y;

        for(var color of colors) {
            var bar = this.game.add.graphics(0, currY, this);
            
            bar.tint = color;
            bar.lineColor = color;
            bar.boundsPadding = 0;

            this.bars[color] = {
                width: 0,
                height: barHeight,
                bar: this.add(bar)
            };
            currY += barHeight;
        }

        this.render();
    }

    render() {
        for (var i in this.bars) {
            let scoreBar = this.bars[i];
            if (!scoreBar.bar.width) {
                scoreBar.bar.beginFill(scoreBar.bar.tint);
                scoreBar.bar.drawRect(0, 0, 1, scoreBar.height);
            }
            this.game.add.tween(scoreBar.bar).to({width: scoreBar.width}, 400, undefined, true);
        }
    }

    setColor(color:number, percent:number) {
        var bar = this.bars[color];
        bar.width = this.xSpace * percent;
        this.render();
    }

    reset() {
        for (var color of Object.keys(this.bars)) {
            this.bars[color].width = 0;
        }
        this.render();
    }
}

interface ScoreBar {
    width:number;
    height:number;
    bar:Graphics;
}