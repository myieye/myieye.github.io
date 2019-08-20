ColorRunner.soundHelper = (function() {
    
    var CR = ColorRunner;
    var soundManager;
    var currSong;

    function preload(game) {
        CR.audio.songs.forEach(song => {
            var files = CR.audio.formats.map(format => 
                CR.const.paths.audio + song.file + "." + format
            );
            game.load.audio(song.file, files);
        });
    }

    function create(game) {
        this.soundManager = soundManager = new Phaser.SoundManager(game);
        soundManager.boot();
        CR.audio.songs.forEach(song => song.instance = soundManager.add(song.file));

        game.state.onStateChange.add(_onStateChange);
        
        var startSoundHandle = setInterval(() => {
            if (currSong && !currSong.isPlaying) {
                _playCurrentSong();
            } else {
                clearInterval(startSoundHandle);
            }
        }, 100);
    }

    function _onStateChange(curr, prev) {
        currSong = _chooseSongForState(curr);
        if (currSong) {
            _playCurrentSong();
        }
    }

    function _chooseSongForState(state) {
        var songsForState = CR.audio.songs.filter(song => song.state === state);
        var song = game.rnd.pick(songsForState);
        return song && song.instance;
    }

    function _playCurrentSong() {
        if (!currSong.isPlaying) {
            soundManager.stopAll();
            currSong.play();
        }
    }

    return {
        preload: preload,
        create: create,
        soundManager: soundManager
    }

})();