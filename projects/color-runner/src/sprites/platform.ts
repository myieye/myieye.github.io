import { Sprite, Game, Physics, Easing, Group, Point } from 'phaser-ce';
import { Const } from "../helpers/const";
import { ColorRunnerGame } from '../color-runner';

export default class Platform extends Sprite {

    private static lastPlatform: Platform;

    target: Point;
    targetY: number;

    number: number;
    matched: boolean;
    missed: boolean;

    constructor(game, x, platformGroup?: Group, number?, tint = Const.Color.DefaultTint, animate = false) {
        super(game, x, 0, "platform");

        Platform.lastPlatform = this;

        this.target = new Point(x, 0);

        this.x = !animate ? x : x + Const.Platform.Animation.LockDist;
        if (animate && platformGroup) {
            this.y = - (platformGroup.y + Const.Platform.Size.Height);
        } else {
            this.y = 0;
        }

        game.physics.enable(this, Physics.ARCADE);
        this.body.allowGravity = false;
        this.body.immovable = true;
        this.body.syncBounds = true;
        this.tint = tint || Const.Color.DefaultTint;
        this.number = number;
        this.matched = this.tint == Const.Color.DefaultTint;

        if (animate) {
            this.animateIntoGame(game, x, 0);
        }
    }

    update() {
        // Make it collidable from after the "lock"
        let bounds = this.getBounds();
        const bodyWidthPercent = 1 - Const.Platform.Size.LockSizePerc;

        this.body.height = bounds.height;
        this.body.width = bounds.width * bodyWidthPercent;

        let bodyOffset = bounds.width * Const.Platform.Size.LockSizePerc;
        this.body.offset.x = bodyOffset / this.scale.x;
    }

    onMatched() {
        this.matched = true;
        this.tint = Const.Color.DefaultTint;
    }

    onMissed() {
        this.missed = true;
    }

    animateIntoGame(game: Game, x: number, y: number) {
        var up = game.add.tween(this)
            .to({ x: this.x, y: y },
                Const.Platform.Animation.DownSpeed,
                Easing.Quadratic.Out, true);

        var lockIn = game.add.tween(this)
            .to({ x: x, y: y },
                Const.Platform.Animation.LockSpeed);

        up.chain(lockIn);
        this.game;
    }

    static get width(): number {
        if (Platform.lastPlatform && Platform.lastPlatform.worldTransform) {
            return Platform.lastPlatform.getBounds().width;// / this.lastPlatform.worldScale.x;
        } else {
            return Const.Platform.Size.Width;
        }
    }

    static get height(): number {
        if (Platform.lastPlatform && Platform.lastPlatform.worldTransform) {
            return Platform.lastPlatform.getBounds().height / Platform.lastPlatform.worldScale.y;
        } else {
            return Const.Platform.Size.Height;
        }
    }
}