import { Game, Math as PMath, Graphics, Sprite, Point, Group } from "phaser-ce";
import MathHelper from "../helpers/math-helper";
import { Const } from '../helpers/const';

export default class ColorJoystick extends Group {

    private pos: Point;
    private onColorChanged: OnColorChangedHandler;
    private currColor: number;
    private colors: any[];
    private border: Graphics;
    private colorPie: Graphics;
    private pin: Sprite;
    private dragger: Sprite;
    private wheel: Group;

    set enabled(enabled: boolean) { this.dragger.inputEnabled = enabled; }

    constructor(game: Game, onColorChanged: OnColorChangedHandler) {
        super(game);

        this.onColorChanged = onColorChanged;
        this.fixedToCamera = true;
        this.visible = false;

        this.wheel = this.add(game.add.group());

        // BORDER
        var border = this.border = this.wheel.add(game.add.graphics());
        border.lineStyle(10, 0xEFEFEF);
        border.arc(0, 0, Const.Joystick.Diameter / 2, -0.5, PMath.PI2, false);

        // COLOR PIE ----------------------------------------------
        this.colorPie = this.wheel.add(game.add.graphics());

        // PIN ---------------------------------
        var pin = this.pin = this.add(game.add.sprite(0, 0, Const.Images.Joystick.name));
        pin.anchor.set(0.5, 0.5);

        // DRAGGER ------------------------------
        var dragger = this.dragger = this.add(game.add.sprite(0, 0));
        dragger.anchor.set(0.5, 0.5);
        dragger.width = dragger.height = pin.width;
        dragger.inputEnabled = true;

        dragger.input.enableDrag(true);
        dragger.events.onDragStart.add((sprite, pointer) =>
            this.onDragStart(sprite, pointer), game);
        dragger.events.onDragStop.add((sprite, pointer) =>
            this.onDragStop(sprite, pointer), game);
        dragger.events.onDragUpdate.add((dragger, pointer, dragX, dragY, snapPoint) =>
            this.dragUpdate(dragger, pointer, dragX, dragY, snapPoint), game);

        this.resize();
    }

    setColors(colors: number[]) {
        this.colors = [];
        var sliceAngleRads = PMath.PI2 / colors.length;

        this.colorPie.clear();
        this.colorPie.lineStyle(0);
        this.visible = true;

        // Create the pie slices
        for (var i = 0; i < colors.length; i++) {
            this.colorPie.beginFill(colors[i]);

            var startAngle = PMath.PI2 - (i * sliceAngleRads);
            var endAngle = startAngle - sliceAngleRads;

            startAngle += colors.length < 3 ? 0.09 : 0.06; // Necessarry, because counterclockwise?

            //  True draws anticlockwise
            this.colorPie.arc(0, 0, Const.Joystick.Diameter / 2, startAngle, endAngle, true);

            this.colorPie.endFill();

            this.colors[i] = {
                color: colors[i],
                angle: endAngle
            };
        }
    }

    update() {
        this.resize();
    }

    resize() {
        var size = Math.min(
            PMath.clamp(this.wheel.width, Const.Joystick.MinDiameter, Const.Joystick.MaxDiameter),
            this.game.height / 2, this.game.width / 4);

        this.wheel.width = this.wheel.height = size;
        this.pin.width = this.pin.height = size * Const.Joystick.PinDiameterPercent;

        let xOffset = this.colorPie.getBounds().halfWidth + Math.min(Const.Joystick.Padding, this.game.width / 20);
        let yOffset = (this.colorPie.getBounds().halfWidth + Math.min(Const.Joystick.Padding, this.game.height / 20));

        this.cameraOffset.setTo(
            (this.game.camera.x + this.game.camera.width) - xOffset,
            (this.game.camera.y + this.game.camera.height) - yOffset);
    }

    onDragStart(sprite, pointer) {

    }

    onDragStop(sprite, pointer) {
        // Move dragger to pin
        this.dragger.x = this.pin.x;
        this.dragger.y = this.pin.y;

        // Tween dragger and pin to the start position
        this.game.add.tween(this.pin).to({ x: 0, y: 0 }, 20, null, true);
        this.game.add.tween(this.dragger).to({ x: 0, y: 0 }, 20, null, true);
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
        var zeroBasedX = MathHelper.getRelativeX(this.colorPie.x, this.dragger.x);
        var zeroBasedY = MathHelper.getRelativeY(this.colorPie.y, this.dragger.y);

        var h = Math.sqrt(Math.pow(zeroBasedX, 2) + Math.pow(zeroBasedY, 2));
        return h > this.radius;
    }

    movePinToRadius() {
        var normalVector = MathHelper
            .getRelativePoint(this.dragger.position, this.colorPie.position)
            .normalize();

        this.pin.x = normalVector.x * this.radius;
        this.pin.y = normalVector.y * this.radius;
    }

    movePinToDragger() {
        this.pin.x = this.dragger.x;
        this.pin.y = this.dragger.y;
    }

    getCurrAngle() {
        // nagative on top
        var angle = PMath.angleBetween(0, 0, this.pin.x, this.pin.y);

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

    onPhaseComplete() {
        this.currColor = Const.Color.DefaultPlayerTint;
    }

    private get radius(): number {
        return this.colorPie.getBounds().halfWidth;
    }
}

type OnColorChangedHandler = (color: number) => void;