import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Service.extend({
    items: null,
    hifi: Ember.inject.service(),
    lastVolume: null,
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
        this.empty();
        let current = this.get('hifi.currentSound');
        if (current) {
            current.stop();
            this.set('hifi.currentSound', null);
        }
    },
    play() {
        var current = this.get('hifi.currentSound'); 
        var that = this;
        if (current) {
            return this.get('hifi').play(current);
        } else {
            return new RSVP.Promise(function(resolve, reject) {
                var next = that.get('items').shiftObject();
                if (next) {
                    let url = '/file/' + next.id.toString();
                    that.get('hifi').play(url).then(({sound}) => {
                        that.set('currentTrack', next);
                        sound.track = next;
                        sound.on('audio-ended', () => { 
                            that.set('hifi.currentSound', null);
                            that.play();
                        });
                        sound.on('audio-played', () => { 
                            resolve();
                        });
                    }).catch(error => {
                        reject(error);
                    });
                }
            });
        }
    },
    skip() {
        var current = this.get('hifi.currentSound'); 
        var resume = this.get('hifi.isPlaying');
        if (current) {
            current.stop();
            this.set('hifi.currentSound', null);
            this.play().then(function() {
                if (!resume) {
                    this.get('hifi').pause();
                }
            }.bind(this));
        } else {
            this.get('items').shiftObject();
        }
    }
});
