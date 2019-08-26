import { Sprite, Game } from "phaser-ce";
import { Const } from "../helpers/settings";

export default class Platform extends Sprite {

    targetX:number;
    targetY:number;

    number:number;
    matched:boolean;
    missed:boolean;

    constructor(game, x, y, number, tint, animate) {
        super(game, x, y);

        this.targetX = x;
        this.targetY = y;

        var createX = !animate ? x : x + Const.Platform.Animation.LockDist;
        var createY = !animate ? y : -Const.Platform.Height;

        Phaser.Sprite.call(this, game, createX, createY, 'platform');

        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.allowGravity = false;
        this.body.immovable = true;
        this.tint = tint || Const.Platform.DefaultTint;
        this.number = number;
        this.matched = this.tint == Const.Platform.DefaultTint;

        if (animate) {
            this.animateIntoGame(game, x, y);
        }
    }

    onMatched() {
        this.matched = true;
        this.tint = Const.Platform.DefaultTint;
    }

    onMissed() {
        this.missed = true;
    }

    animateIntoGame(game:Game, x:number, y:number) {
        var up = game.add.tween(this)
            .to({ x: this.x, y: y },
                Const.Platform.Animation.DownSpeed,
                Phaser.Easing.Quadratic.Out, true);

        var lockIn = game.add.tween(this)
            .to({ x: x, y: y },
                Const.Platform.Animation.LockSpeed);

        up.chain(lockIn);
    }
}