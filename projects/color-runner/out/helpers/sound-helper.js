define(["require", "exports", "./settings"], function (require, exports, settings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SoundHelper = /** @class */ (function () {
        function SoundHelper() {
            this.songs = [];
        }
        Object.defineProperty(SoundHelper, "Instance", {
            get: function () {
                return SoundHelper.instance = (SoundHelper.instance || new SoundHelper());
            },
            enumerable: true,
            configurable: true
        });
        SoundHelper.prototype.init = function (game) {
            this.game = game;
        };
        SoundHelper.prototype.preload = function () {
            var _this = this;
            settings_1.Const.Audio.Songs.forEach(function (song) {
                var files = settings_1.Const.Audio.Formats.map(function (format) {
                    return settings_1.Const.Path.Audio.Songs + song.file + "." + format;
                });
                _this.game.load.audio(song.file, files);
            });
        };
        SoundHelper.prototype.create = function () {
            var _this = this;
            var soundManager = this.soundManager = new Phaser.SoundManager(this.game);
            soundManager.boot();
            settings_1.Const.Audio.Songs.forEach(function (song) { return _this.songs[song.file] = soundManager.add(song.file); });
            this.game.state.onStateChange.add(this.onStateChange, this);
            var startSoundHandle = setInterval(function () {
                if (_this.currSong && !_this.currSong.isPlaying) {
                    _this.playCurrentSong();
                }
                else {
                    clearInterval(startSoundHandle);
                }
            }, 100);
        };
        SoundHelper.prototype.onStateChange = function (curr, prev) {
            this.currSong = this.chooseSongForState(curr);
            if (this.currSong) {
                this.playCurrentSong();
            }
        };
        SoundHelper.prototype.chooseSongForState = function (state) {
            var songsForState = settings_1.Const.Audio.Songs.filter(function (song) { return song.state === state; });
            var song = this.game.rnd.pick(songsForState);
            return song && this.songs[song.file];
        };
        SoundHelper.prototype.playCurrentSong = function () {
            if (!this.currSong.isPlaying) {
                this.soundManager.stopAll();
                this.currSong.play();
            }
        };
        return SoundHelper;
    }());
    exports.default = SoundHelper;
});
//# sourceMappingURL=sound-helper.js.map