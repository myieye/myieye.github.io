import { Sprite, Game, Physics, Animation, Color, Timer } from 'phaser-ce';
import GameState from "../states/game-state";
import { Const } from "../helpers/const";
import Platform from './platform';

export default class Player extends Sprite {

    game: Game;
    gameState: GameState;
    collider: Sprite;

    private currColorStep:number;
    private numColorSteps = 20;

    private currPlatforms:Platform[] = [];

    private targetTint: number;

    get speed():number {
        if (this.is("run")) {
            return 1;
        } else if (this.is("jump")) {
            return this.currFrame < 2 ? .5
             : this.currFrame < 3 ? .75
             : this.currFrame < 7 ? 2.5
             : this.currFrame < 8 ? 1.8
             : this.currFrame < 9 ? 1.5
             : 1.2;
        } else {
            return 0;
        }
    }

    constructor(gameState: GameState, x:number, y:number) {
        super(gameState.game, x, y, "player", "fly/000");
        this.game = gameState.game;
        this.gameState = gameState;

        this.game.physics.enable(this, Physics.ARCADE);
        this.scale.setTo(0.4, 0.4);
        this.animations.add('run', Animation.generateFrameNames('run/', 0, 14, '', 3), 20, true, false);
        this.animations.add('fly', Animation.generateFrameNames('fly/', 0, 14, '', 3), 20, true, false);
        this.animations.add('stand', Animation.generateFrameNames('stand/', 0, 14, '', 3), 20, true, false);
        this.animations.add('jump', Animation.generateFrameNames('jump/', 0, 9, '', 3), 10, false, false);
        this.tint = Color.WHITE;

        var collider = this.collider = gameState.obj.add(this.game.add.sprite());
        this.game.physics.enable(collider, Physics.ARCADE);
        collider.body.allowGravity = false;
        collider.scale.setTo(0.4, 0.4);
        collider.body.syncBounds = true;
    }

    update() {
        if (this.gameState.gameLogic.hasLost) return;

        if (this.targetTint) {
            this.currColorStep += this.gameState.gameLogic.currSpeed / 1.5;
            if (this.currColorStep >= this.numColorSteps) {
                this.tint = this.targetTint
            } else {
                // This is nonsense, but the phaser code seems to have
                // bugs. E.g. in its bit shifting (js can't handle 0xFF000000 << 24)
                // That's the reason why we need to pass a low value as alpha?
                this.tint = Phaser.Color.interpolateColor(
                    this.tint, this.targetTint, this.numColorSteps,
                    Const.Color.ChangeSpeed / this.numColorSteps, 0)
            }
        }

        let onPlatforms = this.game.physics.arcade.collide(this, this.gameState.gameLogic.platforms);

        this.checkForMissedPlatform();
        this.currPlatforms = [];
        this.game.physics.arcade.overlap(
            this.collider, this.gameState.gameLogic.platforms,
            this.onPlatformCollision, null, this);
            
        if (this.is("stand") && onPlatforms) {
            this.run();
        }

        this.syncBody();

        if (this.is("fly")) {
            this.body.velocity.y = this.gameState.platformGroup.y - this.bottom + 20;
        } else if (this.is("jump", 3)) {
            this.body.velocity.y = -50;
        }
    }

    onChangeSpeed(newSpeed) {
        if (this.is("run")) {
            this.animations.currentAnim.speed = newSpeed * 7;
        }
    }

    setColor(color) {
        this.currColorStep = 0;
        this.targetTint = color;
    }

    getColor() {
        return this.tint;
    }

    run() {
        this.animations.play("run");
        this.onChangeSpeed(this.gameState.gameLogic.currSpeed);
        this.animations.currentAnim.setFrame(12, true);
        this.body.allowGravity = true;
    }

    flyUp() {
        this.animations.play("fly");
        this.body.allowGravity = false;
    }

    flyDown() {
        this.animations.play("fly");
        this.body.allowGravity = false;
    }

    stand() {
        this.animations.play("stand");
        this.body.allowGravity = true;
    }

    jump() {
        this.play("jump");
        this.events.onAnimationComplete.addOnce(() => this.run());
    }

    onPhaseComplete() {
        this.game.time.events.add(Timer.SECOND * 1, () => {
            this.setColor(Const.Color.DefaultPlayerTint);
            this.jump();
        });
    }

    private is(anim:string, frame?:number) {
        return this.animations.currentAnim.name === anim &&
            (frame === undefined || frame === this.currFrame);
    }

    private onPlatformCollision(_, platform:Sprite) {
        let platformGroup = platform.parent as Platform;
        if (platformGroup.number === 1) return;

        this.currPlatforms.push(platformGroup);

        if (this.is("fly")) {
            this.stand();
        }

        if (!platformGroup.matched && this.platformMatches(platform)) {
            this.gameState.gameLogic.onPlatformMatched(platformGroup);
        }
    }

    private platformMatches(platform) {
        return this.getColor() === platform.tint;
    }

    private checkForMissedPlatform() {
        for (var platform of this.currPlatforms) {
            let pPos = platform.getBounds();
            if (!platform.matched && !platform.missed &&
                pPos.x + pPos.width <= this.collider.getBounds().x) {
                this.gameState.gameLogic.onPlatformMissed(platform);
            }
        }
    }

    private syncBody() {
        let bounds = this.getBounds();
        const bodyPercent = .4;

        this.body.height = bounds.height - bounds.height * .12;
        this.body.width = bounds.width * bodyPercent;
        
        let bodyOffset = (bounds.width - this.body.width) / 2;
        this.body.offset.x = bodyOffset / this.scale.x;

        this.collider.width = this.width * bodyPercent;
        this.collider.y = this.y + this.height - 10;

        let colliderOffset = (this.width - this.collider.width) / 2;
        this.collider.x = this.x + colliderOffset;
    }

    private get currFrame():number {
        return this.animations.currentAnim && Number(this.animations.frameName.split("/")[1]);
    }
}