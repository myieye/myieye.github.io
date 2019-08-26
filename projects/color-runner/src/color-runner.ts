import ScreenUtils from "./utils/utils";
import BootState from './states/boot-state';
import PreloaderState from "./states/preloader-state";
import GameState from "./states/game-state";
import { Const } from "./helpers/settings";

export class ColorRunnerGame extends Phaser.Game {

    private static instance: ColorRunnerGame;

    static get Instance() { return ColorRunnerGame.instance = (ColorRunnerGame.instance || new ColorRunnerGame()) };

    private constructor() {
        super(ScreenUtils.width(), ScreenUtils.height(), Phaser.CANVAS, 'game');
        this.state.add(Const.States.Boot, BootState);
        this.state.add(Const.States.Preloader, PreloaderState);
        this.state.add(Const.States.Game, GameState);
    }

    start() {
        this.state.start(Const.States.Boot);
    }
}