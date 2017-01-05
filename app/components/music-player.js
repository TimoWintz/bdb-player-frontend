import Ember from 'ember';

export default Ember.Component.extend({
    hifi: Ember.inject.service(), // music playing service
    queue: Ember.inject.service('play-queue'), //play queue service
    percentPlayed : Ember.computed('hifi.position', 'hifi.duration', { 
        get() {
            if (this.get('hifi.currentSound') !== null) {
                var pos = this.get('hifi.position');
                return Math.floor(100*pos/this.get('hifi.duration'));
            }
            else {
                return 0;
            }
        },
        set(key, value) {
            if (this.get('hifi.currentSound') !== null) {
                this.set('hifi.position', value/100* this.get('hifi.duration'));
                return value;
            }
            else {
                return 0;
            }
        }
    }),
    actions : {
        toggleMute() {
            this.get('queue').toggleProperty('muted');
        },
        play() {
            this.get('queue').play();
        },
        pause() {
            this.get('hifi').pause();
        },
        skip() {
            this.get('queue').skip();
        },
        previous() {
            this.get('queue').previous();
        }
    }
});
