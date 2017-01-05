import Ember from 'ember';

export default Ember.Component.extend({
    replace : false,
    play: false,
    type: null,
    objectId: null,
    playQueue : Ember.inject.service('play-queue'),
    store: Ember.inject.service(),
    tagName: 'a',
    click() {
        if (this.get('replace')) {
            this.get('playQueue').empty();
        }
        var numberOfTracks = this.get('playQueue').get('items').length;
        var first = true;
        if (this.get('type') === "album") {
            var album = this.get('store').query('item', {filter : {album_id : this.get('objectId')}}); 
            album.then(function() {
                album.map(function(item) {
                    this.get('playQueue').add(item);
                    if (first && this.get('play')) {
                        this.get('playQueue').set('index', numberOfTracks);
                        this.get('playQueue').play();
                    }
                    first = false;
                }.bind(this));
            }.bind(this));
        } else if (this.get('type') === "track") {
            var track = this.get('store').find('item', this.get('objectId'));
            track.then(function() {
                this.get('playQueue').add(track);
                if (this.get('play')) {
                    this.get('playQueue').set('index', numberOfTracks);
                    this.get('playQueue').play();
                }
            }.bind(this));
        }
    }
});
