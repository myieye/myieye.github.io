define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Const;
    (function (Const) {
        var States;
        (function (States) {
            States["Boot"] = "Boot";
            States["Preloader"] = "Preloader";
            States["Menu"] = "Menu";
            States["Game"] = "Game";
        })(States = Const.States || (Const.States = {}));
        ;
        var Color;
        (function (Color) {
            Color.StartColors = [0xFD5308, 0x66B032, 0x0391CD, 0x800080, 0xFFFF00];
            Color.ChangeSpeed = 5;
        })(Color = Const.Color || (Const.Color = {}));
        var Speed;
        (function (Speed) {
            Speed.Start = 1.5;
            Speed.Max = 4;
            Speed.Increment = .025;
            Speed.IncreaseInterval = 3;
        })(Speed = Const.Speed || (Const.Speed = {}));
        var Platform;
        (function (Platform) {
            Platform.StartPlatforms = [
                null, null, null, null
            ];
            Platform.StartX = 200;
            Platform.StartY = 200;
            Platform.Width = 100;
            Platform.Height = 15;
            Platform.LoadBuffer = 450;
            Platform.DefaultTint = 0x333333;
            var Animation;
            (function (Animation) {
                Animation.LockDist = 60;
                Animation.DownSpeed = 700;
                Animation.LockSpeed = 200;
            })(Animation = Platform.Animation || (Platform.Animation = {}));
        })(Platform = Const.Platform || (Const.Platform = {}));
        var Path;
        (function (Path) {
            var Audio;
            (function (Audio) {
                var Base = "./assets/audio/";
                Audio.Songs = Base + "songs/";
                Audio.Effects = Base + "effects/";
            })(Audio = Path.Audio || (Path.Audio = {}));
        })(Path = Const.Path || (Const.Path = {}));
        var Audio;
        (function (Audio) {
            var Song = /** @class */ (function () {
                function Song() {
                }
                return Song;
            }());
            var Effect;
            (function (Effect) {
                Effect[Effect["PlatformSuccess"] = 0] = "PlatformSuccess";
            })(Effect || (Effect = {}));
            var EffectConfig = /** @class */ (function () {
                function EffectConfig() {
                }
                return EffectConfig;
            }());
            Audio.Formats = ["m4a"];
            Audio.Songs = [
                { state: States.Menu, file: "bensound-endlessmotion" },
                { state: States.Game, file: "bensound-dubstep" },
                { state: States.Game, file: "bensound-moose" },
                { state: States.Game, file: "bensound-popdance" }
            ];
            Audio.sounds = [
                { effect: Effect.PlatformSuccess, file: "platform_success" }
            ];
        })(Audio = Const.Audio || (Const.Audio = {}));
    })(Const = exports.Const || (exports.Const = {}));
});
//# sourceMappingURL=settings.js.map