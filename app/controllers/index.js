import Ember from 'ember';
import groupBy from 'ember-group-by';

let trackList = Ember.Object.extend({
    // using standard ascending sort
    trackSorting: ['disc', 'track'],
    sortedTracks: Ember.computed.sort('tracks', 'trackSorting'),
});


export default Ember.Controller.extend({
    artists : groupBy('model', 'albumartist'), //Group albums by artist
    appController: Ember.inject.controller('application'),
    shownAlbums : [], //Album displayed in the right pane
    shownAlbumSource : [],
    actions : {
        showAlbums : function(group) {
            if (this.shownAlbumSource !== group) { //Do not refresh if the album is already displayed
                this.set('shownAlbumSource', group);
                if (!group.items) {
                    group = {items : [group]};
                }
                var shownAlbums = [];
                this.set('shownAlbums', shownAlbums);
                group.items.map(function(item) {
                    var album_id = item.get('id');
                    var tracks = item.get('store').query('item', 'album_id:'+album_id.toString());
                    tracks.then(function(tracks) {
                        var sortedTracks =  trackList.create({tracks : tracks}).get('sortedTracks');
                        shownAlbums.pushObject({tracks : sortedTracks, album : item.get('album')});
                    });
                });
            }
        },
        playTrack : function(track) {
            this.get('appController').send("playTrack", track);
        },
        addToPlayQueue : function(tracks) {
            this.get('appController').send("addToPlayQueue", tracks);
        }
    }
});
