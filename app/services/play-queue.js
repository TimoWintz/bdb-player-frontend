import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Service.extend({
    items: null,
    hifi: Ember.inject.service(),
    lastVolume: null,
    index: 0,
    isLast : Ember.computed('index', 'items.length', function() {
        return this.get('index') === (this.get('items.length') - 1);
    }),
    shuffle: false,
    repeat: false,
    init() {
        this._super(...arguments);
        this.set('items', []);
        this.set('lastVolume', this.get('hifi.volume'));
    },

    add(item) {
        this.get('items').pushObject(item);
    },

    remove(item) {
        this.get('items').removeObject(item);
    },

    empty() {
        this.get('items').setObjects([]);
        this.set('index', 0);
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
        var currentIndex = this.get('index');
        var track = this.get('items')[currentIndex];
        var current = this.get('hifi.currentSound');
        this.stop();
        if (current && track.id === current.track.id) {
            return this.get('hifi').play(current);
        }
        else {
            return new RSVP.Promise(function(resolve, reject) {
                if (track) {
                    let url = '/file/' + track.get('id').toString();
                    this.get('hifi').play(url).then(({sound}) => {
                        sound.set('track', track);
                        sound.on('audio-ended', (resume=true) => { 
                            if (!this.get('isLast')) {
                                this.set('index', currentIndex + 1);
                                this.play().then(() => {
                                    if (!resume) {
                                        this.get('hifi').pause();
                                    }
                                });
                            }
                        });
                        sound.on('audio-played', () => { 
                            if (!this.get('isLast')) {
                                var next = this.get('items')[currentIndex+1];
                                let url = '/file/' + next.get('id').toString();
                                this.get('hifi').load(url);
                            }
                            resolve();
                        });
                    }.bind(this)).catch(error => {
                        reject(error);
                    });
                }
                else {
                    reject();
                }
            }.bind(this));
        }
    },
    skip() {
        var current = this.get('hifi.currentSound'); 
        var resume = this.get('hifi.isPlaying');
        if (current) {
            this.get('hifi').stop();
            current.trigger('audio-ended', resume);
        }
    },
    previous() {
        var current = this.get('hifi.currentSound'); 
        if (current) {
            var resume = this.get('hifi.isPlaying');
            if(this.get('index') > 0 && this.get('hifi.position') < 1000) {
                this.decrementProperty('index');
            }
            current.stop();
            this.play().then(function() {
                if (!resume) {
                    this.get('hifi').pause();
                }
            }.bind(this));
        }
    }
});
