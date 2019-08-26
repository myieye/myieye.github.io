import { Game, Math as PMath, Graphics, Sprite, Point } from "phaser-ce";
import MathHelper from "../helpers/math-helper";

export default class ColorJoystick extends Sprite {

    private pos:Point;
    private radius: number;
    private onColorChanged:OnColorChangedHandler;
    private currColor:number;
    private colors:any[];
    private border:Graphics;
    private colorPie:Graphics;
    private pin:Sprite;
    private dragger:Sprite;

    constructor(game:Game, x, y, radius, pinRadius, colors, onColorChanged:OnColorChangedHandler) {
        super(game, x, y);
        
        // Save settings
        var pos = this.pos = new Point(x, y);
        this.radius = radius;

        this.onColorChanged = onColorChanged;
        this.currColor = colors[0];
        this.colors = [];

        // BORDER
        var border = this.border = game.add.graphics();
        border.lineStyle(10, 0xFFFFFF);
        border.arc(0, 0, radius, -0.5, PMath.PI2, false);
        // Position Relative to camera
        border.fixedToCamera = true;
        border.cameraOffset.setTo(pos.x, pos.y);

        // COLOR PIE ----------------------------------------------
        var colorPie = this.colorPie = game.add.graphics();

        var sliceAngleRads = PMath.PI2 / colors.length;

        //  Reset lineStyle
        colorPie.lineStyle(0);

        // Create the pie slices
        for (var i = 0; i < colors.length; i++) {
            colorPie.beginFill(colors[i]);

            var startAngle = PMath.PI2 - (i * sliceAngleRads);
            var endAngle = startAngle - sliceAngleRads;

            startAngle += 0.06; // Necessarry, because counterclockwise

            //  True draws anticlockwise
            colorPie.arc(0, 0, radius, startAngle, endAngle, true);

            colorPie.endFill();

            this.colors[i] = {
                color: colors[i],
                angle: endAngle
            };
        }

        // Position Relative to camera
        colorPie.fixedToCamera = true;
        colorPie.cameraOffset.setTo(pos.x, pos.y);


        // PIN ---------------------------------
        var pin = this.pin = game.add.sprite(pos.x, pos.y, "joystick");
        pin.anchor.set(0.5, 0.5);
        pin.width = pin.height = pinRadius * 2;
        pin.fixedToCamera = true;


        // DRAGGER ------------------------------
        var dragger = this.dragger = game.add.sprite(pos.x, pos.y, null);
        dragger.anchor.set(0.5, 0.5);
        dragger.width = dragger.height = pin.width;
        dragger.fixedToCamera = true;
        dragger.inputEnabled = true;

        dragger.input.enableDrag(true);
        dragger.events.onDragStart.add((sprite, pointer) =>
            this.onDragStart(sprite, pointer), game);
        dragger.events.onDragStop.add((sprite, pointer) =>
            this.onDragStop(sprite, pointer), game);
        dragger.events.onDragUpdate.add((dragger, pointer, dragX, dragY, snapPoint) =>
            this.dragUpdate(dragger, pointer, dragX, dragY, snapPoint), game);
    }

    onDragStart(sprite, pointer) {

    }

    onDragStop(sprite, pointer) {
        // Move dragger to pin
        this.dragger.cameraOffset.x = this.pin.cameraOffset.x;
        this.dragger.cameraOffset.y = this.pin.cameraOffset.y;

        // Tween dragger and pin to the start position
        this.game.add.tween(this.pin.cameraOffset).to(this.pos, 20, null, true);
        this.game.add.tween(this.dragger.cameraOffset).to(this.pos, 20, null, true);
    }

    dragUpdate(dragger, pointer, dragX, dragY, snapPoint) {
        // Move pin
        if (this.draggerOutsideOfRadius()) {
            this.movePinToRadius();
        } else { // move pin to dragger
            this.movePinToDragger();
        }

        // Check for color change
        var angle = this.getCurrAngle();
        var selectedColor = this.getColorForAngle(angle);
        if (selectedColor !== this.currColor) {
            this.currColor = selectedColor;
            this.border.tint = this.currColor;
            this.onColorChanged(this.currColor);
        }
    }

    draggerOutsideOfRadius() {
        var zeroBasedX = MathHelper.getZeroBasedX(this.colorPie.x, this.dragger.x);
        var zeroBasedY = MathHelper.getZeroBasedY(this.colorPie.y, this.dragger.y);

        var h = Math.sqrt(Math.pow(zeroBasedX, 2) + Math.pow(zeroBasedY, 2));

        return h > this.radius;
    }

    movePinToRadius() {
        var zeroBasedX = MathHelper.getZeroBasedX(this.colorPie.cameraOffset.x, this.dragger.cameraOffset.x);
        var zeroBasedY = MathHelper.getZeroBasedY(this.colorPie.cameraOffset.y, this.dragger.cameraOffset.y);

        var normalVector = MathHelper.getNormalizedVector({ x: zeroBasedX, y: zeroBasedY });

        var zeroBasedVectorOnRadius = {
            x: normalVector.x * this.radius,
            y: normalVector.y * this.radius
        }

        var relativeVector = MathHelper.getRelativeVector(
            zeroBasedVectorOnRadius, this.pos);

        this.pin.cameraOffset.x = relativeVector.x;
        this.pin.cameraOffset.y = relativeVector.y;
    }

    movePinToDragger() {
        this.pin.cameraOffset.x = this.dragger.cameraOffset.x;
        this.pin.cameraOffset.y = this.dragger.cameraOffset.y;
    }

    getCurrAngle() {
        // nagative on top
        var angle = PMath.angleBetweenPoints(this.pos, this.pin.cameraOffset);

        // Convert to 360 degrees
        if (angle < 0)
            angle = Math.PI + (Math.PI + angle);

        return angle;
    }

    getColorForAngle(angle) {
        for (var i = 0; i < this.colors.length; i++) {
            if (angle > this.colors[i].angle) {
                return this.colors[i].color;
            }
        }
    }
}

type OnColorChangedHandler = (color:number) => void;