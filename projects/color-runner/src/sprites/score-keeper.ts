import { Group, Game, Color } from "phaser-ce";
import ScoreBars from './score-bars';
import ScoreTicker from './score-ticker';
import { ScreenUtils } from '../utils/utils';
import { Const } from "../helpers/const";

export default class ScoreKeeper extends Group {

    private target:number;
    private points:number[];
    private scoreTicker:ScoreTicker;
    private scoreBars:ScoreBars;

    constructor(game:Game) {
        super(game);

        this.x = 0; this.y = 0;
        this.fixedToCamera = true;
        this.cameraOffset.setTo(0, 0);

        var height = Const.Score.Height;
        var tickerWidth = 90;
        var borderWidth = 6;

        var background = game.add.graphics(0, 0, this);
        background
            .lineStyle(borderWidth, Color.BLACK)
            .moveTo(0, height)
            .lineTo(ScreenUtils.width(), height)
            .moveTo(tickerWidth, 0)
            .lineTo(tickerWidth, height)
            .beginFill(Color.BLACK, 0.4)
            .lineStyle(0)
            .drawRect(0, 0, ScreenUtils.width(), height);

        this.scoreTicker = new ScoreTicker(game, tickerWidth, height);
        this.scoreBars = new ScoreBars(game, tickerWidth + borderWidth / 2, 0,
            ScreenUtils.width() - tickerWidth, height - borderWidth / 2);
        this.addMultiple([background, this.scoreTicker, this.scoreBars]);
    }

    init(colors:number[], target:number) {
        this.scoreBars.init(colors);
        this.points = [];
        this.target = target;

        for (var color of colors) {
            this.points[color] = 0;
        }
    }

    increment(color:number) {
        this.points[color]++;
        this.scoreBars.setColor(color, this.points[color]/this.target);
        this.scoreTicker.increment();
        return this.points[color] >= this.target;
    }

    resetColors() {
        this.scoreBars.reset();
    }
}