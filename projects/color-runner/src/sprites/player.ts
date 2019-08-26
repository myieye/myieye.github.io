import { Sprite, Game } from "phaser-ce";
import GameState from "../states/game-state";
import { Const } from "../helpers/settings";

export default class Player extends Sprite {

    game: Game;
    gameState: GameState;
    collider: Sprite;

    private currPlatforms = [];

    private targetTint: number;

    constructor(gameState: GameState, x:number, y:number) {
        super(gameState.game, x, y, "player", "default/000");
        this.game = gameState.game;
        this.gameState = gameState;

        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.scale.setTo(0.4, 0.4);
        this.body.setSize(120, 160);
        //this.anchor.set(0.5, 1);

        this.animations.add('walk', Phaser.Animation.generateFrameNames('default/', 0, 8, '', 3), 20, true, false);

        var collider = this.collider = this.game.add.sprite();
        this.game.physics.enable(collider, Phaser.Physics.ARCADE);
        collider.scale.setTo(0.4, 0.4);
        collider.body.allowGravity = false;
        collider.body.setSize(this.body.width * .5, Const.Platform.Height);
        //collider.anchor.set(1, 1);

        this.tint = 0xFFFFFF;
    }

    update() {
        if (this.targetTint) {
            this.tint = Phaser.Color.interpolateColor(
                this.tint, this.targetTint, 100,
                Const.Color.ChangeSpeed, 1)
        }

        this.collider.x = this.x + (this.width * this.scale.x);
        this.collider.y = this.y + this.height;

        this.game.physics.arcade.collide(this, this.gameState.platformGroup);

        this.checkForMissedPlatform();
        this.currPlatforms = [];
        this.game.physics.arcade.overlap(
            this.collider, this.gameState.platformGroup,
            this.onPlatformCollision, null, this);

    }

    setColor(color) {
        this.targetTint = color;
    }

    getColor() {
        return this.targetTint || this.tint;
    }

    walk() {
        this.animations.play("walk");
    }

    onPlatformCollision(_, platform) {
        this.currPlatforms.push(platform);

        if (!platform.matched && this.platformMatches(platform)) {
            this.gameState.gameLogic.onPlatformMatched(platform);
        }
    }

    platformMatches(platform) {
        return this.getColor() === platform.tint;
    }

    checkForMissedPlatform() {
        for (var platform of this.currPlatforms) {
            if (!platform.matched && !platform.missed &&
                platform.worldPosition.x + platform.width <= this.collider.x) {
                this.gameState.gameLogic.onPlatformMissed(platform);
            }
        }
    }
}