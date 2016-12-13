import Ember from 'ember';

export default Ember.Component.extend({
    actions : {
        playTrack(albums, selected_track) {
            albums.map(function(album) {
                var first = true;
                album.tracks.map(function(track) {
                    if (first && selected_track === track) {
                        this.sendAction("playTrack", track);
                        first = false;
                    } 
                    else {
                        this.sendAction("addToPlayQueue", [track]);
                    }
                }.bind(this)); 
            }.bind(this));
        },
        addTrack(track) {
            this.sendAction("addToPlayQueue", [track]);
        },
        addAlbum(album) {
            this.sendAction("addToPlayQueue", album.tracks);
        },
        playAlbum(album) {
            this.sendAction("playTrack", album.tracks[0]);
            this.sendAction("addToPlayQueue", album.tracks.slice(1));
        }
    }
});
