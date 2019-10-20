import { Sprite, Game, Physics, Easing, Group, Point, Particles } from 'phaser-ce';
import { Const } from "../helpers/const";
import ColorExploder from '../helpers/color-exploder';

export default class Platform extends Group {

    private static lastPlatform: Sprite;

    target: Point;
    targetY: number;

    number: number;
    matched: boolean;
    missed: boolean;

    get tint(): number { return this.platform.tint; }

    platform: Sprite;
    private glow: Sprite;

    constructor(game, x, platformGroup?: Group, number?, tint = Const.Color.DefaultPlatformTint, animate = false) {
        super(game);

        this.x = x;
        this.y = 0;
        this.platform = this.add(new Sprite(game, 0, 0, Const.Images.Platform.name));
        this.platform.smoothed = false;

        Platform.lastPlatform = this.platform;

        this.target = new Point(x, 0);

        this.x = !animate ? x : x + Const.Platform.Animation.LockDist;
        if (animate && platformGroup) {
            this.y = - (platformGroup.y + Const.Platform.Size.Height);
        } else {
            this.y = 0;
        }

        game.physics.enable(this, Physics.ARCADE);
        this.platform.body.allowGravity = false;
        this.platform.body.immovable = true;
        this.platform.body.syncBounds = true;
        this.platform.tint = tint || Const.Color.DefaultPlatformTint;
        this.number = number;
        this.matched = this.platform.tint == Const.Color.DefaultPlatformTint;

        if (this.platform.tint !== Const.Color.DefaultPlatformTint) {
            this.glow = new Sprite(game, this.x + Const.Platform.Size.LockSize + this.width / 2, 0, "platform-glow");
            this.glow.width = Const.Platform.Size.Width - Const.Platform.Size.LockSize;
            this.glow.anchor.setTo(.5, 1);
            this.add(this.glow);
            this.glow.tint = this.platform.tint;
        }

        if (animate) {
            this.animateIntoGame(game, x, 0);
        }
    }

    update() {
        // Make it collidable from after the "lock"
        let bounds = this.getBounds();
        const bodyWidthPercent = 1 - Const.Platform.Size.LockSizePerc;

        this.platform.body.height = bounds.height;
        this.platform.body.width = bounds.width * bodyWidthPercent;

        let bodyOffset = bounds.width * Const.Platform.Size.LockSizePerc;
        this.platform.body.offset.x = bodyOffset / this.scale.x;

        if (this.glow) {
            this.glow.x = this.platform.centerX;
            this.glow.y = this.platform.y;
        }

        if (this.getBounds().right < -100) {
            this.destroy();
        }
    }

    onMatched() {
        this.matched = true;
        if (this.glow) {
            ColorExploder.Instance(this.game).explode(this.platform, this.tint);
            this.game.add.tween(this.glow)
                .to({ width: this.glow.width * .3, height: 0 },
                    500, Easing.Elastic.In, true)
                .onComplete.addOnce(() => this.platform.tint = Const.Color.DefaultPlatformTint);
        } else {
            this.platform.tint = Const.Color.DefaultPlatformTint;
        }
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

        if (this.glow) {
            this.glow.height = 0;
            this.glow.width = this.platform.width * .3;
            var addGlow = game.add.tween(this.glow)
                .to({ height: this.height * .9, width: this.platform.width * (1 - Const.Platform.Size.LockSizePerc) },
                    500, Easing.Quadratic.Out);
            up.chain(lockIn, addGlow);
        } else {
            up.chain(lockIn);
        }
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