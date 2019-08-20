(function (ColorRunner) {

    ColorRunner.settings = ColorRunner.settings || {};

    ColorRunner.settings = Object.assign(ColorRunner.settings, {
        startPlatforms: [
            {}, {}, {}, {}
        ],
        platformStartX: 200,
        platformStartY: 200,
        platformWidth: 100,
        platformHeight: 15,
        platformLoadBuffer: 350,
        defaultTint: 0x333333,
        defaultColors: [0xFD5308, 0x66B032, 0x0391CD, 0x800080, 0xFFFF00],
        startSpeed: 1.5,
        maxSpeed: 4,
        speedIncrement: .025,
        speedIncreaseInterval: 10,

        
    });

    var states = {
        boot: "Boot",
        preloader: "Preloader",
        menu: "Menu",
        game: "Game"
    };

    ColorRunner.const = {
        state: states,
        paths: {
            audio: "./assets/audio/"
        }
    };
    
    ColorRunner.audio = {
        formats: [ "m4a" ],
        songs: [
            { state: states.menu, file: "bensound-endlessmotion" },
            { state: states.game, file: "bensound-dubstep" },
            { state: states.game, file: "bensound-moose" },
            { state: states.game, file: "bensound-popdance" },
        ]
    };

})(ColorRunner = window.ColorRunner || {});