/**
 * @author      Alex Mourtziapis <alex.mourtziapis@gmail.com>
 * @license     {@link http://opensource.org/licenses/MIT|MIT License}
 */

Code_Reactor.SoundPlayer = {

    player: null,

    currentTrack: 0,

    response: null,

    init: function () {

        SC.initialize({
            client_id: '8c4d05ea73a96fa248223b8bbaac971d'
        });

        SC.resolve('https://soundcloud.com/alex-mourtziapis/sets/coding-playlist').then(function (response) {
            //console.log(JSON.stringify(response));
            Code_Reactor.SoundPlayer.response = response;
        });
    },

    play: function () {

        if (Code_Reactor.SoundPlayer.player === null) {
            SC.stream('/tracks/' + Code_Reactor.SoundPlayer.response.tracks[Code_Reactor.SoundPlayer.currentTrack].id).then(function (player) {
                Code_Reactor.SoundPlayer.player = player;
                Code_Reactor.SoundPlayer.player.play();
                Code_Reactor.SoundPlayer.player.setVolume(1.0);

                Code_Reactor.SoundPlayer.player.on('finish', function () {
                    if ((Code_Reactor.SoundPlayer.currentTrack + 1) !== Code_Reactor.SoundPlayer.response.track_count) {
                        Code_Reactor.SoundPlayer.currentTrack++;
                        Code_Reactor.SoundPlayer.player = null;

                        Code_Reactor.SoundPlayer.play();
                    }
                });
            });
        }
    }
};
