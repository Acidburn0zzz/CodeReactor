/**
 * @author      Alex Mourtziapis <alex.mourtziapis@gmail.com>
 * @license     {@link http://opensource.org/licenses/MIT|MIT License}
 */

SoundPlayer = function (Code_Reactor) {

    global.Code_Reactor = Code_Reactor;

    this.player = undefined;

    this.currentTrack = 0;

    this.response = undefined;

    this.isPlaying = false;
};

SoundPlayer.prototype = {

    init: function () {

        SC.initialize({
            client_id: '8c4d05ea73a96fa248223b8bbaac971d'
        });

        SC.resolve(Code_Reactor.playlistURL).then(function (response) {
            //console.log(JSON.stringify(response));
            Code_Reactor.SoundPlayer.response = response;
        });
    },

    play: function () {

        if (Code_Reactor.SoundPlayer.player === null) {
            SC.stream('/tracks/' + Code_Reactor.SoundPlayer.response.tracks[Code_Reactor.SoundPlayer.currentTrack].id).then(function (player) {
                Code_Reactor.SoundPlayer.player = player;
                Code_Reactor.SoundPlayer.player.play();
                document.getElementById('song_playin').innerHTML = Code_Reactor.SoundPlayer.response.tracks[Code_Reactor.SoundPlayer.currentTrack].title;
                Code_Reactor.SoundPlayer.isPlaying = true;
                Code_Reactor.SoundPlayer.player.setVolume(1.0);

                Code_Reactor.SoundPlayer.player.on('finish', function () {
                    if ((Code_Reactor.SoundPlayer.currentTrack + 1) !== Code_Reactor.SoundPlayer.response.track_count) {
                        Code_Reactor.SoundPlayer.currentTrack++;
                        Code_Reactor.SoundPlayer.player = null;

                        Code_Reactor.SoundPlayer.play();
                    }
                });
            });
        } else {
            Code_Reactor.SoundPlayer.toggle();
        }
    },

    toggle: function () {
        if (Code_Reactor.SoundPlayer.player !== null) {

            if (Code_Reactor.SoundPlayer.isPlaying) {

                Code_Reactor.SoundPlayer.player.pause();
                Code_Reactor.SoundPlayer.isPlaying = false;
            } else {

                Code_Reactor.SoundPlayer.player.play();
                Code_Reactor.SoundPlayer.isPlaying = true;
            }
        }
    },

    increase_volume: function () {
        if (Code_Reactor.SoundPlayer.player !== null) {

            var step = 0.1;
            var volume = Code_Reactor.SoundPlayer.player.getVolume();
            if (volume + step > 1.0) {
                volume = 1.0;
            } else {
                volume += step;
            }
            Code_Reactor.SoundPlayer.player.setVolume(volume);
        }
    },

    decrease_volume: function () {
        if (Code_Reactor.SoundPlayer.player !== null) {

            var step = 0.1;
            var volume = Code_Reactor.SoundPlayer.player.getVolume();
            if (volume - step < 0.0) {
                volume = 0.0;
            } else {
                volume -= step;
            }
            Code_Reactor.SoundPlayer.player.setVolume(volume);
        }
    },

    play_next: function () {
        if (Code_Reactor.SoundPlayer.player !== null) {

            if ((Code_Reactor.SoundPlayer.currentTrack + 1) !== Code_Reactor.SoundPlayer.response.track_count) {

                if (Code_Reactor.SoundPlayer.isPlaying) {
                    Code_Reactor.SoundPlayer.player.pause();
                    Code_Reactor.SoundPlayer.isPlaying = false;
                }

                Code_Reactor.SoundPlayer.currentTrack++;
                Code_Reactor.SoundPlayer.player = null;

                Code_Reactor.SoundPlayer.play();
            }
        }
    },

    play_previous: function () {
        if (Code_Reactor.SoundPlayer.player !== null) {

            if (Code_Reactor.SoundPlayer.currentTrack !== 0) {

                if (Code_Reactor.SoundPlayer.isPlaying) {
                    Code_Reactor.SoundPlayer.player.pause();
                    Code_Reactor.SoundPlayer.isPlaying = false;
                }

                Code_Reactor.SoundPlayer.currentTrack--;
                Code_Reactor.SoundPlayer.player = null;

                Code_Reactor.SoundPlayer.play();
            }
        }
    }
};

module.exports = SoundPlayer;
