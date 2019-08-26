import { SoundManager, Game } from "phaser-ce";
import { Const } from "./settings";

export default class SoundHelper {

    game: Game;
    soundManager: SoundManager;
    currSong: Phaser.Sound;
    songs: Phaser.Sound[] = [];

    private static instance: SoundHelper;
    static get Instance(): SoundHelper {
        return SoundHelper.instance = (SoundHelper.instance || new SoundHelper());
    }

    private constructor() { }

    init(game: Game) {
        this.game = game;
    }

    preload() {
        Const.Audio.Songs.forEach(song => {
            var files = Const.Audio.Formats.map(format =>
                Const.Path.Audio.Songs + song.file + "." + format
            );
            this.game.load.audio(song.file, files);
        });
    }

    create() {
        var soundManager = this.soundManager = new Phaser.SoundManager(this.game);
        soundManager.boot();
        Const.Audio.Songs.forEach(song => this.songs[song.file] = soundManager.add(song.file));

        this.game.state.onStateChange.add(this.onStateChange, this);

        var startSoundHandle = setInterval(() => {
            if (this.currSong && !this.currSong.isPlaying) {
                this.playCurrentSong();
            } else {
                clearInterval(startSoundHandle);
            }
        }, 100);
    }

    private onStateChange(curr: string, prev: string) {
        this.currSong = this.chooseSongForState(curr);
        if (this.currSong) {
            this.playCurrentSong();
        }
    }

    private chooseSongForState(state: string): Phaser.Sound {
        var songsForState = Const.Audio.Songs.filter(song => song.state === state);
        var song = this.game.rnd.pick(songsForState);
        return song && this.songs[song.file];
    }

    private playCurrentSong() {
        if (!this.currSong.isPlaying) {
            this.soundManager.stopAll();
            this.currSong.play();
        }
    }
}