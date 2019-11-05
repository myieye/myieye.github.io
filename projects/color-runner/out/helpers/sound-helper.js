define(["require", "exports", "phaser-ce", "./const"], function (require, exports, phaser_ce_1, const_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SoundHelper = /** @class */ (function () {
        function SoundHelper() {
            this.songs = [];
            this.sounds = {};
        }
        Object.defineProperty(SoundHelper, "Instance", {
            get: function () {
                return SoundHelper.instance = (SoundHelper.instance || new SoundHelper());
            },
            enumerable: true,
            configurable: true
        });
        SoundHelper.prototype.init = function (game) {
            var _this = this;
            this.game = game;
            const_1.Const.Audio.Songs.forEach(function (song) {
                var files = const_1.Const.Audio.Formats.map(function (format) {
                    return const_1.Const.Path.Audio.Songs + song.file + "." + format;
                });
                _this.game.load.audio(song.file, files);
            });
            const_1.Const.Audio.Sounds.forEach(function (sound) {
                var files = const_1.Const.Audio.Formats.map(function (format) {
                    return const_1.Const.Path.Audio.Sounds + sound.file + "." + format;
                });
                _this.game.load.audio(sound.file, files);
            });
            this.soundManager = new phaser_ce_1.SoundManager(this.game);
            this.soundManager.boot();
            const_1.Const.Audio.Songs.forEach(function (song) {
                _this.songs[song.file] = _this.soundManager.add(song.file);
                _this.songs[song.file].volume = .1;
            });
            const_1.Const.Audio.Sounds.forEach(function (sound) { return _this.sounds[sound.file] = _this.soundManager.add(sound.file); });
            this.game.state.onStateChange.add(this.onStateChange, this);
            var startSoundHandle = setInterval(function () {
                if (_this.currSong && _this.currSong.isPlaying) {
                    clearInterval(startSoundHandle);
                }
                else {
                    _this.playCurrentSong();
                }
            }, 200);
        };
        SoundHelper.prototype.onPlatformMatched = function () {
            this.onEffect(const_1.Effect.PlatformSuccess);
        };
        SoundHelper.prototype.onEffect = function (effect) {
            var soundsForEffect = const_1.Const.Audio.Sounds.filter(function (sound) { return sound.effect == effect; });
            var sound = this.game.rnd.pick(soundsForEffect);
            this.sounds[sound.file].play();
        };
        SoundHelper.prototype.onStateChange = function (curr, prev) {
            this.startNewSong();
        };
        SoundHelper.prototype.startNewSong = function () {
            if (this.currSong) {
                this.currSong.onStop.removeAll();
            }
            this.currSong = this.chooseNewSongForState(this.game.state.current);
            if (this.currSong) {
                this.playCurrentSong();
                this.queueNextSong();
            }
        };
        SoundHelper.prototype.chooseNewSongForState = function (state) {
            var songsForState = const_1.Const.Audio.Songs.filter(function (song) { return song.state === state; });
            var song = this.game.rnd.pick(songsForState);
            while (song && this.currSong && songsForState.length > 1 &&
                this.songs[song.file] == this.currSong) {
                song = this.game.rnd.pick(songsForState);
            }
            return song && this.songs[song.file];
        };
        SoundHelper.prototype.playCurrentSong = function () {
            if (this.currSong && !this.currSong.isPlaying) {
                this.soundManager.stopAll();
                this.currSong.play();
            }
        };
        SoundHelper.prototype.queueNextSong = function () {
            var _this = this;
            this.currSong.onStop.addOnce(function () { return _this.startNewSong(); });
        };
        return SoundHelper;
    }());
    exports.default = SoundHelper;
});
//# sourceMappingURL=sound-helper.js.map