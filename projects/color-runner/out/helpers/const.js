define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Song = /** @class */ (function () {
        function Song() {
        }
        return Song;
    }());
    var Effect;
    (function (Effect) {
        Effect[Effect["PlatformSuccess"] = 0] = "PlatformSuccess";
    })(Effect = exports.Effect || (exports.Effect = {}));
    var EffectConfig = /** @class */ (function () {
        function EffectConfig() {
        }
        return EffectConfig;
    }());
    var Image = /** @class */ (function () {
        function Image() {
        }
        return Image;
    }());
    exports.Image = Image;
    var Phase = /** @class */ (function () {
        function Phase() {
        }
        return Phase;
    }());
    exports.Phase = Phase;
    var PhaseSpeed = /** @class */ (function () {
        function PhaseSpeed() {
        }
        return PhaseSpeed;
    }());
    var Const;
    (function (Const) {
        var Config;
        (function (Config) {
            Config.SkipTapToStart = true;
            Config.DebugBackgrounds = false;
        })(Config = Const.Config || (Const.Config = {}));
        var States;
        (function (States) {
            States["Boot"] = "Boot";
            States["Preloader"] = "Preloader";
            States["MainMenu"] = "Menu";
            States["Game"] = "Game";
        })(States = Const.States || (Const.States = {}));
        ;
        var Game;
        (function (Game) {
            Game.Life = 3;
        })(Game = Const.Game || (Const.Game = {}));
        var Images;
        (function (Images) {
            Images.Player = { name: "player", file: "player/player.png", frameFile: "player/player.json" };
            Images.Platform = { name: "platform", file: "platform.gif" };
            Images.PlatformGlow = { name: "platform-glow", file: "platform-glow.png" };
            Images.GameBackground_1 = { name: "game-bg-1", file: "backgrounds/space-scene_01.jpg" };
            Images.GameBackground_2 = { name: "game-bg-2", file: "backgrounds/space-scene_02.jpg" };
            Images.GameBackground_3 = { name: "game-bg-3", file: "backgrounds/space-scene_03.jpg" };
            Images.GameBackground_4 = { name: "game-bg-4", file: "backgrounds/space-scene_04.jpg" };
            Images.GameBackground_5 = { name: "game-bg-5", file: "backgrounds/space-scene_05.jpg" };
            Images.GameBackground_6 = { name: "game-bg-6", file: "backgrounds/space-scene_06.jpg" };
            Images.GameBackground_7 = { name: "game-bg-7", file: "backgrounds/space-scene_07.jpg" };
            Images.MainMenuBackground = { name: "main-menu-bg", file: "backgrounds/main-menu.jpg" };
            Images.Joystick = { name: "joystick", file: "joystick/joystick_white.png" };
            Images.ColorExplosion = { name: "color-explosion", file: "color-explosion.png" };
            Images.Button = { name: "button", file: "button.png" };
            Images.ButtonPressed = { name: "button-pressed", file: "button-pressed.png" };
            Images.StarIcon = { name: "star", file: "star.png" };
            Images.SnowflakeIcon = { name: "snowflake", file: "snowflake.png" };
            Images.JumpIcon = { name: "jump", file: "jump-icon.png" };
            Images.FlyIcon = { name: "fly", file: "fly-icon.png" };
        })(Images = Const.Images || (Const.Images = {}));
        var Color;
        (function (Color) {
            //export const StartColors = [0xFD5308, 0x66B032, 0x0391CD];//, 0x800080];//, 0xFFFF00];
            Color.StartColors = [0xF700FE, 0x04A1D8, 0xFAFF29]; //, 0x800080];//, 0xFFFF00];
            Color.FutureColors = [0xDA1A3B, 0x1E38A1, 0xA800F5, 0x08ff56];
            Color.ChangeSpeed = 20;
            Color.DefaultPlatformTint = 0x333333;
            Color.DefaultPlayerTint = 0xFFFFFF;
        })(Color = Const.Color || (Const.Color = {}));
        var Score;
        (function (Score) {
            Score.Height = 60;
        })(Score = Const.Score || (Const.Score = {}));
        var Speed;
        (function (Speed) {
            Speed.Max = 4;
        })(Speed = Const.Speed || (Const.Speed = {}));
        var Platform;
        (function (Platform) {
            Platform.StartPlatforms = [
                null, null, null //, Color.StartColors[6]//, null, 
            ]; //.concat(...Color.StartColors).concat(...Color.FutureColors);
            var Size;
            (function (Size) {
                Size.Width = 103;
                Size.Height = 15;
                Size.LockSize = 3;
                Size.LockSizePerc = Size.LockSize / Size.Width;
            })(Size = Platform.Size || (Platform.Size = {}));
            Platform.StartX = -.5 * Size.Width;
            Platform.NegativeStartY = Size.Height * Game.Life;
            Platform.Foresight = 4;
            var Animation;
            (function (Animation) {
                Animation.LockDist = 60;
                Animation.DownSpeed = 700;
                Animation.LockSpeed = 200;
            })(Animation = Platform.Animation || (Platform.Animation = {}));
        })(Platform = Const.Platform || (Const.Platform = {}));
        var Joystick;
        (function (Joystick) {
            Joystick.MaxDiameter = 200;
            Joystick.MinDiameter = 160;
            Joystick.Diameter = 140;
            Joystick.Padding = 30;
            Joystick.PinDiameterPercent = .45;
            Joystick.DefaultBorderColor = 0xEFEFEF;
        })(Joystick = Const.Joystick || (Const.Joystick = {}));
        var Player;
        (function (Player) {
            var Size;
            (function (Size) {
                Size.Height = 65;
                Size.Width = 100;
            })(Size = Player.Size || (Player.Size = {}));
            Player.StartX = 0; //Platform.StartX;// + Platform.Size.Width / 2;
            Player.StartVerticalPadding = Size.Height * .2;
        })(Player = Const.Player || (Const.Player = {}));
        var Path;
        (function (Path) {
            var Audio;
            (function (Audio) {
                var Base = "./assets/audio/";
                Audio.Songs = Base + "songs/";
                Audio.Sounds = Base + "effects/";
            })(Audio = Path.Audio || (Path.Audio = {}));
            Path.Image = "./assets/img/";
        })(Path = Const.Path || (Const.Path = {}));
        var Audio;
        (function (Audio) {
            Audio.Formats = ["m4a", "mp3"];
            Audio.Songs = [
                { state: States.MainMenu, file: "bensound-endlessmotion" },
                { state: States.Game, file: "bensound-dubstep" },
                { state: States.Game, file: "bensound-moose" },
                { state: States.Game, file: "bensound-popdance" }
            ];
            Audio.Sounds = [
                { effect: Effect.PlatformSuccess, file: "platform_success" }
            ];
        })(Audio = Const.Audio || (Const.Audio = {}));
        var Phase;
        (function (Phase) {
            var Helpers = /** @class */ (function () {
                function Helpers() {
                }
                Helpers.phaseSpeed = function (options) {
                    return {
                        start: (options && options.start) || 1.5,
                        increment: (options && options.increment) || .025,
                        increaseInterval: (options && options.increaseInterval) || 3
                    };
                };
                return Helpers;
            }());
            Phase.Phases = [
                {
                    target: 1,
                    speed: Helpers.phaseSpeed()
                },
                {
                    target: 2,
                    speed: Helpers.phaseSpeed({ start: 2 })
                }
            ];
        })(Phase = Const.Phase || (Const.Phase = {}));
    })(Const = exports.Const || (exports.Const = {}));
});
//# sourceMappingURL=const.js.map