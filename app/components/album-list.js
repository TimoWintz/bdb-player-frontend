import Ember from 'ember';
let trackList = Ember.Object.extend({
    // using standard ascending sort
    trackSorting: ['disc', 'track'],
    sortedTracks: Ember.computed.sort('tracks', 'trackSorting'),
});

export default Ember.Component.extend({
    actions : {
        showArtist: function(group) {
            this.sendAction("show", group);
        },
        showAlbum: function(album) {
            this.sendAction("show", album);
        },
        playAlbum: function(album) {
            var album_id = album.get('id');
            var tracks = album.get('store').query('item', 'album_id:'+album_id.toString());
            tracks.then(function(tracks) {
                var sortedTracks =  trackList.create({tracks : tracks}).get('sortedTracks');
                var track = sortedTracks.shiftObject();
                this.sendAction("playTrack", track);
                this.sendAction("addToPlayQueue", tracks);
            }.bind(this));
        },
        playArtist: function(group) {
            var first = true;
            group.items.map(function(album) {
                var album_id = album.get('id');
                var tracks = album.get('store').query('item', 'album_id:'+album_id.toString());
                tracks.then(function(tracks) {
                    var sortedTracks =  trackList.create({tracks : tracks}).get('sortedTracks');
                    if (first) {
                        var track = sortedTracks.shiftObject();
                        this.sendAction("playTrack", track);
                        first = false;
                    }
                    this.sendAction("addToPlayQueue", sortedTracks);
                }.bind(this));
            }.bind(this));
        }
    }
});
