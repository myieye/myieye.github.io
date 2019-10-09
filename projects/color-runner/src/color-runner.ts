import BootState from './states/boot-state';
import PreloaderState from "./states/preloader-state";
import GameState from "./states/game-state";
import { Const } from "./helpers/const";
import { Game, CANVAS } from 'phaser-ce';

export class ColorRunnerGame extends Game {

    private static instance: ColorRunnerGame;

    static get Instance() { return ColorRunnerGame.instance = (ColorRunnerGame.instance || new ColorRunnerGame()) };

    private constructor() {
        super("100%", "100%", CANVAS, 'game');
        this.state.add(Const.States.Boot, BootState);
        this.state.add(Const.States.Preloader, PreloaderState);
        this.state.add(Const.States.Game, GameState);
    }

    start() {
        this.state.start(Const.States.Boot);
    }
}