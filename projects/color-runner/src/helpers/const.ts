class Song {
    readonly state: string;
    readonly file: string;
}

export enum Effect { PlatformSuccess }

class EffectConfig {
    readonly effect: Effect;
    readonly file: string;
}

export class Image {
    readonly name: string;
    readonly file: string;
    readonly frameFile?: string;
}

export class Phase {
    readonly target: number;
    readonly speed: PhaseSpeed;
}

class PhaseSpeed {
    readonly start: number;
    readonly increment: number;
    readonly increaseInterval: number;
}

export namespace Const {

    export namespace Config {
        export const SkipTapToStart = true;
        export const DebugBackgrounds = false;
    }

    export enum States { Boot = "Boot", Preloader = "Preloader", MainMenu = "Menu", Game = "Game" };

    export namespace Game {
        export const Life = 3;
    }

    export namespace Images {
        export const Player: Image = { name: "player", file: "player/player.png", frameFile: "player/player.json" };
        export const Platform: Image = { name: "platform", file: "platform.gif" };
        export const PlatformGlow: Image = { name: "platform-glow", file: "platform-glow.png" };
        export const GameBackground_1: Image = { name: "game-bg-1", file: "backgrounds/space-scene_01.jpg" };
        export const GameBackground_2: Image = { name: "game-bg-2", file: "backgrounds/space-scene_02.jpg" };
        export const GameBackground_3: Image = { name: "game-bg-3", file: "backgrounds/space-scene_03.jpg" };
        export const GameBackground_4: Image = { name: "game-bg-4", file: "backgrounds/space-scene_04.jpg" };
        export const GameBackground_5: Image = { name: "game-bg-5", file: "backgrounds/space-scene_05.jpg" };
        export const GameBackground_6: Image = { name: "game-bg-6", file: "backgrounds/space-scene_06.jpg" };
        export const GameBackground_7: Image = { name: "game-bg-7", file: "backgrounds/space-scene_07.jpg" };
        export const MainMenuBackground: Image = { name: "main-menu-bg", file: "backgrounds/main-menu.jpg" };
        export const Joystick: Image = { name: "joystick", file: "joystick/joystick_white.png" };
        export const ColorExplosion: Image = { name: "color-explosion", file: "color-explosion.png" };
        export const ButtonFly: Image = { name: "button-fly", file: "buttons/button-fly.png" };
        export const ButtonFly_Pressed: Image = { name: "button-fly-pressed", file: "buttons/button-fly-pressed.png" };
        export const ButtonFreeze: Image = { name: "button-freeze", file: "buttons/button-freeze.png" };
        export const ButtonFreeze_Pressed: Image = { name: "button-freeze-pressed", file: "buttons/button-freeze-pressed.png" };
        export const ButtonRainbow: Image = { name: "button-rainbow", file: "buttons/button-rainbow.png" };
        export const ButtonRainbow_Pressed: Image = { name: "button-rainbow-pressed", file: "buttons/button-rainbow-pressed.png" };
        export const StarIcon: Image = { name: "star", file: "buttons/star-icon.png" };
        export const SnowflakeIcon: Image = { name: "snowflake", file: "buttons/snowflake-icon.png" };
        export const JumpIcon: Image = { name: "jump", file: "buttons/jump-icon.png" };
        export const FlyIcon: Image = { name: "fly", file: "buttons/fly-icon.png" };
    }

    export namespace Color {
        //export const StartColors = [0xFD5308, 0x66B032, 0x0391CD];//, 0x800080];//, 0xFFFF00];
        export const StartColors = [0xF700FE, 0x04A1D8, 0xFAFF29];//, 0x800080];//, 0xFFFF00];
        export const FutureColors = [0xDA1A3B, 0x1E38A1, 0xA800F5, 0x08ff56];
        export const ChangeSpeed = 20;
        export const DefaultPlatformTint = 0x333333;
        export const DefaultPlayerTint = 0xFFFFFF;
    }

    export namespace Score {
        export const Height = 60;
    }

    export namespace Speed {
        export const Max = 4;
    }

    export namespace Platform {
        export const StartPlatforms = [
            null, null, null, null, null//, Color.StartColors[6]//, null, 
        ];//.concat(...Color.StartColors).concat(...Color.FutureColors);

        export namespace Size {
            export const Width = 103;
            export const Height = 15;
            export const LockSize = 3;
            export const LockSizePerc = LockSize / Width;
        }

        export const StartX = -.5 * Size.Width;
        export const NegativeStartY = Size.Height * Game.Life;

        export const Foresight = 4;

        export namespace Animation {
            export const LockDist = 60;
            export const DownSpeed = 700;
            export const LockSpeed = 200;
        }
    }

    export namespace Joystick {
        export const MaxDiameter = 200;
        export const MinDiameter = 160;
        export const Diameter = 140;
        export const Padding = 30;
        export const PinDiameterPercent = .45;
        export const DefaultBorderColor = 0xEFEFEF;
    }

    export namespace Player {
        export namespace Size {
            export const Height = 65;
            export const Width = 100;
        }
        export const StartX =  Platform.Size.Width * 1.5;
        export const StartVerticalPadding = Size.Height * .2;
    }

    export namespace Path {
        export namespace Audio {
            const Base = "./assets/audio/";
            export const Songs = Base + "songs/";
            export const Sounds = Base + "effects/";
        }
        export const Image = "./assets/img/";
    }

    export namespace Audio {

        export const Formats = ["m4a", "mp3"];
        export const Songs: Song[] = [
            { state: States.MainMenu, file: "bensound-endlessmotion" },
            { state: States.Game, file: "bensound-dubstep" },
            { state: States.Game, file: "bensound-moose" },
            { state: States.Game, file: "bensound-popdance" }
        ];
        export const Sounds: EffectConfig[] = [
            { effect: Effect.PlatformSuccess, file: "platform_success" }
        ]
    }

    export namespace PowerButton {
        export namespace GroupSize {
            export const MaxSize = 120;
        }
    }

    export namespace Phase {

        class Helpers {
            static phaseSpeed(options?: {start?:number, increment?:number, increaseInterval?:number}): PhaseSpeed {
                return {
                    start: (options && options.start) || 1.5,
                    increment: (options && options.increment) || .025,
                    increaseInterval: (options && options.increaseInterval) || 3
                };
            }

        }
        export const Phases: Phase[] = [
            {
                target: 1,
                speed: Helpers.phaseSpeed()
            },
            {
                target: 2,
                speed: Helpers.phaseSpeed({ start: 2 })
            }
        ]
    }
}