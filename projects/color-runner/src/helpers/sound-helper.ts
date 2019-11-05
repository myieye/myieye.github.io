import { SoundManager, Game, Sound } from "phaser-ce";
import { Const, Effect } from "./const";

export default class SoundHelper {

    private static instance: SoundHelper;
    static get Instance(): SoundHelper {
        return SoundHelper.instance = (SoundHelper.instance || new SoundHelper());
    }

    game: Game;
    soundManager: SoundManager;
    currSong: Sound;
    songs: Sound[] = [];
    sounds: { [index: string]: Sound } = {};

    private constructor() { }

    init(game: Game) {
        this.game = game;

        Const.Audio.Songs.forEach(song => {
            var files = Const.Audio.Formats.map(format =>
                Const.Path.Audio.Songs + song.file + "." + format
            );
            this.game.load.audio(song.file, files);
        });

        Const.Audio.Sounds.forEach(sound => {
            var files = Const.Audio.Formats.map(format =>
                Const.Path.Audio.Sounds + sound.file + "." + format
            );
            this.game.load.audio(sound.file, files);
        });

        this.soundManager = new SoundManager(this.game);
        this.soundManager.boot();
        Const.Audio.Songs.forEach(song => {
            this.songs[song.file] = this.soundManager.add(song.file);
            this.songs[song.file].volume = .1;
        });
        Const.Audio.Sounds.forEach(sound => this.sounds[sound.file] = this.soundManager.add(sound.file));

        this.game.state.onStateChange.add(this.onStateChange, this);

        var startSoundHandle = setInterval(() => {
            if (this.currSong && this.currSong.isPlaying) {
                clearInterval(startSoundHandle);
            } else {
                this.playCurrentSong();
            }
        }, 200);
    }

    onPlatformMatched() {
        this.onEffect(Effect.PlatformSuccess);
    }

    private onEffect(effect: Effect) {
        var soundsForEffect = Const.Audio.Sounds.filter(sound => sound.effect == effect);
        var sound = this.game.rnd.pick(soundsForEffect);
        this.sounds[sound.file].play();
    }

    private onStateChange(curr: string, prev: string) {
        this.startNewSong();
    }

    private startNewSong() {
        if (this.currSong) {
            this.currSong.onStop.removeAll();
        }

        this.currSong = this.chooseNewSongForState(this.game.state.current);

        if (this.currSong) {
            this.playCurrentSong();
            this.queueNextSong();
        }
    }

    private chooseNewSongForState(state: string): Sound {
        var songsForState = Const.Audio.Songs.filter(song => song.state === state);

        let song = this.game.rnd.pick(songsForState);
        while (song && this.currSong && songsForState.length > 1 &&
            this.songs[song.file] == this.currSong) {
            song = this.game.rnd.pick(songsForState);
        }

        return song && this.songs[song.file];
    }

    private playCurrentSong() {
        if (this.currSong && !this.currSong.isPlaying) {
            this.soundManager.stopAll();
            this.currSong.play();
        }
    }

    private queueNextSong() {
        this.currSong.onStop.addOnce(() => this.startNewSong());
    }
}