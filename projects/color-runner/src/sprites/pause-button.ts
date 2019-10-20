import { Group, Game, Color, Graphics } from 'phaser-ce';

export default class PauseButton extends Group {

    private static readonly BAR_WIDTH = 6;
    private static readonly HEIGHT = 18;
    private static readonly SPACE = 6;

    private button: Graphics;

    constructor(game: Game) {
        super(game);

        this.inputEnableChildren = true;
        this.onChildInputDown.add(() => this.game.paused = true);

        this.button = this.add(this.game.add.graphics());
        this.button
            // pause bars
            .beginFill(Color.WHITE, .8)
            .drawRect(0, 0, PauseButton.BAR_WIDTH, PauseButton.HEIGHT)
            .drawRect(PauseButton.BAR_WIDTH + PauseButton.SPACE, 0, PauseButton.BAR_WIDTH, PauseButton.HEIGHT)
            // clickable background
            .beginFill(Color.WHITE, 0)
            .drawRect(0, 0, this.width, this.height);

    }
}