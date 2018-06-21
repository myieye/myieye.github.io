(function (ColorRunner) {

    ColorRunner.settings = ColorRunner.settings || {};

    ColorRunner.settings = Object.assign(ColorRunner.settings, {
        startWorldSize: {
            x: 20000, y: 320
        },
        startPlatforms: [
            {}, {}, {}, {}
        ],
        platformStartX: 50,
        platformY: 50,
        platformWidth: 100,
        platformLoadBuffer: 1000,
        defaultTint: 0x333333,
        defaultColors: [0xFD5308, 0x66B032, 0x0391CD],
        maxSpeed: 100,
        startSpeed: 50
    });

})(ColorRunner = window.ColorRunner || {});