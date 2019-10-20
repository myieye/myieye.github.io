import { Sprite, Particles, Game } from "phaser-ce";
import { Const } from "./const";

export default class ColorExploder {

    private static _instance:ColorExploder;
    static Instance(game:Game) {
        return ColorExploder._instance = (ColorExploder._instance || new ColorExploder(game));
    }

    private exploder: Particles.Arcade.Emitter;
    private emitter: Particles.Arcade.Emitter;
    private game:Game;
    
    private constructor(game:Game) {
        this.game = game;
        this.buildExploder();
    }

    explode(sprite:Sprite, color:number) {
        //sprite.parent.addChild(this.emitter);
        
        this.emitter.position.setTo(sprite.getBounds().centerX, sprite.getBounds().centerY);
        
        this.emitter.setSize(sprite.getBounds().width, sprite.getBounds().height);
        this.emitter.start(true, 5000, 100, 100);
        return;
        //
        //this.exploder.setSize(sprite.width, sprite.height);
        this.exploder.setSize(100, 50);
        //this.exploder.setSize(sprite.width, sprite.height);
        //this.exploder.position.setTo(sprite.width / 2, sprite.height / 2);
        //this.exploder.start(true, 2000, 50, 50);
        return;
        console.log(this.exploder.children);
        this.exploder.children.forEach((p) => (p as Sprite).tint == color);
        
    }

    private buildExploder() {
        this.emitter = this.game.add.emitter(0, 0);
        this.emitter.makeParticles(Const.Images.ColorExplosion.name);
        this.emitter
            .setRotation(.1, .5)
            .setScale(0.1, .2, 0.1, .2, 2000, Phaser.Easing.Quintic.Out);
        this.emitter.gravity.y = -200;

    
        this.exploder = this.game.add.emitter(0, 0);
        this.exploder.makeParticles(Const.Images.ColorExplosion.name);
        this.exploder
            .setRotation(.1, .5)
            .setScale(0.1, 1, 0.1, 1, 6000, Phaser.Easing.Quintic.Out);
        this.exploder.gravity.y = -200;
    }

}