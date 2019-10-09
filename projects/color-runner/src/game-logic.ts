import { Game, Group, Math as PMath, Color, Timer } from 'phaser-ce';
import Platform from './sprites/platform';
import GameState from './states/game-state';
import { Const, Phase } from './helpers/const';
import SoundHelper from './helpers/sound-helper';

export enum PhaseState { Unstarted, Play, Transition, Lost }

export default class GameLogic {

    private state: GameState;
    private game: Game;
    private platformGroup: Group;
    private soundHelper: SoundHelper;

    phaseState: PhaseState;
    currLife: number;
    currSpeed: number;
    currPhase: Phase;
    currPhaseNum: number;
    lastPlatform: Platform;
    currPlatformX: number;
    currNegPlatformY: number;
    colors: number[];

    constructor(gameState: GameState) {
        this.state = gameState;

        this.currLife = Const.Game.Life;
        this.phaseState = PhaseState.Unstarted;
    }

    initGame() {
        this.game = this.state.game;
        this.platformGroup = this.state.platformGroup;
        this.soundHelper = SoundHelper.Instance;

        this.currNegPlatformY = this.game.height - this.platformGroup.y;

        for (var tint of Const.Platform.StartPlatforms) {
            this.addPlatform(this.state.platformGroup, tint);
        }

        this.configureNextPhase();
    }

    startGame() {
        this.phaseState = PhaseState.Transition;
        this.game.time.events.add(Timer.SECOND, () => {
            this.startCurrentPhase();
        });
    }

    update() {
        if (this.currSpeed * this.state.player.speed) {
            if (this.playerOutOfBounds()) {
                this.state.platformGroup.removeAll(true);
                this.phaseState = PhaseState.Lost;
                this.game.time.events.add(Timer.SECOND * 2, () => this.state.restart());
            }
            
            this.platformGroup.x -= this.currSpeed * this.state.player.speed;

            if (this.phaseState !== PhaseState.Lost && this.lastPlatform && this.needNewPlatform()) {
                var tint = this.pickPlatformColor();
                this.addPlatform(this.platformGroup, tint, true);
            }
        }
    }

    private startCurrentPhase() {
        this.state.joystick.setColors(this.colors);
        this.state.score.init(this.colors, this.currPhase.target);

        this.state.shouter.text = "Phase " + this.currPhaseNum;
        this.game.time.events.add(Timer.SECOND * 3, () => {
            this.state.shouter.text = "";
            this.phaseState = PhaseState.Play;
        });
    }

    private configureNextPhase() {
        this.phaseState = PhaseState.Transition;
        this.currPhaseNum = (this.currPhaseNum || 0) + 1;

        this.colors = Const.Color.StartColors.slice()
            .concat(Const.Color.FutureColors.slice(0, Math.floor((this.currPhaseNum - 1) / 1)));

        let nextPhase = Const.Phase.Phases[this.currPhaseNum - 1];
        if (nextPhase) {
            this.currPhase = nextPhase;
        } else {
            this.currPhase = {
                speed: {
                    start: this.currPhase.speed.start * 1.05,
                    increment: this.currPhase.speed.increment * 1,
                    increaseInterval: this.currPhase.speed.increaseInterval
                },
                target: Math.ceil(this.currPhase.target * 1.1)
            }
        }

        this.currSpeed = this.currPhase.speed.start;
    }

    private addPlatform(platformGroup: Group, tint: number, animate = false) {
        var newPlatformX = this.lastPlatform
            ? this.lastPlatform.target.x + this.lastPlatform.width - Math.ceil(this.lastPlatform.width * Const.Platform.Size.LockSizePerc)
            : 0;

        var prevPlatformNumber = (this.lastPlatform && this.lastPlatform.number) || 0;
        this.lastPlatform = platformGroup.add(this.game.add.existing(
            new Platform(this.game,
                newPlatformX, platformGroup,
                prevPlatformNumber + 1, tint, animate)));
    }

    pickPlatformColor(): number {
        if (this.phaseState !== PhaseState.Play) {
            return Const.Color.DefaultTint;
        } else if (this.lastPlatform.tint != Const.Color.DefaultTint) {
            return this.game.rnd.pick(this.colors);
        } else {
            return this.game.rnd.pick(this.colors.filter((color) => color != Const.Color.DefaultTint));
        }
    }

    resize(forcedResize: boolean) {
        this.platformGroup.y = this.game.height / this.state.obj.scale.y - this.currLife * Platform.height;
        if (!forcedResize) {
            this.state.player.y = this.platformGroup.y - this.state.player.height;
        }
    }

    onPlatformMissed(platform) {
        this.onPlatformComplete(platform);
        this.currLife--;
        platform.parent.y += Const.Platform.Size.Height;
        this.state.player.y += Const.Platform.Size.Height;

        platform.onMissed();
    }

    onPlatformMatched(platform: Platform) {
        var color = platform.tint;

        platform.onMatched();
        this.onPlatformComplete(platform);
        this.soundHelper.onPlatformMatched();

        if (this.state.score.increment(color)) {
            if (this.onColorComplete(color) && this.allPlatformsComplete()) {
                this.onPhaseComplete();
            }
        }
    }

    onPhaseComplete() {
        this.state.shouter.text = this.game.rnd.pick(["Nice!", "Woohoo!", "Solid!", "Incredible!", "Great!"]);
        this.state.player.onPhaseComplete();
        this.game.time.events.add(Timer.SECOND * 2, () => {
            this.state.score.resetColors();
            this.configureNextPhase();
            this.startCurrentPhase();
        });
    }

    private needNewPlatform() {
        return this.state.player.getBounds().right + this.loadBuffer >
            this.platformGroup.toGlobal(this.lastPlatform.target).x;
    }

    private playerOutOfBounds() {
        var playerBottom = this.state.player.getBounds().bottom;
        var worldBottom = this.game.world.height;
        return Math.ceil(playerBottom) >= worldBottom;
    }

    private onPlatformComplete(platform) {
        if (platform.number % this.currPhase.speed.increaseInterval == 0) {
            this.currSpeed = PMath.clamp(
                this.currSpeed + this.currPhase.speed.increment,
                0, Const.Speed.Max);
            this.state.player.onChangeSpeed(this.currSpeed);
        }
    }

    private onColorComplete(color: number) {
        for (var i in this.colors) {
            if (this.colors[i] === color) {
                this.colors[i] = Const.Color.DefaultTint;
            }
        }
        return this.colors.reduce((others, curr) => others && curr === Const.Color.DefaultTint, true);
    }

    private allPlatformsComplete(): boolean {
        return this.platformGroup.children.reduce((others, curr: Platform) =>
            others && (curr.missed || curr.matched || curr.tint == Const.Color.DefaultTint), true);
    }

    get hasLost(): boolean {
        return this.phaseState === PhaseState.Lost;
    }

    get loadBuffer(): number {
        return Platform.width * Const.Platform.Foresight - this.loadSpace;
    }

    get loadSpace(): number {
        return Platform.width * 2;
    }
}