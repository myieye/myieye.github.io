export namespace Const {
    
    export enum States { Boot = "Boot", Preloader = "Preloader", Menu = "Menu", Game = "Game" };

    export namespace Color {
        export const StartColors = [0xFD5308, 0x66B032, 0x0391CD, 0x800080, 0xFFFF00];
        export const ChangeSpeed = 5;
    }

    export namespace Speed {
        export const Start = 1.5;
        export const Max = 4;
        export const Increment = .025;
        export const IncreaseInterval = 3;
    }

    export namespace Platform {
        export const StartPlatforms = [
            null, null, null, null
        ];

        export const StartX = 200;
        export const StartY = 200;
        export const Width = 100;
        export const Height = 15;
        export const LoadBuffer = 450;
        export const DefaultTint = 0x333333;

        export namespace Animation {
            export const LockDist = 60;
            export const DownSpeed = 700;
            export const LockSpeed = 200
        }
    }

    export namespace Path {
        export namespace Audio {
            const Base = "./assets/audio/";
            export const Songs = Base + "songs/";
            export const Effects = Base + "effects/";
        }
    }

    export namespace Audio {

        class Song {
            readonly state: string;
            readonly file: string;
        }

        enum Effect { PlatformSuccess }

        class EffectConfig {
            readonly effect: Effect;
            readonly file: string;
        }

        export const Formats = ["m4a"];
        export const Songs: Song[] = [
            { state: States.Menu, file: "bensound-endlessmotion" },
            { state: States.Game, file: "bensound-dubstep" },
            { state: States.Game, file: "bensound-moose" },
            { state: States.Game, file: "bensound-popdance" }
        ];
        export const sounds: EffectConfig[] = [
            { effect: Effect.PlatformSuccess, file: "platform_success" }
        ]
    }
}