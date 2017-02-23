import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Service.extend({
    hifi: Ember.inject.service(),
    store: Ember.inject.service(),
    lastVolume: null,

    items: null,
    previousIndices: null,
    playingIndex: null,
    maxIndex: null,

    shuffle: false,
    repeat: false,
    continue: false,

    isLast : Ember.computed('playingIndex', 'items.length', function() {
        return this.get('playingIndex') === (this.get('items.length') - 1);
    }),


    init() {
        this._super(...arguments);
        this.set('items', []);
        this.set('previousIndices', []);
        this.set('maxIndex', 0);
        this.set('lastVolume', this.get('hifi.volume'));
    },

    add(item) {
        this.get('items').pushObject({track: item, index: this.get('maxIndex')});
        this.incrementProperty('maxIndex');
    },

    remove(item) {
        this.get('items').removeObject(item);
    },

    empty() {
        this.get('items').setObjects([]);
        this.get('previousIndices').setObjects([]);
        this.set('maxIndex', 0);
        this.set('playingIndex', null);
    },

    muted: Ember.computed('hifi.volume', 'lastVolume', { get() {
        return this.get('hifi.volume') === 0;
    }, set(key, val) {
        if (val === false) {
            if (this.get('hifi.volume') === 0) {
                this.set('hifi.volume', this.get('lastVolume'));
            }
            return false;
        } else if (val === true) {
            if (this.get('hifi.volume') !== 0) {
                this.set('lastVolume', this.get('hifi.volume'));
                this.set('hifi.volume', 0);
            }
            return true;
        }
    }}),

    stop() {
        var current = this.get('hifi.currentSound'); 
        if (current) {
            this.get('hifi').stop();
        }
    },

    play() {
        var playingIndex = this.get('playingIndex');
        var item = this.get('items')[playingIndex];
        var current = this.get('hifi.currentSound');
        if (current && item.track.id === current.track.id) {
            return this.get('hifi').play(current);
        }
        else {
            this.get('previousIndices').pushObject(playingIndex);
            this.stop();
            return new RSVP.Promise(function(resolve, reject) {
                if (item) {
                    let url = '/file/' + item.track.get('id').toString();
                    this.get('hifi').play(url).then(({sound}) => {
                        sound.set('track', item.track);
                        sound.on('audio-ended', () => { 
                            if(this.get('playingIndex') === playingIndex) {
                                this.playNext();
                            }
                            });
                        sound.on('audio-played', () => { 
                            resolve();
                        });
                    }.bind(this)).catch(error => {
                        reject(error);
                    });
                }
                else {
                    reject("Could not get track at index");
                }
            }.bind(this));
        }
    },

    playNext() {
        var index = this.get('playingIndex');
        var next=null;
        if (this.get('shuffle')) {
            next = Math.floor((Math.random() * this.get('items.length')));
        } else {
            if (!this.get('isLast')) {
                next = index + 1;
            }
            else if (this.get('repeat')) {
                next = 0;
            }
            else if (this.get('continue')) { //Search for next track in album if "continue" is on
                var lastItem = this.get('items')[this.get('items.length') - 1].track;
                var albumId = lastItem.get('album_id'),
                    track = lastItem.get('track'),
                    disc = lastItem.get('disc'),
                    that = this;
                var nextItem = this.get('store').query('item', {filter : { album_id : albumId}});
                nextItem.then(function(value) {
                    console.log(value.get('length'));
                    for (var i = 0; i < value.get('length'); i++) {
                        var item = value.objectAt(i);
                        console.log(item.get('disc'));
                        console.log(item.get('track'));
                        if (item.get('disc') === disc && item.get('track') === track+1) {
                            that.add(item);
                            that.incrementProperty('playingIndex');
                            console.log(item);
                            return that.play();
                        } 
                        if (item.disc === disc+1 && item.track === 1) {
                            that.add(item);
                            that.incrementProperty('playingIndex');
                            return that.play();
                        } 
                    }
                    that.stop();
                    return RSVP.resolve();
                }, function() {
                    that.stop();
                    return RSVP.resolve();
                });
            }
        }
        if (next !== null) {
            this.set('playingIndex', next);
            return this.play();
        }
        this.stop();
        return RSVP.resolve();
    },

    playPrevious() {
        var index = this.get('playingIndex');
        if (index > 0) {
            this.decrementProperty('playingIndex');
            return this.play();
        }
        return RSVP.resolve();
    },
    send(replace, play, type, search, id) {
        //This function looks in the database for requested items and adds them to the queue
        if (replace) {
            this.empty();
            this.stop();
        }
        var numberOfTracks = this.get('items').length;
        var first = true;
        var album;
        if (type === "album") {
            album = this.get('store').query('item', {filter : {album_id : id}}); 
            album.then(function() {
                album.map(function(item) {
                    this.add(item);
                    if (first && play) {
                        this.set('playingIndex', numberOfTracks);
                        this.play();
                    }
                    first = false;
                }.bind(this));
            }.bind(this));
        } else if (type === "track") {
            var foundTrack = false;
            var track = this.get('store').find('item', id);
            track.then(function(value) {
                if (search) {
                    var items = this.get('items');
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].track.get('id') === value.get('id')) {
                            this.set('playingIndex', items[i].index);
                            this.stop();
                            this.play();
                            foundTrack = true;
                            break;
                        }
                    }
                }
                if (!foundTrack) {
                    this.add(value);
                    if (play) {
                        this.set('playingIndex', numberOfTracks);
                        this.stop();
                        this.play();
                    }
                }
            }.bind(this));
        } else if (type === "path") {
            album = this.get('store').query('item', {filter : {path : id}}); 
            album.then(function() {
                album.map(function(item) {
                    this.add(item);
                    if (first && play) {
                        this.set('playingIndex', numberOfTracks);
                        this.play();
                    }
                    first = false;
                }.bind(this));
            }.bind(this));
        }
    }

});
