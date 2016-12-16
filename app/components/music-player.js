import Ember from 'ember';

export default Ember.Component.extend({
    hifi: Ember.inject.service(), // music playing service
    queue: Ember.inject.service('play-queue'),
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
        play() {
            var current = this.get('hifi').currentSound; 
            if (current) {
                this.get('hifi').play(current);
            } else {
                var next = this.get('queue').shift();
                if (next) {
                    let url = '/file/' + next.id.toString();
                    this.get('hifi').play(url).then(({sound}) => {
                        sound.on('audio-ended', () => {
                            this.send('play');
                        });
                    }).catch(error => {
                        console.log(error);
                        this.send('play');
                    });
                }
            }
        },
        pause() {
            var current = this.get('hifi').currentSound; 
            if (current) {
                this.get('hifi').pause();
            }
        },
        skip() {
            var current = this.get('hifi').currentSound; 
            if (current) {
                this.get('hifi').stop();
                this.send('play');
            } else {
                this.get('queue').shift();
            }
        }
    }
});
