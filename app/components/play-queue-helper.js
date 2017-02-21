import Ember from 'ember';

export default Ember.Component.extend({
    replace : false,
    play: false,
	search: false,
    type: null,
    path: null,
    objectId: null,
    playQueue : Ember.inject.service('play-queue'),
    store: Ember.inject.service(),
    tagName: 'a',
    click() {
        if (this.get('replace')) {
            this.get('playQueue').empty();
            this.get('playQueue').stop();
        }
        var numberOfTracks = this.get('playQueue').get('items').length;
        var first = true;
        var album;
        if (this.get('type') === "album") {
            album = this.get('store').query('item', {filter : {album_id : this.get('objectId')}}); 
            album.then(function() {
                album.map(function(item) {
                    this.get('playQueue').add(item);
                    if (first && this.get('play')) {
                        this.get('playQueue').set('playingIndex', numberOfTracks);
                        this.get('playQueue').play();
                    }
                    first = false;
                }.bind(this));
            }.bind(this));
        } else if (this.get('type') === "track") {
            var foundTrack = false;
            var track = this.get('store').find('item', this.get('objectId'));
            track.then(function(value) {
                if (this.get('search')) {
                    var items = this.get('playQueue.items');
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].track.get('id') === value.get('id')) {
                            this.set('playQueue.playingIndex', items[i].index);
                            this.get('playQueue').stop();
                            this.get('playQueue').play();
                            foundTrack = true;
                            break;
                        }
                    }
                }
                if (!foundTrack) {
                    this.get('playQueue').add(value);
                    if (this.get('play')) {
                        this.get('playQueue').set('playingIndex', numberOfTracks);
                        this.get('playQueue').stop();
                        this.get('playQueue').play();
                    }
                }
            }.bind(this));
        } else if (this.get('type') === "path") {
            album = this.get('store').query('item', {filter : {path : this.get('objectId')}}); 
            album.then(function() {
                album.map(function(item) {
                    this.get('playQueue').add(item);
                    if (first && this.get('play')) {
                        this.get('playQueue').set('playingIndex', numberOfTracks);
                        this.get('playQueue').play();
                    }
                    first = false;
                }.bind(this));
            }.bind(this));
        }
    }
});
