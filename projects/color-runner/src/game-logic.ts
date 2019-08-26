import { Game, Group, Math as PMath } from 'phaser-ce';
import Platform from './sprites/platform';
import GameState from './states/game-state';
import { Const } from './helpers/settings';

export default class GameLogic {

    readonly game: Game;
    readonly gameState: GameState;

    lastPlatform: Platform;
    currPlatformX: number;
    currPlatformY: number;
    colors = Const.Color.StartColors;

    constructor(gameState: GameState) {
        this.gameState = gameState;
        this.game = gameState.game;
    }

    initGame() {
        this.currPlatformY = this.gameState.world.height - Const.Platform.StartY;
        var startPlatforms = Const.Platform.StartPlatforms;

        for (var tint of startPlatforms) {
            this.addPlatform(this.gameState.platformGroup, tint);
        }
    }

    private addPlatform(platformGroup: Group, tint: number, animate = false) {
        var newPlatformX = this.lastPlatform
            ? this.lastPlatform.targetX + Const.Platform.Width
            : Const.Platform.StartX;

        var platformNumber = (this.lastPlatform && this.lastPlatform.number) || 1;
        this.lastPlatform = platformGroup.add(this.game.add.existing(
            new Platform(this.game,
                newPlatformX, this.currPlatformY,
                platformNumber, tint, animate)));
    }

    update(game, platformGroup) {
        if (this.gameState.started && this.lastPlatform && (this.lastPlatform.worldPosition.x < Const.Platform.LoadBuffer)) {
            var tint = game.rnd.pick(this.colors);
            this.addPlatform(platformGroup, tint, true);
        }
        
        platformGroup.x -= this.gameState.currSpeed;
    }

    getColorWheelHexColors() {
        return this.colors;
    }

    onPlatformMissed(platform) {
        this.onPlatformComplete(platform)

        platform.parent.y += Const.Platform.Height;
        this.gameState.player.y += Const.Platform.Height;

        platform.onMissed();
    }

    onPlatformMatched(platform) {
        this.onPlatformComplete(platform);
        this.gameState.score.increment();
        platform.onMatched();
    }

    private onPlatformComplete(platform) {
        if (platform.number % Const.Speed.IncreaseInterval == 0) {
            this.gameState.currSpeed = PMath.clamp(
                this.gameState.currSpeed + Const.Speed.Increment,
                0, Const.Speed.Max);
        }
    }
}