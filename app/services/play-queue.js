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
        let current = this.get('hifi.currentSound');
        if (current) {
            current.stop();
            this.set('index', 0);
            this.set('hifi.currentSound', null);
        }
    },
    play() {
        var current = this.get('hifi.currentSound'); 
        if (current) {
            return this.get('hifi').play(current);
        } else {
            return new RSVP.Promise(function(resolve, reject) {
                var track = this.get('items')[this.get('index')];
                if (track) {
                    let url = '/file/' + track.get('id').toString();
                    this.get('hifi').play(url).then(({sound}) => {
                        sound.set('track', track);
                        sound.on('audio-ended', () => { 
                            this.set('hifi.currentSound', null);
                            if (!this.get('isLast')) {
                                this.incrementProperty('index');
                                this.play();
                            }
                        });
                        sound.on('audio-played', () => { 
                            resolve();
                        });
                    }).catch(error => {
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
        console.log('skip');
        if (current) {
            if (!this.get('isLast')) {
                this.incrementProperty('index');
                current.stop();
                this.set('hifi.currentSound', null);
                this.play().then(function() {
                    if (!resume) {
                        this.get('hifi').pause();
                    }
                }.bind(this));
            }
            else {
                current.stop();
                this.set('hifi.currentSound', null);
                console.log('is last');
            }
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
            this.set('hifi.currentSound', null);
            this.play().then(function() {
                if (!resume) {
                    this.get('hifi').pause();
                }
            }.bind(this));
        }
    }
});
